# Lost-Dispute Migration Applied and Verified (Launch Sprint 2, Prerequisite 7)

**Status:** Historical record. Migration 3 is **Applied and Verified Live** in Supabase. **Prerequisite 7 remains OPEN** until the Stripe sandbox lost-dispute proof passes. Public sales remain **CLOSED**. Not committed. Not deployed.
**Date:** September 27, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Migration

`supabase/migrations/20260927120000_add_acquisition_dispute_lost.sql`, SHA-256 `a70cc2f38ac63ad3477bcf628eb99e206907a80d55f52aa5608b31d0c6334318` (212 lines, 7483 bytes). This is the exact file the Founder reviewed and approved, including the `revoke_refunded_acquisition()` replacement (`docs/history/open-items.md` item 22).

The Founder applied it manually through the Supabase Dashboard SQL Editor (open item 18 convention). Result: "Success. No rows returned."

Design and local verification: `docs/history/2026-09-27-dispute-lost-migration-proposed.md`.

## Founder verification ("09 — Verify Lost Dispute Migration")

| Check | Result |
|---|---|
| `acquisitions` columns | 18 |
| `acquisitions` constraints | 12 |
| `dispute_lost_at` present | true |
| `provider_dispute_id` present | true |
| `acquisitions_outcome_integrity_check` present | true |
| `acquisitions_refunded_at_matches_status_check` removed | true |
| RLS enabled | true |
| Policies | 0 |
| Rows | 2 (1 `verified`, 1 `refunded`, 0 `dispute_lost`) |
| `revoke_refunded_acquisition` execute | `anon` false, `authenticated` false, `service_role` true |
| `revoke_disputed_acquisition` execute | `anon` false, `authenticated` false, `service_role` true |

**Founder ruling, 2026-09-27: MIGRATION 3 APPLIED AND VERIFIED LIVE.**

## State after application

- The 2 existing acquisitions carry no dispute data:
  - `e3601d38…`: `refunded`, the refund proof
  - `1715c86a…`: `verified`, the parked fresh-entry purchase for `016f2839…`
- No code changed at application. The webhook's `charge.dispute.closed` handling (already in the working tree) can now reach `revoke_disputed_acquisition` live.
- **Prerequisite 7 is not closed.** It closes only when the lost-dispute sandbox proof passes (`docs/history/2026-09-27-dispute-sandbox-proof.md`). The first attempt was interrupted on 2026-09-28 and classified as an interrupted test artifact. A clean re-run is pending.
- Outstanding OPEN FOUNDING ACCESS prerequisites: 7, 8, 9, 10. Public sales remain **CLOSED**.

## Related

- `docs/history/2026-09-27-dispute-lost-migration-proposed.md`
- `docs/history/2026-09-27-dispute-sandbox-proof.md`
- `docs/architecture/commerce.md`
- `docs/architecture/database.md`
- `docs/history/open-items.md`, item 22
