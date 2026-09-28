import { NextResponse } from 'next/server';
import { authorizeRememberAccess } from '@/utils/authorization';
import { getRedirectForIneligibility } from '@/utils/remember';
import { isPurchasePathAvailable } from '@/utils/salesGate';
import { REMEMBER_FOUNDING_ACCESS } from '@/utils/offers';
import { getStripe } from '@/utils/stripe';

// POST /api/remember/checkout  (form post from /remember/purchase)
//
// Launch Sprint 2. Creates a Stripe Checkout Session for Founding Access,
// server-side. The request body is ignored entirely: amount, currency,
// product, and offer come from utils/offers.ts, and the participant comes
// from the authenticated Supabase session via authorizeRememberAccess().
//
// This route grants nothing. Entitlement is granted only by the verified
// Stripe webhook. The success URL leads to /remember/confirm, which only
// re-checks authorization.

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;

  // Same-origin form posts only.
  const requestOrigin = request.headers.get('origin');
  if (requestOrigin && requestOrigin !== origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!isPurchasePathAvailable()) {
    return redirectTo(request, '/pathways#remember');
  }

  let authorization;
  try {
    authorization = await authorizeRememberAccess();
  } catch (error) {
    console.error('Checkout: authorization failed:', (error as Error).message);
    return redirectTo(request, '/remember/purchase?status=unavailable');
  }

  if (!authorization.eligible) {
    return redirectTo(
      request,
      authorization.reason === 'unauthenticated'
        ? '/enter?next=remember-checkout'
        : getRedirectForIneligibility(authorization)
    );
  }

  // Already entitled: never start a second purchase.
  if (authorization.entitled) {
    return redirectTo(request, '/remember');
  }

  const offer = REMEMBER_FOUNDING_ACCESS;
  const metadata = {
    user_id: authorization.userId,
    product_key: offer.productKey,
    offer_key: offer.offerKey,
  };

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: offer.currency,
            unit_amount: offer.amount,
            product_data: { name: offer.checkoutName },
          },
        },
      ],
      client_reference_id: authorization.userId,
      customer_email: authorization.email,
      metadata,
      payment_intent_data: { metadata },
      success_url: `${origin}/remember/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pathways#remember`,
    });

    if (!session.url) {
      throw new Error('Checkout Session has no URL.');
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error('Checkout: session creation failed:', (error as Error).message);
    return redirectTo(request, '/remember/purchase?status=unavailable');
  }
}
