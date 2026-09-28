# Acquisitions Migration Applied and Verified (Launch Sprint 2, Database Gate)

**Status:** Historical record. Migration 2 **Applied and Verified Live** in Supabase. The Launch Sprint 2 database gate is **closed**. Stripe **not configured**; no commerce test payment has occurred (true as of 2026-09-26; *superseded*: Stripe was configured in the sandbox and the payment proofs passed, see `2026-09-26-stripe-test-mode-proof.md`). Public sales remain **CLOSED**. Not committed. Not deployed.
**Date:** September 26, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Migration

`supabase/migrations/20260925120100_create_acquisitions.sql`: the corrected version, including the 2026-09-26 pre-application replay-integrity fix. SHA-256 `10f72a8e886653c91ecb20dbdb98eeed168779166bada8ed8777bddb13966a1f`; executable-SQL fingerprint `eb13f614c7c04d87c1bcda4a4f57f51384c3c4831386d4fb16d0f44e2aa2e28a`. The Founder applied it manually through the Supabase Dashboard SQL Editor (open item 18 convention). Result: "Success. No rows returned."

## Founder verification

| Check | Result |
|---|---|
| columns | 16 |
| constraints | 12 |
| RLS enabled | true |
| policies | 0 |
| rows | 0 |
| `record_verified_acquisition` execute | anon false, authenticated false, service_role true |
| `revoke_refunded_acquisition` execute | anon false, authenticated false, service_role true |

**Founder ruling: MIGRATION 2: APPLIED AND VERIFIED LIVE.**

## Independent read-only corroboration (builder, 2026-09-26)

On disk the file matches the approved SHA-256. The builder ran a read-only service-role query: `acquisitions` exists with 0 rows, `waitlist_interests` holds 1 row (the Founder's proof submission), and there are 0 `verified_acquisition` entitlements.

## State after this gate

- Migration 1 and Migration 2: Applied and Verified Live. Waitlist Founder browser proof: PASSED (`docs/history/2026-09-25-waitlist-migration-applied.md`).
- Stripe: not configured (no `STRIPE_*` keys, no `REMEMBER_SALES_STATE`, no Stripe CLI installed). No test payment has occurred.
- Outstanding: Stripe test-mode setup and the Founder commerce browser proof; then the remaining OPEN FOUNDING ACCESS prerequisites (`docs/history/open-items.md` item 22).

## Related

- `docs/history/2026-09-25-launch-sprint-2-waitlist-and-founding-access.md`
- `docs/history/2026-09-25-waitlist-migration-applied.md`
- `docs/history/open-items.md`, items 18 and 22
