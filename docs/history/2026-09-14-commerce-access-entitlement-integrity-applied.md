# Commerce + Access Phase 3A — Entitlement Integrity Constraints Applied and Verified

**Status:** Historical record
**Date:** September 14, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Purpose

Phase 3A is an additive follow-up to the Commerce + Access V1 schema (`docs/history/2026-09-13-commerce-access-entitlement-schema-applied.md`), closing two data-integrity gaps identified by pre-push review of commit `0974d5263cc2704971c6f4b9ab0634b68175ea05` before that branch was pushed: `entitlements` could be created with `expires_at` at or before its own `starts_at`, and a revoked entitlement could carry `revoked_at` without a corresponding, meaningful `revocation_reason`.

## Migration file

`supabase/migrations/20260914040441_add_entitlement_integrity_constraints.sql`

This file remains the authoritative record of the exact SQL that was run. It was drafted, revised for filename uniqueness and ordering, revised again to remove a proposed admin-grant provenance constraint (see "Founder ruling" below), and revised a final time to replace a `btrim`-based whitespace check with a POSIX regex — each revision reviewed before the next — before being presented for final Founder review and application. It was not altered after execution.

The original `supabase/migrations/20260913_create_products_and_entitlements.sql` was not modified, edited, or replaced by this phase. It remains frozen exactly as committed in `0974d5263cc2704971c6f4b9ab0634b68175ea05`.

## Application method

Applied manually through the Supabase Dashboard SQL Editor. The Editor reported:

> Success. No rows returned.

Consistent with every prior migration in this repository, no Supabase CLI project link exists, and the committed migration file is the only tracked record of what was run.

## What changed

1. **Expiry integrity.** Added `entitlements_expires_at_after_starts_at_check`:
   ```
   expires_at IS NULL OR expires_at > starts_at
   ```

2. **Revocation audit integrity.** Dropped `entitlements_revoked_at_matches_status_check` and, in the same atomic `ALTER TABLE` statement, added `entitlements_revocation_integrity_check`:
   ```
   (status = 'active' AND revoked_at IS NULL AND revocation_reason IS NULL)
   OR
   (status = 'revoked' AND revoked_at IS NOT NULL AND revocation_reason IS NOT NULL
     AND revocation_reason ~ '[^[:space:]]')
   ```
   Combining the drop and the add into one statement means Postgres treats both actions as a single atomic operation — if the `ADD CONSTRAINT` action had failed, the `DROP CONSTRAINT` action in the same statement would have been rolled back with it, leaving the original constraint in place. There was no possible intermediate state with neither constraint, or only the new one without the old one having been removed.

## What was deliberately not added

A constraint requiring `granted_by_user_id` to be non-null whenever `source_type = 'admin_grant'` was proposed during drafting and explicitly rejected by Founder ruling: the approved FK behavior is `granted_by_user_id → auth.users(id) ON DELETE SET NULL`, and a check constraint forcing that column non-null for `admin_grant` rows would conflict with Postgres's ability to set it null if the referenced `auth.users` row is later deleted. Real-grantor enforcement for `admin_grant` creation is deferred to the Phase 4 application/service layer. Permanent historical grantor provenance, if required later, belongs in future audit/event architecture rather than being forced into this foreign key.

No new entitlement status, no new `source_type` value, no new column, no new index, no trigger, no product/offer/price data, no metadata, and no application code were introduced by this migration.

## Verification evidence

A read-only verification query was run against live PostgreSQL system catalogs by Diana Francis via the Supabase Dashboard SQL Editor after application:

| Check | Result |
|---|---|
| `entitlements_expires_at_after_starts_at_check` present | true |
| `entitlements_revocation_integrity_check` present | true |
| `entitlements_revoked_at_matches_status_check` present | false |
| `entitlements` row count | 0 |
| Admin-grant provenance check constraint count | 0 |

This matches the approved migration exactly: both new constraints exist, the superseded constraint is gone, no admin-grant provenance constraint was introduced, and `entitlements` remained at zero rows immediately after verification — this phase wrote no data.

## Original migration integrity

`supabase/migrations/20260913_create_products_and_entitlements.sql` was confirmed byte-for-byte identical to the version committed in `0974d5263cc2704971c6f4b9ab0634b68175ea05` both before and after this phase's work (`git diff` against that commit produced no output).

## Scope of this phase

No API route, authorization composition logic, checkout, payment-provider logic, or route wiring was implemented. `utils/entitlements.ts` remains an unimplemented stub reserved for Phase 4. This phase was database structure only.

## Open item not resolved by this record

`docs/history/open-items.md` item 16 ("Decouple Supabase session refresh from route protection") remains **OPEN**. It is not addressed, narrowed, or resolved by this integrity migration. It remains a prerequisite before protected Commerce + Access entry is considered production-ready.

## Related documents

- `docs/architecture/database.md` — "Commerce + Access: `products` and `entitlements`" section, "Phase 3A: entitlement integrity constraints — Verified Live" subsection
- `docs/history/2026-09-13-commerce-access-entitlement-schema-applied.md` — Phase 3 foundation record
- `docs/history/open-items.md` — item 17 records both Phase 3 and Phase 3A status and the approved next implementation sequence
