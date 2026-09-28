-- Migration: create acquisitions + verified-acquisition functions
-- (Launch Sprint 2, Part B)
--
-- Status: Proposed. Written 2026-09-25. Replay-integrity correction made
-- 2026-09-26, before application. NOT yet applied to Supabase. NOT yet
-- verified.
--
-- Application gate: its preconditions have passed. Migration 1
-- (20260925120000_create_waitlist_interests.sql) was applied and verified,
-- and the Founder waitlist browser proof PASSED on 2026-09-25
-- (docs/history/2026-09-25-waitlist-migration-applied.md). This migration
-- is released for Founder review and manual application through the
-- Supabase Dashboard SQL Editor, per the current convention
-- (docs/history/open-items.md item 18), but remains NOT APPLIED until the
-- Founder applies it. Its SQL does not depend on waitlist_interests; the
-- order was a verification gate, not a technical dependency. See
-- docs/history/open-items.md item 22.
-- Authority: Diana Francis
--
-- Purpose: the payment/acquisition audit record behind a
-- source_type = 'verified_acquisition' entitlement.
--
-- Authority chain: Stripe verifies payment. the codeXverse™ decides product
-- identity, eligibility, entitlement, authorization, and entry. An
-- acquisitions row records a payment that Stripe has verified (delivered
-- by a signature-verified webhook) and links it to the one entitlement it
-- produced. It is not itself an entitlement, and authorization never reads
-- it: hasEffectiveEntitlement() reads entitlements only.
--
-- Nothing here changes products or entitlements. The entitlements table,
-- its constraints, and its source_type values ('verified_acquisition' was
-- already allowed by 20260913) are unchanged.

-- ---------------------------------------------------------------------------
-- acquisitions
-- ---------------------------------------------------------------------------

create table acquisitions (
  id uuid primary key default gen_random_uuid(),

  -- The authenticated participant who started checkout (set server-side
  -- at Checkout Session creation, returned in the signed webhook).
  -- ON DELETE RESTRICT, retained for V1 by Founder ruling (2026-09-25): a
  -- verified payment/acquisition record must not disappear merely because
  -- an auth identity is deleted. Participant deletion, anonymization, and
  -- financial-record retention policy is future governance
  -- (docs/history/open-items.md item 23).
  user_id uuid not null references auth.users(id) on delete restrict,

  product_id uuid not null references products(id) on delete restrict,

  -- Which offer was bought, e.g. 'remember-founding-access'. The offer
  -- (price, currency) is server-side configuration (utils/offers.ts); no
  -- offers table exists.
  offer_key text not null,

  provider text not null default 'stripe',
  provider_checkout_session_id text not null,
  provider_payment_intent_id text null,
  livemode boolean not null,

  -- Minor units (cents) and lowercase ISO currency, as Stripe reports them.
  amount integer not null,
  currency text not null,

  status text not null default 'verified',

  -- The entitlement this acquisition produced. Null only between the
  -- acquisition insert and the entitlement insert inside
  -- record_verified_acquisition(), which run in one transaction, so a
  -- committed 'verified' row always carries it. Unique: one acquisition,
  -- one entitlement.
  entitlement_id uuid null references entitlements(id) on delete restrict,

  created_at timestamptz not null default now(),
  verified_at timestamptz not null default now(),
  refunded_at timestamptz null,
  updated_at timestamptz not null default now(),

  constraint acquisitions_checkout_session_unique
    unique (provider_checkout_session_id),
  constraint acquisitions_payment_intent_unique
    unique (provider_payment_intent_id),
  constraint acquisitions_entitlement_unique
    unique (entitlement_id),

  constraint acquisitions_provider_check
    check (provider in ('stripe')),
  constraint acquisitions_status_check
    check (status in ('verified', 'refunded')),
  constraint acquisitions_amount_check
    check (amount > 0),
  constraint acquisitions_currency_check
    check (currency ~ '^[a-z]{3}$'),
  constraint acquisitions_refunded_at_matches_status_check
    check (
      (status = 'verified' and refunded_at is null)
      or (status = 'refunded' and refunded_at is not null)
    )
);

create index acquisitions_user_product_idx
  on acquisitions (user_id, product_id);

alter table acquisitions enable row level security;

-- No policies: service-role only, like products and entitlements. Payment
-- provider identifiers are never exposed to the browser.

-- ---------------------------------------------------------------------------
-- record_verified_acquisition
-- ---------------------------------------------------------------------------
-- Called only by the Stripe webhook, after signature verification and after
-- the application has checked payment status, mode, amount, currency,
-- offer, and product against server-side configuration.
--
-- Idempotent and safe under concurrent webhook delivery:
--   1. insert the acquisition, or do nothing if this Checkout Session was
--      already recorded;
--   2. lock that row (FOR UPDATE), so a second concurrent delivery waits;
--   3. grant exactly one 'verified_acquisition' entitlement only if the row
--      has none yet and has not been refunded.
-- A replay therefore returns the existing acquisition and creates nothing.

create function record_verified_acquisition(
  p_user_id uuid,
  p_product_key text,
  p_offer_key text,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_livemode boolean,
  p_amount integer,
  p_currency text
)
returns table (
  acquisition_id uuid,
  granted_entitlement_id uuid,
  entitlement_created boolean
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_product_id uuid;
  v_acq acquisitions%rowtype;
  v_entitlement_id uuid;
begin
  select p.id into v_product_id from products p where p.key = p_product_key;
  if v_product_id is null then
    raise exception 'Unknown product key: %', p_product_key;
  end if;

  insert into acquisitions (
    user_id, product_id, offer_key, provider,
    provider_checkout_session_id, provider_payment_intent_id, livemode,
    amount, currency, status
  )
  values (
    p_user_id, v_product_id, p_offer_key, 'stripe',
    p_checkout_session_id, p_payment_intent_id, p_livemode,
    p_amount, p_currency, 'verified'
  )
  on conflict (provider_checkout_session_id) do nothing;

  select a.* into v_acq
  from acquisitions a
  where a.provider_checkout_session_id = p_checkout_session_id
  for update;

  -- A replay must describe the same purchase: every purchase-defining fact
  -- must match the recorded row. Anything else is drift that must fail
  -- loudly, not be absorbed. IS DISTINCT FROM is null-safe (two nulls are
  -- equal; null versus a value differs), which matters for
  -- provider_payment_intent_id. The exception aborts the whole call, so a
  -- mismatched replay creates no entitlement and changes no acquisition or
  -- entitlement data.
  if v_acq.user_id is distinct from p_user_id
     or v_acq.product_id is distinct from v_product_id
     or v_acq.offer_key is distinct from p_offer_key
     or v_acq.provider_payment_intent_id is distinct from p_payment_intent_id
     or v_acq.livemode is distinct from p_livemode
     or v_acq.amount is distinct from p_amount
     or v_acq.currency is distinct from p_currency then
    raise exception 'Acquisition replay does not match the recorded acquisition';
  end if;

  if v_acq.entitlement_id is not null or v_acq.status <> 'verified' then
    return query select v_acq.id, v_acq.entitlement_id, false;
    return;
  end if;

  insert into entitlements (user_id, product_id, source_type, status)
  values (v_acq.user_id, v_acq.product_id, 'verified_acquisition', 'active')
  returning id into v_entitlement_id;

  update acquisitions a
  set entitlement_id = v_entitlement_id, updated_at = now()
  where a.id = v_acq.id;

  return query select v_acq.id, v_entitlement_id, true;
end;
$$;

-- ---------------------------------------------------------------------------
-- revoke_refunded_acquisition
-- ---------------------------------------------------------------------------
-- Called only by the Stripe webhook for a signature-verified charge.refunded
-- event where the charge is fully refunded. Marks the acquisition refunded
-- and revokes ONLY the entitlement that this acquisition produced, using
-- the existing revocation columns (status, revoked_at, revocation_reason).
-- Other grants for the same participant (for example an admin_grant) are
-- untouched, so hasEffectiveEntitlement()'s multiple-grant semantics hold.
-- Nothing is deleted. Idempotent: a second call changes nothing.
-- Returns zero rows when no acquisition carries this PaymentIntent.

create function revoke_refunded_acquisition(
  p_payment_intent_id text,
  p_reason text
)
returns table (
  acquisition_id uuid,
  revoked_entitlement_id uuid,
  changed boolean
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_acq acquisitions%rowtype;
begin
  select a.* into v_acq
  from acquisitions a
  where a.provider_payment_intent_id = p_payment_intent_id
  for update;

  if not found then
    return;
  end if;

  if v_acq.status = 'refunded' then
    return query select v_acq.id, v_acq.entitlement_id, false;
    return;
  end if;

  update acquisitions a
  set status = 'refunded', refunded_at = now(), updated_at = now()
  where a.id = v_acq.id;

  if v_acq.entitlement_id is not null then
    update entitlements e
    set status = 'revoked',
        revoked_at = now(),
        revocation_reason = p_reason,
        updated_at = now()
    where e.id = v_acq.entitlement_id
      and e.status = 'active';
  end if;

  return query select v_acq.id, v_acq.entitlement_id, true;
end;
$$;

-- Functions in the public schema are callable through the Supabase API by
-- default. These must only ever be called by the server with the
-- service-role key.
revoke all on function record_verified_acquisition(uuid, text, text, text, text, boolean, integer, text)
  from public, anon, authenticated;
revoke all on function revoke_refunded_acquisition(text, text)
  from public, anon, authenticated;
grant execute on function record_verified_acquisition(uuid, text, text, text, text, boolean, integer, text)
  to service_role;
grant execute on function revoke_refunded_acquisition(text, text)
  to service_role;
