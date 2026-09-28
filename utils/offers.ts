import { PATHWAY_TWO_PRODUCT_KEY } from '@/utils/entitlements';

// ---------------------------------------------------------------------------
// Offers (server-side configuration)
// ---------------------------------------------------------------------------
// Launch Sprint 2. `products` deliberately carries no price (see
// supabase/migrations/20260913_create_products_and_entitlements.sql), and
// no offers table exists. This is the narrowest V1 home for the one
// approved offer: Founding Access, US$97, against the product
// pathway-two-remember.
//
// The browser never submits an amount, currency, product, or offer. Checkout
// reads this object, and the webhook checks every paid session against it
// before any entitlement is granted.

export type Offer = {
  offerKey: string;
  productKey: string;
  amount: number; // minor units (cents)
  currency: string; // lowercase ISO 4217, as Stripe reports it
  checkoutName: string; // line-item name shown on Stripe Checkout
};

export const REMEMBER_FOUNDING_ACCESS: Offer = {
  offerKey: 'remember-founding-access',
  productKey: PATHWAY_TWO_PRODUCT_KEY,
  amount: 9700,
  currency: 'usd',
  checkoutName: 'Pathway Two™: ReMEMBER™ Founding Access',
};
