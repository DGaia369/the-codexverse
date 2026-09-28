import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, getStripeWebhookSecret } from '@/utils/stripe';
import { REMEMBER_FOUNDING_ACCESS } from '@/utils/offers';
import {
  grantVerifiedAcquisitionEntitlement,
  revokeDisputedAcquisition,
  revokeRefundedAcquisition,
} from '@/utils/entitlements';

// POST /api/stripe/webhook
//
// Launch Sprint 2, Part B. The ONLY path by which a payment becomes an
// entitlement. Stripe verifies payment; this route checks the verified
// payment against the server-side offer, then the codeXverse™ records the
// acquisition and grants 'verified_acquisition'.
//
// - The signature is verified against the raw body. An unsigned or
//   unverifiable payload returns 400 and grants nothing.
// - Only these events are processed: checkout.session.completed,
//   checkout.session.async_payment_succeeded, charge.refunded,
//   charge.dispute.closed. Anything else is acknowledged and ignored,
//   including every other charge.dispute.* event.
// - Disputes (Founder ruling 2026-09-27): access is revoked ONLY when a
//   dispute closes as 'lost'. Won, warning_closed, and every other status
//   change nothing. There is no suspension or reinstatement.
// - Idempotent: the database keys acquisitions on the Checkout Session id
//   (record_verified_acquisition), so a retried event creates nothing new.
// - A verified payment that does not match the offer (amount, currency,
//   product, offer, mode, user reference) is logged and grants nothing.
//   It returns 200 because a retry cannot change a signed payload.
// - Database/configuration failures return 500 so Stripe retries.
// - The sales gate is deliberately not consulted: a payment Stripe has
//   verified is always recorded.

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function ok(note: string) {
  return NextResponse.json({ received: true, note });
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let stripe: Stripe;
  let secret: string;
  try {
    stripe = getStripe();
    secret = getStripeWebhookSecret();
  } catch (error) {
    console.error('Stripe webhook: not configured:', (error as Error).message);
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        return await handlePaidSession(event.data.object, event.livemode);
      case 'charge.refunded':
        return await handleRefundedCharge(stripe, event.data.object);
      case 'charge.dispute.closed':
        return await handleClosedDispute(stripe, event.data.object);
      default:
        return ok('ignored');
    }
  } catch (error) {
    console.error('Stripe webhook: processing failed:', {
      eventId: event.id,
      type: event.type,
      message: (error as Error).message,
    });
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function handlePaidSession(session: Stripe.Checkout.Session, livemode: boolean) {
  const offer = REMEMBER_FOUNDING_ACCESS;
  const metadata = session.metadata ?? {};

  // Not a Founding Access session: not ours to act on.
  if (metadata.offer_key !== offer.offerKey) {
    return ok('not_this_offer');
  }

  // Completed but not yet paid (a delayed payment method). The matching
  // checkout.session.async_payment_succeeded event will follow if it
  // succeeds.
  if (session.payment_status !== 'paid') {
    return ok('not_paid');
  }

  const userId = session.client_reference_id ?? '';
  const rejection =
    session.mode !== 'payment'
      ? 'mode'
      : session.amount_total !== offer.amount
        ? 'amount'
        : session.currency !== offer.currency
          ? 'currency'
          : metadata.product_key !== offer.productKey
            ? 'product'
            : !UUID_PATTERN.test(userId) || metadata.user_id !== userId
              ? 'user_reference'
              : null;

  if (rejection) {
    console.error('Stripe webhook: paid session rejected, nothing granted:', {
      checkoutSessionId: session.id,
      reason: rejection,
    });
    return ok('rejected');
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const result = await grantVerifiedAcquisitionEntitlement({
    userId,
    productKey: offer.productKey,
    offerKey: offer.offerKey,
    checkoutSessionId: session.id,
    paymentIntentId,
    livemode,
    amount: offer.amount,
    currency: offer.currency,
  });

  return ok(result.entitlementCreated ? 'granted' : 'already_recorded');
}

async function handleRefundedCharge(stripe: Stripe, charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : (charge.payment_intent?.id ?? null);

  if (!paymentIntentId) {
    return ok('no_payment_intent');
  }

  // Partial refunds leave access in place in V1 (Stripe sets `refunded`
  // only when the charge is fully refunded).
  if (!charge.refunded) {
    return ok('partial_refund_no_change');
  }

  const result = await revokeRefundedAcquisition({
    paymentIntentId,
    reason: 'Stripe full refund',
  });

  if (result) {
    return ok(result.changed ? 'revoked' : 'already_revoked');
  }

  return await unrecordedPayment(stripe, paymentIntentId, 'Refund');
}

async function handleClosedDispute(stripe: Stripe, dispute: Stripe.Dispute) {
  // Only a definitively lost dispute revokes access. Won, warning_closed,
  // and any other status are acknowledged with no change.
  if (dispute.status !== 'lost') {
    return ok('dispute_not_lost_no_change');
  }

  const paymentIntentId =
    typeof dispute.payment_intent === 'string'
      ? dispute.payment_intent
      : (dispute.payment_intent?.id ?? null);

  if (!paymentIntentId) {
    return ok('no_payment_intent');
  }

  const result = await revokeDisputedAcquisition({
    paymentIntentId,
    disputeId: dispute.id,
    reason: 'Stripe dispute lost',
  });

  if (result) {
    return ok(result.changed ? 'revoked' : 'already_revoked');
  }

  return await unrecordedPayment(stripe, paymentIntentId, 'Lost dispute');
}

// No acquisition carries this PaymentIntent. If it belongs to Founding
// Access, the payment has not been recorded yet (events can arrive out of
// order), so fail and let Stripe retry. Otherwise it is not ours.
async function unrecordedPayment(stripe: Stripe, paymentIntentId: string, what: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.metadata?.offer_key === REMEMBER_FOUNDING_ACCESS.offerKey) {
    throw new Error(`${what} arrived before its acquisition was recorded.`);
  }

  return ok('not_this_offer');
}
