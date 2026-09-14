# Commerce + Access V1 Entitlement Schema — Applied and Verified

**Status:** Historical record
**Date:** September 13, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## What happened

The V1 Commerce + Access database schema — the `products` and `entitlements` tables — was applied to the live codeXverse™ Supabase project and verified.

This closes the design phase that began with the Phase 2 entitlement design specification (product identity vs. offer separation, effective-entitlement predicate, multiple-grant support, gift/entitlement boundary, and eligibility/entitlement/authorization separation) and continued through Founder corrections, a migration safety pass, and final Founder review before application.

## Migration file

`supabase/migrations/20260913_create_products_and_entitlements.sql`

This file remains the authoritative record of the exact SQL that was run. It was drafted, safety-reviewed (removing `if not exists` table-creation fallbacks and the seed's `on conflict` clause so schema drift would surface as a failure rather than be silently absorbed), and presented for final Founder review before application. It was not altered after execution.

## Application method

Applied manually through the Supabase Dashboard SQL Editor. The Editor reported:

> Success. No rows returned.

No Supabase CLI project link exists in this repository (confirmed during preflight prior to this application, consistent with the same finding recorded for the July 28, 2026 ReMEMBER™ tables application). The committed migration file is the only tracked record of what was run.

## Verification evidence

A read-only verification query was run against live PostgreSQL system catalogs by Diana Francis via the Supabase Dashboard SQL Editor after application, confirming:

| Check | Result |
|---|---|
| `public.products` exists | yes |
| `public.entitlements` exists | yes |
| Row Level Security enabled, `products` | true |
| Row Level Security enabled, `entitlements` | true |
| Participant-facing policies, `products` | 0 |
| Participant-facing policies, `entitlements` | 0 |
| `products_key_unique` | present |
| `products_status_check` | present |
| `entitlements_source_type_check` | present |
| `entitlements_status_check` | present |
| `entitlements_revoked_at_matches_status_check` | present |
| `entitlements.user_id → auth.users(id) on delete cascade` | present |
| `entitlements.product_id → products(id) on delete restrict` | present |
| `entitlements.granted_by_user_id → auth.users(id) on delete set null` | present |
| `entitlements_user_product_idx` | present, non-unique |
| `products` row count | 1 |
| `entitlements` row count | 0 |

This was independently cross-checked at the column/data level (schema shape, nullability, and seed content) via a read-only service-role PostgREST query, consistent with the catalog-level results above.

## Seed confirmed

Exactly one row in `products`:

- key: `pathway-two-remember`
- name: `Pathway Two™: ReMEMBER™`
- status: `active`

No Founding Access product exists. No US$97 price, or any price/currency value, is stored in `products` — the table has no such column.

## Governance preserved by this schema

- Product (`Pathway Two™: ReMEMBER™`) and Offer (Founding Access, US$97) remain distinct concepts. No offer or price data was introduced by this migration.
- Product lifecycle status does not itself determine entitlement validity; a future `retired` status governs acquisition availability only.
- Multiple independent entitlement grants for the same participant/product remain possible — no uniqueness constraint blocks this.
- An unclaimed gift is not an entitlement; `entitlements.user_id` remains required and non-null.
- Authorization composition (evaluating applicable eligibility requirements together with applicable entitlement requirements) is not implemented by this schema and remains a future, separate concern.

## Security posture

Row Level Security is enabled on both tables. Zero access policies exist on either, intentionally — with RLS enabled and no policies, the `anon` and `authenticated` Postgres roles are denied all access by default. The service-role client is the only intended access path, matching the architecture already established for `remember_sessions` and `remember_responses`.

## Scope of this phase

No API route, authorization composition logic, checkout, or payment-provider logic was implemented during this phase. `utils/entitlements.ts` remains an unimplemented stub for a future phase. This phase was database structure only.

## Open item not resolved by this record

`docs/history/open-items.md` item 16 ("Decouple Supabase session refresh from route protection") remains **OPEN**. It is not addressed, narrowed, or resolved by this schema application. It remains a prerequisite before protected Commerce + Access entry is considered production-ready.

## Related documents

- `docs/architecture/database.md` — approved architecture, now updated to Verified Live status under "Commerce + Access: `products` and `entitlements`"
- `docs/history/open-items.md` — item 17 records this schema's tracked status and next state
- `docs/architecture/pathway-two-build-plan.md` — governing Pathway Two™ architecture; lists "access and entitlement logic" among its implementation dependencies
