# Lost-Dispute Migration Proposed (Launch Sprint 2, Prerequisite 7)

**Status:** Historical record. **Update 2026-09-27:** the Founder completed the SQL review and **approved it for manual application**, including the `revoke_refunded_acquisition()` replacement (`docs/history/open-items.md` item 22). Migration 3 was then **Applied and Verified Live** (`docs/history/2026-09-27-dispute-lost-migration-applied.md`). The code is Implemented, Verified Local (in-process harness against real PostgreSQL). The dispute sandbox proof was **pending** when this was written. Its first attempt was interrupted on 2026-09-28 (`2026-09-27-dispute-sandbox-proof.md`). Public sales remain **CLOSED**. Not committed. Not deployed.
**Date:** September 27, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Founder ruling applied

Recorded in full in `docs/history/open-items.md` item 22 (Founder ruling, 2026-09-27):

- Access is revoked only on `charge.dispute.closed` with `status = lost`.
- A lost dispute is recorded as `dispute_lost`, never as `refunded`.
- The revocation reason is exactly `Stripe dispute lost`.
- All other dispute events and outcomes change nothing.
- There is no suspension or reinstatement.

## Migration

`supabase/migrations/20260927120000_add_acquisition_dispute_lost.sql`, SHA-256 `a70cc2f38ac63ad3477bcf628eb99e206907a80d55f52aa5608b31d0c6334318`. It depends on `20260925120100_create_acquisitions.sql` (applied 2026-09-26).

It does four things:

1. **New columns on `acquisitions`:** `dispute_lost_at timestamptz null` and `provider_dispute_id text null`.
2. **Constraints, in one `ALTER TABLE` statement:**
   - `acquisitions_status_check` now allows `verified`, `refunded`, and `dispute_lost`.
   - `acquisitions_refunded_at_matches_status_check` is replaced by `acquisitions_outcome_integrity_check`:
     - `verified` has no outcome columns set.
     - `refunded` has only `refunded_at` set.
     - `dispute_lost` has only `dispute_lost_at` and a non-blank `provider_dispute_id` set.
3. **`revoke_refunded_acquisition` is replaced** with the same signature and the same grants. The one change: it acts only on a `verified` acquisition. Before, it returned early only for `refunded`, and that was the only other status, so behavior on existing rows is identical. Without this change, a refund event for a `dispute_lost` row would try to overwrite it as `refunded`, fail the outcome check, and fail again on every Stripe retry.
4. **New `revoke_disputed_acquisition(p_payment_intent_id, p_dispute_id, p_reason)`:**
   - It is `security invoker` with `search_path = public`.
   - It rejects a blank dispute id or reason.
   - It locks the acquisition by PaymentIntent (`FOR UPDATE`) and acts only if the acquisition is `verified`. It then sets `dispute_lost`, `dispute_lost_at`, and `provider_dispute_id`, and revokes only `acquisitions.entitlement_id` if that entitlement is `active`.
   - It returns `changed = false` for a `refunded` or `dispute_lost` acquisition, and zero rows for an unknown PaymentIntent. It deletes nothing.
   - `EXECUTE` is revoked from `public`, `anon`, and `authenticated`, and granted to `service_role`.

The current live rows (1 `refunded`, 1 `verified`) are valid under the new check. The harness proves this by applying the migration over rows in both states.

No change is needed to `record_verified_acquisition`. It already returns early once `entitlement_id` is set or the status is not `verified`, so a replayed payment cannot re-grant after a lost dispute.

## Code

- `utils/entitlements.ts`:
  - New `revokeDisputedAcquisition({ paymentIntentId, disputeId, reason })`, which mirrors `revokeRefundedAcquisition`.
  - The typed `Functions` map gains `revoke_disputed_acquisition`.
- `app/api/stripe/webhook/route.ts`:
  - New `case 'charge.dispute.closed'`. A status other than `lost` returns 200 `dispute_not_lost_no_change`. A status of `lost` calls the wrapper with reason `Stripe dispute lost`, which returns `revoked` or `already_revoked`.
  - A missing PaymentIntent returns `no_payment_intent`.
  - The missing-acquisition retry guard (500 if the PaymentIntent carries this offer, otherwise `not_this_offer`) is now one shared helper, used unchanged by the refund path.
  - Other `charge.dispute.*` events still fall through to `ignored`.

## Verification (local only)

A scratchpad harness ran outside the repository and was never staged. It extends the 2026-09-25 harness and uses:

- the **real** webhook route and entitlement service
- real PostgreSQL (PGlite 0.5.8), carrying all five commerce migrations
- webhooks signed with the real Stripe SDK and a harness-only secret

There were no network calls, and nothing touched Supabase or Stripe. `service_role` was given Supabase's default table privileges and `BYPASSRLS` to mirror Supabase.

**Dispute harness: 23 of 23 passed.**

| Area | Proven |
|---|---|
| Migration | applies over existing `verified` and `refunded` rows, which stay byte-identical; the outcome check rejects a `dispute_lost` row with no or blank dispute id or no timestamp, `dispute_lost` plus `refunded_at`, `refunded` plus `dispute_lost_at`, `verified` plus a dispute id, and an unknown status |
| Non-lost events | `charge.dispute.created`, `.updated` (including status `lost` on an update), `.funds_withdrawn`, `.funds_reinstated` → 200 `ignored`, full snapshot identical |
| Non-lost closed | `won`, `warning_closed`, `needs_response`, `under_review`, `warning_under_review`, `prevented` → 200 `dispute_not_lost_no_change`, snapshot identical |
| Lost dispute | acquisition `dispute_lost`, `dispute_lost_at` set, `provider_dispute_id` recorded, `refunded_at` null; its entitlement `revoked`, reason exactly `Stripe dispute lost`; exactly one acquisition and one entitlement changed; no rows added or deleted |
| Unrelated grants | the same buyer's `admin_grant` and another user's `admin_grant` stay effective; another user's `verified` acquisition and active entitlement are unchanged |
| Idempotency | the same lost event ×3 → `already_revoked`, snapshot identical; a second, different lost dispute → no change, `provider_dispute_id` keeps the first; 3 concurrent deliveries → exactly one `revoked` |
| Replay | the original `checkout.session.completed` replayed after the loss → `already_recorded`, no re-grant |
| Cross-outcome | refund after loss → `already_revoked`, stays `dispute_lost`; lost after full refund → stays `refunded`, reason stays `Stripe full refund`, dispute columns null; `won` or `warning_closed` after a loss → no reinstatement |
| Edge cases | forged signature → 400, nothing changed; no PaymentIntent → `no_payment_intent`; unrecorded Founding Access PaymentIntent → 500 (Stripe retries); foreign PaymentIntent → `not_this_offer`; the refund path's guard still works; blank dispute id or reason → exception, nothing changed; unknown PaymentIntent → zero rows |
| Privileges | `anon` and `authenticated` are denied `EXECUTE` on both revoke functions; `service_role` is allowed and completes a real revocation; `PUBLIC` holds no `EXECUTE` |

**Regression:** the existing Sprint 2 harness still passed 62 of 62 with the new migration applied, covering the waitlist, webhook security, grants, refunds, replay integrity, checkout, confirmation, and the sales gate.

**Mutation check: 4 of 4 caught.** Each of these mutants made real tests fail:

- the route revokes on `won` instead of `lost`
- the route uses the wrong revocation reason
- the dispute RPC is missing its `verified`-only guard
- the refund RPC keeps its old `refunded`-only guard

**Static checks:** `tsc --noEmit` is clean, and ESLint on both changed files is clean.

**Not proven locally:**

- True concurrency across separate database connections. The harness used one PGlite connection; the row lock and constraints provide the guarantee.
- Real Stripe dispute payloads. That is the purpose of the sandbox proof.

## Application and verification (as planned; done 2026-09-27, see `2026-09-27-dispute-lost-migration-applied.md`)

1. Review the migration. Apply it through the Supabase Dashboard SQL Editor (open item 18 convention), and confirm the file's SHA-256 matches the value above.
2. Verify read-only:
   - `acquisitions` has 18 columns.
   - `acquisitions_status_check` and `acquisitions_outcome_integrity_check` are present.
   - `acquisitions_refunded_at_matches_status_check` is gone.
   - The 2 existing rows are unchanged.
   - On both revoke functions, `has_function_privilege` is false for `anon` and `authenticated` and true for `service_role`.
3. Restart the listener with `charge.dispute.closed` (plus `charge.dispute.created` to observe that it is ignored), then run the sandbox proof in `docs/history/2026-09-27-dispute-sandbox-proof.md`.

## Related

- `docs/architecture/commerce.md` (Refunds, disputes, and reversal)
- `docs/architecture/database.md` (`acquisitions`)
- `docs/history/open-items.md`, item 22
- `docs/history/2026-09-26-acquisitions-migration-applied.md`
