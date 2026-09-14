-- Migration: create products and entitlements tables (Commerce + Access, Phase 3)
--
-- Status: Approved architecture (Founder ruling, 2026-09-13). NOT yet applied
-- to Supabase. NOT yet verified.
-- Authority: Diana Francis
-- Created: 2026-09-13
--
-- Purpose: establish the V1 Commerce + Access entitlement model.
--
-- `products` is a minimal, stable product identity registry. It carries no
-- offer, price, currency, description, marketing copy, or checkout data.
-- Founding Access and its US$97 price are an offer against the product
-- below, not the product itself, and are intentionally absent from this
-- migration — no offers table is created here.
--
-- `entitlements` records that a specific participant (auth.users) holds
-- active or revoked access to a specific product, independent of Pathway
-- eligibility. A participant may hold more than one entitlement row for the
-- same product (e.g. a Founding Access grant and a later organizational
-- grant); no uniqueness constraint on (user_id, product_id) is created here.
-- source_type records why a grant exists; it is not the entitlement status.
--
-- Effective-entitlement rule (owned by application code, not enforced by
-- this schema):
--   status = 'active'
--   AND starts_at <= now()
--   AND (expires_at IS NULL OR expires_at > now())
-- "Expired" is never a stored status — it is this predicate evaluating
-- false because of expires_at.
--
-- Scope: database structure only. No API routes, no authorization
-- composition logic (authorizeRememberAccess or equivalent), no checkout,
-- no payment-provider logic, and no participant-facing copy are introduced
-- by this migration.

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------

create table products (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  constraint products_key_unique unique (key),
  constraint products_status_check
    check (status in ('active', 'retired'))
);

-- Product lifecycle status governs acquisition availability only. A future
-- status of 'retired' may govern whether new acquisition of this product is
-- offered; it must not automatically invalidate existing participant
-- entitlements. Entitlement validity is governed exclusively by the
-- effective-entitlement rule stated above, unless a future Founder ruling
-- explicitly changes that relationship. This is a documented architectural
-- rule, not something this schema enforces or could enforce in SQL.

alter table products enable row level security;

-- No policies are created here. With RLS enabled and zero policies, the
-- anon and authenticated Postgres roles are denied all access by default.
-- The service-role client is the only intended access path for products in
-- Version 1, matching the pattern established by remember_sessions and
-- remember_responses (see 20260728_create_remember_tables.sql). Do not add
-- anon/authenticated policies in a later migration without an explicit
-- decision to allow direct client access.

-- ---------------------------------------------------------------------------
-- entitlements
-- ---------------------------------------------------------------------------

create table entitlements (
  id uuid primary key default gen_random_uuid(),

  -- The authoritative owning participant. Required: an entitlement must
  -- always belong to a real participant (an unclaimed gift is not an
  -- entitlement and is not represented by this table). Cascades on delete,
  -- matching the established owning-FK convention used by
  -- remember_sessions.user_id -> auth.users(id).
  user_id uuid not null references auth.users(id) on delete cascade,

  -- No existing table in this repository references a shared registry/
  -- lookup table the way this column references products. Deliberately
  -- `on delete restrict` rather than following the cascade convention
  -- above: products are expected to be retired via status, not deleted,
  -- and a product deletion must never silently destroy participant
  -- entitlement history. Flagged for Founder confirmation; see returned
  -- migration-safety report.
  product_id uuid not null references products(id) on delete restrict,

  source_type text not null,
  status text not null default 'active',

  starts_at timestamptz not null default now(),
  expires_at timestamptz null,

  -- Nullable: identifies the human Founder/Admin who performed the grant.
  -- Null is permitted for future system-generated grants. Deliberately
  -- `on delete set null` rather than cascade: this is an optional
  -- provenance annotation, not an ownership relationship, and deleting the
  -- granting admin's auth.users row must never delete the participant's
  -- entitlement. Flagged for Founder confirmation alongside product_id
  -- above.
  granted_by_user_id uuid null references auth.users(id) on delete set null,

  revoked_at timestamptz null,
  revocation_reason text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint entitlements_source_type_check
    check (source_type in ('verified_acquisition', 'admin_grant')),

  constraint entitlements_status_check
    check (status in ('active', 'revoked')),

  -- Keeps status and revoked_at from drifting apart: active entitlements
  -- must not carry a revocation timestamp, and revoked entitlements must
  -- always carry one.
  constraint entitlements_revoked_at_matches_status_check
    check (
      (status = 'active' and revoked_at is null)
      or (status = 'revoked' and revoked_at is not null)
    )
);

-- Supports "does at least one effective entitlement exist for this
-- participant and product" lookups. Deliberately not unique: a participant
-- may legitimately hold multiple independent entitlement rows for the same
-- product, and revoking one must not be blocked or entangled with another.
create index entitlements_user_product_idx
  on entitlements (user_id, product_id);

alter table entitlements enable row level security;

-- No policies are created here, for the same reason as products: RLS
-- enabled with zero policies denies all anon/authenticated access. The
-- service-role client, gated by application-level authorization logic, is
-- the only intended access path in Version 1.

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
-- No reusable updated_at trigger function exists elsewhere in this
-- repository (see 20260728_create_remember_tables.sql). None is introduced
-- by this migration. Application code is responsible for setting
-- updated_at explicitly on every write, matching remember_sessions,
-- remember_responses, and remember_movement_progress.

-- ---------------------------------------------------------------------------
-- initial product seed
-- ---------------------------------------------------------------------------
-- Product identity only. No offer, no price, no access-tier language.
-- Founding Access and its US$97 price are not seeded here.
--
-- Deliberately no ON CONFLICT clause: this is a versioned migration, and a
-- pre-existing 'pathway-two-remember' row with an unknown canonical name or
-- status represents drift that must surface as a failure, not be silently
-- accepted alongside the approved seed identity.

insert into products (key, name, status)
values ('pathway-two-remember', 'Pathway Two™: ReMEMBER™', 'active');
