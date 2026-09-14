-- Migration: strengthen entitlement integrity constraints (Commerce + Access, Phase 3A)
--
-- Status: Approved architecture (Founder ruling, 2026-09-14). NOT yet applied
-- to Supabase. NOT yet verified.
-- Authority: Diana Francis
-- Created: 2026-09-14
--
-- Purpose: additive follow-up to supabase/migrations/20260913_create_products_and_entitlements.sql,
-- closing two of the data-integrity gaps identified by pre-push review of
-- commit 0974d5263cc2704971c6f4b9ab0634b68175ea05. That original migration
-- is frozen as the authoritative record of the SQL already executed
-- against Supabase and is NOT modified by this file. `entitlements`
-- currently contains zero rows; no existing data is affected by any change
-- here.
--
-- A third gap identified by that review — requiring granted_by_user_id to
-- be non-null whenever source_type = 'admin_grant' — is deliberately NOT
-- enforced here by Founder ruling: granted_by_user_id -> auth.users(id)
-- ON DELETE SET NULL is approved FK behavior, and a database check
-- constraint forcing that column non-null for admin_grant rows would
-- conflict with Postgres's ability to set it null if the referenced
-- auth.users row is later deleted. Real-grantor enforcement for admin_grant
-- creation belongs in the Phase 4 application/service layer instead.
-- Permanent historical grantor provenance, if required later, belongs in
-- future audit/event architecture rather than being forced into this FK.
--
-- Filename note: this migration uses a full YYYYMMDDHHMMSS UTC timestamp
-- (20260914040441), distinct from the date-only prefix convention used by
-- every migration before it, specifically so its version sorts
-- unambiguously later than 20260913_create_products_and_entitlements.sql
-- and reflects the actual time this file was written, rather than an
-- arbitrary later time. This does not change the meaning of any earlier
-- migration's filename.
--
-- Atomicity note: the revocation-integrity replacement below drops
-- entitlements_revoked_at_matches_status_check and adds
-- entitlements_revocation_integrity_check in a single ALTER TABLE
-- statement with two comma-separated actions, rather than as two separate
-- ALTER TABLE statements. PostgreSQL executes all actions within one
-- ALTER TABLE statement as a single atomic operation: if the ADD
-- CONSTRAINT action fails (for example, because it does not hold for
-- existing data), the DROP CONSTRAINT action in the same statement is
-- rolled back with it, and the original constraint remains in place. This
-- makes it impossible for the live table to end up with the old
-- constraint removed and the replacement absent — the smallest change
-- that closes that risk, without needing an explicit surrounding
-- transaction.
--
-- Scope: database structure only. No new entitlement statuses, no new
-- source_type values, no new columns, no new indexes, no product/offer/
-- price data, no triggers, no metadata, and no application code are
-- introduced by this migration. No admin-grant/granted_by_user_id
-- constraint is introduced; granted_by_user_id remains nullable with
-- ON DELETE SET NULL, untouched.

-- ---------------------------------------------------------------------------
-- 1. Expiry integrity
-- ---------------------------------------------------------------------------
-- Prevents a grant from being created with an expiry at or before its own
-- start time, which would otherwise be accepted by the schema while the
-- effective-entitlement predicate (starts_at <= now() AND (expires_at IS
-- NULL OR expires_at > now())) could never be true for it.

alter table entitlements
  add constraint entitlements_expires_at_after_starts_at_check
  check (expires_at is null or expires_at > starts_at);

-- ---------------------------------------------------------------------------
-- 2. Revocation audit integrity
-- ---------------------------------------------------------------------------
-- The original entitlements_revoked_at_matches_status_check only tied
-- revoked_at to status. This replaces it with one stronger constraint
-- covering both revoked_at and revocation_reason together, rather than
-- adding a second, overlapping check alongside the original:
--
--   status = 'active'  -> revoked_at IS NULL AND revocation_reason IS NULL
--   status = 'revoked' -> revoked_at IS NOT NULL AND revocation_reason IS
--                         NOT NULL AND revocation_reason contains at least
--                         one non-whitespace character (enforced via the
--                         POSIX regex [^[:space:]], not btrim, since btrim
--                         only strips leading/trailing space padding and
--                         is not a complete whitespace-only definition —
--                         it would not reject a tab- or newline-only
--                         value)
--
-- Drop and add are combined into one ALTER TABLE statement (see the
-- atomicity note above) so that exactly one constraint governs this
-- relationship at every observable point, with no window in which neither
-- or only the old constraint exists.

alter table entitlements
  drop constraint entitlements_revoked_at_matches_status_check,
  add constraint entitlements_revocation_integrity_check
  check (
    (status = 'active' and revoked_at is null and revocation_reason is null)
    or
    (
      status = 'revoked'
      and revoked_at is not null
      and revocation_reason is not null
      and revocation_reason ~ '[^[:space:]]'
    )
  );

-- ---------------------------------------------------------------------------
-- Safety note
-- ---------------------------------------------------------------------------
-- entitlements has zero rows at the time this migration is drafted, so both
-- statements above validate against no existing data and cannot fail on
-- current state. If this migration is applied after entitlement rows
-- exist, any row violating one of these two rules will cause the
-- corresponding statement to fail outright (not silently pass) — that is
-- the intended, explicit failure mode, consistent with this repository's
-- established preference for surfacing drift rather than absorbing it.
