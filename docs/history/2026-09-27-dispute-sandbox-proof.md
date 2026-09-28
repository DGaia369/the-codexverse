# Stripe Sandbox Proof: Lost Dispute → Revocation (Launch Sprint 2, Prerequisite 7)

**Status:** Historical record. **First attempt INTERRUPTED** (2026-09-28 UTC), classified by the Founder as an **interrupted test artifact**. The live lost-dispute proof has **not** passed. **Prerequisite 7 remains PARTIAL / OPEN.** A clean re-run is planned below, to run after a machine reboot. Public sales remain **CLOSED**. Not committed. Not deployed.
**Date:** September 27, 2026 (plan written); September 28, 2026 (attempt interrupted, recorded)
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## What is already proven, and what is not

- **Proven:**
  - The Founder ruling (lost disputes only).
  - The implementation.
  - Local verification: the dispute harness passed 23/23, the existing harness 62/62, and 4/4 mutants were caught.
  - Migration 3 was Applied and Verified Live on 2026-09-27.
  - See `2026-09-27-dispute-lost-migration-proposed.md` and `2026-09-27-dispute-lost-migration-applied.md`.
- **Not yet proven:** a live Stripe sandbox `charge.dispute.closed` with status `lost` arriving at the running app and revoking access.

## First attempt (INTERRUPTED)

**Proof identity:** Founder-controlled `9110bc4a…` (Founder ruling 2026-09-27).

### Chronology

1. **2026-09-27:** Migration 3 was applied and verified. A Claude-owned `stripe listen` was started with the five events, and its secret matched `.env.local`. It was reported READY.
2. **Listener stopped.** Claude Code then stopped that listener because the machine was critically low on memory. The Claude-owned dev server had already been stopped for the same reason earlier.
3. **Purchase with no listener.** The Founder completed the sandbox purchase with test card `4000 0000 0000 0259` while no listener was running. There are 0 Stripe Dashboard webhook endpoints, so Stripe delivered the events nowhere. These Stripe objects were created, all `livemode false`:

   | Object | Id | State |
   |---|---|---|
   | Checkout Session | `cs_test_a10esl0t6sC4htUl…` (user `9110bc4a…`) | `complete`, `paid`, 9700 usd, 2026-09-28 03:14:56 UTC |
   | PaymentIntent | `pi_3UKV3kDNmIXFPq5z0Nl5RJUO` | succeeded |
   | Dispute | `du_1UKV3lDNmIXFPq5zU0GL3j7O` | `needs_response`, `fraudulent`, 9700 usd, evidence due 2026-10-06, 0 submissions |

   The events were:
   - `checkout.session.completed`: `evt_1UKV3mDNmIXFPq5z89T4tbcE`
   - `charge.dispute.created`: `evt_1UKV3lDNmIXFPq5zVVWGWTqQ`
   - `charge.dispute.funds_withdrawn`: `evt_1UKV3mDNmIXFPq5zY4poAttA`
   - No `charge.dispute.closed` event exists.

   The payload passes every check in the webhook: payment mode, paid, 9700 usd, offer, product, and the user reference matches the metadata.
4. **Recovery attempts.** Over several rounds, the Founder moved both processes into her own terminals, rotated the listener secret into `.env.local`, restarted the dev server, and resent `evt_1UKV3m…`.
   - The dev server was verified stable, running this project (`next dev --webpack -p 3919`).
   - The listener process (`stripe.exe`) was repeatedly found gone between checks, including from a Founder-owned terminal. At one check, only about 1.6 GB of 15.9 GB of memory was free.
   - A listener `[200]` was reported for one resend. But no acquisition or entitlement was written, and a correctly delivered `evt_1UKV3m…` cannot return 200 without writing. That `[200]` could not be tied to this event.
5. **Founder ruling, 2026-09-28:** the attempt is an **interrupted test artifact**. There are no more listener restarts, resends, synthetic deliveries or dispute changes in that session. The Stripe dispute is left as it is, and prerequisite 7 stays open.

### Local state after the attempt (verified read-only)

- No acquisition or entitlement exists for `pi_3UKV3k…`. Totals are unchanged: 2 acquisitions, 4 entitlements.
- `9110bc4a…` is eligible and **not** authorized. Its only entitlement is the earlier `5958a85f…`, revoked with reason "Stripe full refund".
- The following are unchanged:
  - the historical ReMEMBER™ session `78403f91…` (`m2_to_m3`, 14 responses, last updated 2026-09-10)
  - the refunded acquisition `e3601d38…`
  - both `admin_grant` rows
  - `016f2839…`'s acquisition and entitlement
- No participant data was written.
- For disclosure: during diagnosis, two synthetic signed requests with an ignored event type were sent to the webhook to check the loaded secret. One got 200 `ignored`, the other 400. They wrote nothing.

### Classification

It was a **test-infrastructure interruption**. The evidence shows no application defect or database defect, and every Stripe object exists. The exact reason the resend did not reach this app was **not determined**, because the listener terminal output was not available.

### Loose end: the orphaned sandbox payment and dispute

`du_1UKV3l…` is still open in the sandbox, and its evidence is due 2026-10-06. If nobody responds, Stripe will probably close it as `lost` around then. That is not verified for the sandbox.

If a listener is running when that happens, the webhook will find no acquisition for `pi_3UKV3k…`. The PaymentIntent carries this offer, so the webhook will return 500 (the out-of-order retry guard). Nothing is written. That is correct and safe behavior, but it is noise.

Recommended: keep the clean re-run below on a **new** payment, and leave this artifact untouched unless the Founder rules otherwise.

## Clean re-run plan (after a machine reboot)

**Environment:**
1. Reboot the machine. Before starting, close browsers and other heavy apps, leaving one browser tab.
2. **Terminal 1**, owned by the Founder: `npx next dev --webpack -p 3919` from the repository root. Open `http://localhost:3919/` to confirm it loads.
3. **Terminal 2**, owned by the Founder:
   ```
   stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded,charge.refunded,charge.dispute.created,charge.dispute.closed --forward-to localhost:3919/api/stripe/webhook
   ```
   If it prints a new `whsec_` value, put it in `.env.local` and restart Terminal 1.
4. **Claude checks (read-only):**
   - The listener process and the dev server are both alive.
   - The `.env.local` secret equals the `stripe listen --print-secret` value. Neither is printed.
5. **Keep both terminals in view.** Every step below is confirmed from the listener line `<-- [200] POST http://localhost:3919/api/stripe/webhook [evt_…]`, not only from the database.

**Identity:** `9110bc4a…` again (eligible, not entitled). It gets a **new** acquisition, and its history stays untouched. Any other eligible identity must be Founder-confirmed first.

**Sequence:**
1. **Purchase.** The Founder buys through `/remember/purchase` with test card `4000 0000 0000 0259`. The listener shows `checkout.session.completed` `[200]` and `charge.dispute.created` `[200]`. Then verify:
   - exactly 1 new acquisition: `verified`, 9700 usd, `livemode false`, no refund, no dispute fields set
   - exactly 1 new active `verified_acquisition` entitlement linked to it
   - the identity is authorized
2. **An open dispute does not revoke.** Still authorized, acquisition still `verified`, entitlement still active.
3. **Lose the dispute.** Find the new dispute id (prefix `du_`) with `stripe disputes list --limit 1`, then run:
   ```
   stripe disputes update du_… --evidence[uncategorized_text]=losing_evidence --submit=true
   ```
   The listener should show `charge.dispute.closed` `[200]`. Then verify:
   - the acquisition is `dispute_lost`, with `dispute_lost_at` set and `provider_dispute_id` equal to that `du_…` id
   - `refunded_at` is null
   - only that entitlement is `revoked`, with reason exactly `Stripe dispute lost`
   - no rows were deleted
   - everything else (listed above) is unchanged
4. **Replays.** Resend `charge.dispute.closed` twice and the new `checkout.session.completed` once. Each must show `[200]` in the listener. Expect no new rows, no change, and no re-grant.
5. **Authorization.** Database authorization is false. Browser check as `9110bc4a…`: `/remember` redirects to `/pathways#remember`. No ReMEMBER™ content is involved.
6. **Record the result here, and rule on prerequisite 7.**

**If the listener dies mid-run:** stop. Do not resend blindly. Resend only once the listener is visibly running, and confirm each resend by its `[200]` line.

**Correction to the earlier plan:** Stripe dispute ids in this sandbox use the prefix `du_`. The earlier text used `dp_`.
