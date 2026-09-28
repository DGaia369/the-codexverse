// ---------------------------------------------------------------------------
// ReMEMBER™ sales gate (server-only)
// ---------------------------------------------------------------------------
// Launch Sprint 2. The single authority on whether Founding Access can be
// bought. It reads a server environment variable (never NEXT_PUBLIC_*), so
// no browser can change it. It only decides whether the purchase path is
// offered; it never decides eligibility, entitlement, or authorization.
//
//   REMEMBER_SALES_STATE=closed  (default; also any missing/unknown value)
//     Public card: Opening Soon + waitlist. No checkout CTA. Purchase
//     entry and checkout are unavailable.
//   REMEMBER_SALES_STATE=test
//     Public card unchanged (still closed to the public). Purchase entry
//     and checkout work by direct URL, but only with a Stripe TEST key
//     (sk_test_...), for Founder verification.
//   REMEMBER_SALES_STATE=open
//     Public card exposes the purchase path. Set only after the Founder
//     rules OPEN FOUNDING ACCESS.
//
// The Stripe webhook does not consult this gate: a payment that Stripe has
// verified is always recorded, whatever the gate says.

export type RememberSalesState = 'closed' | 'test' | 'open';

export function getRememberSalesState(): RememberSalesState {
  const value = process.env.REMEMBER_SALES_STATE;
  return value === 'open' || value === 'test' ? value : 'closed';
}

// Whether the public card may show a purchase CTA.
export function isPublicPurchaseOpen(): boolean {
  return getRememberSalesState() === 'open';
}

// Whether purchase entry and checkout may run at all. In the 'test' state
// this additionally requires a Stripe test-mode key, so a closed gate can
// never take real money.
export function isPurchasePathAvailable(): boolean {
  const state = getRememberSalesState();
  if (state === 'open') return true;
  if (state === 'test') {
    return (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_test_');
  }
  return false;
}
