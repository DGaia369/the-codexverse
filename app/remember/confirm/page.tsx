import { redirect } from 'next/navigation';
import { authorizeRememberAccess } from '@/utils/authorization';
import { REMEMBER_FOUNDING_ACCESS } from '@/utils/offers';
import { getStripe } from '@/utils/stripe';
import CommerceFrame from '../CommerceFrame';
import ConfirmWaiting from './ConfirmWaiting';

// /remember/confirm: post-checkout entry (Launch Sprint 2).
//
// Stripe's success redirect lands here, never on /remember directly: the
// webhook that grants the entitlement may finish after the browser returns.
// This page GRANTS NOTHING. It only re-checks authorization:
//
//   authorized                     -> /remember
//   unauthenticated                -> /enter?next=remember-confirm
//   not yet entitled, and the Checkout Session in the URL belongs to this
//   participant and is paid        -> calm "being verified" state that
//                                     polls /api/remember/access (bounded)
//   anything else                  -> neutral "cannot confirm" state, no
//                                     internal detail
//
// The session_id is only used to decide which of the last two states to
// show. It is checked against the authenticated participant and never
// trusted for access. The participant-facing lines are Founder-approved V1
// copy (2026-09-28; docs/architecture/commerce.md).

type ConfirmPageProps = {
  searchParams?: Promise<{ session_id?: string }>;
};

const CHECKOUT_SESSION_PATTERN = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

async function isPaidSessionFor(userId: string, sessionId: string | undefined) {
  if (!sessionId || !CHECKOUT_SESSION_PATTERN.test(sessionId)) return false;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return (
      session.client_reference_id === userId &&
      session.metadata?.offer_key === REMEMBER_FOUNDING_ACCESS.offerKey &&
      session.payment_status === 'paid'
    );
  } catch (error) {
    console.error('Confirm: session lookup failed:', (error as Error).message);
    return false;
  }
}

export default async function RememberConfirmPage({ searchParams }: ConfirmPageProps) {
  const authorization = await authorizeRememberAccess();

  if (authorization.authorized) {
    redirect('/remember');
  }

  if (!authorization.eligible && authorization.reason === 'unauthenticated') {
    redirect('/enter?next=remember-confirm');
  }

  const paid =
    authorization.eligible &&
    (await isPaidSessionFor(authorization.userId, (await searchParams)?.session_id));

  return (
    <CommerceFrame>
      {paid ? (
        <ConfirmWaiting />
      ) : (
        <div className="space-y-5 text-lg leading-9 text-white/85">
          <p>We can’t confirm this payment yet.</p>
          <p className="text-white/60">
            If you’ve just paid, check again in a moment.
          </p>
          <p className="text-white/60">
            If you paid and this doesn’t change, write to{' '}
            <a
              href="mailto:hello@thecodexverse.com"
              className="text-[#f3dfaa] underline-offset-4 hover:underline"
            >
              hello@thecodexverse.com
            </a>{' '}
            and I’ll sort it out.
          </p>
          <div className="mt-12 flex flex-wrap gap-6 text-sm">
            <a href="/remember/confirm" className="text-[#f3dfaa] underline-offset-4 hover:underline">
              check again
            </a>
            <a href="/pathways#remember" className="text-white/60 underline-offset-4 hover:underline">
              return to Pathway Two™: ReMEMBER™
            </a>
          </div>
        </div>
      )}
    </CommerceFrame>
  );
}
