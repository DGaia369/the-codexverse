import Stripe from 'stripe';

// ---------------------------------------------------------------------------
// Stripe client (server-only)
// ---------------------------------------------------------------------------
// Stripe verifies payment. It never decides product identity, eligibility,
// entitlement, authorization, or entry; the codeXverse™ does.
//
// Reads STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET, never NEXT_PUBLIC_*.
// Neither value is ever logged. A missing value throws a configuration
// error rather than falling back to anything.

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('Stripe is not configured (STRIPE_SECRET_KEY missing).');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('Stripe is not configured (STRIPE_WEBHOOK_SECRET missing).');
  }
  return secret;
}
