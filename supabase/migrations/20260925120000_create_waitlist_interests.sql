-- Migration: create waitlist_interests (Launch Sprint 2, Part A)
--
-- Status: Proposed. Written 2026-09-25. NOT yet applied to Supabase.
-- NOT yet verified. Apply manually through the Supabase Dashboard SQL
-- Editor, per the current convention (docs/history/open-items.md item 18).
-- Authority: Diana Francis
--
-- Purpose: a reusable, interest-based waitlist. A row records only that an
-- email address asked to be told when something opens.
--
-- A waitlist row is NOT authentication, eligibility, entitlement, a
-- purchase, a ReMEMBER™ session, or permission to enter anything. It has no
-- foreign key to auth.users, products, entitlements, or any pathway table,
-- deliberately: no account is required, and nothing in access control may
-- ever read this table.
--
-- Writes come only from the server route app/api/waitlist/route.ts through
-- the service-role client (utils/waitlist.ts). The browser never inserts
-- directly.

create table waitlist_interests (
  id uuid primary key default gen_random_uuid(),

  -- Stored normalized (trimmed, lowercased) by application code; the check
  -- below makes a non-normalized value fail loudly instead of creating a
  -- near-duplicate row.
  email text not null,

  -- What the person asked to hear about, e.g. 'pathway-two-remember'.
  -- Free text rather than a products FK so the table stays reusable for
  -- interests that are not (yet) products. The allowed values are owned by
  -- application code (utils/waitlist.ts).
  interest text not null,

  -- Where the request came from, e.g. 'public_pathways_remember_card'.
  source text not null,

  status text not null default 'active',

  -- When the person submitted the form. Set once, on first submission;
  -- a repeated submission does not overwrite it.
  consent_at timestamptz not null default now(),

  created_at timestamptz not null default now(),

  constraint waitlist_interests_email_interest_unique unique (email, interest),

  constraint waitlist_interests_email_normalized_check
    check (email = lower(btrim(email)) and length(email) between 3 and 320),

  constraint waitlist_interests_status_check
    check (status in ('active', 'withdrawn'))
);

alter table waitlist_interests enable row level security;

-- No policies are created. With RLS enabled and zero policies, the anon and
-- authenticated roles are denied all access. The service-role client is
-- the only intended access path, matching products and entitlements
-- (20260913_create_products_and_entitlements.sql).
