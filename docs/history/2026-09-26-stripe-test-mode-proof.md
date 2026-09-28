# Stripe Test-Mode Proof: Payment, Access, and Full Refund (Launch Sprint 2)

**Status:** Historical record. Stripe **sandbox** proof of payment → access and full refund → revocation. Public sales remain **CLOSED**. Not committed. Not deployed.
**Date:** September 26, 2026 (local; database timestamps are 2026-09-27 UTC)
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Environment

- Stripe account: Diana Francis sandbox (`acct_1SLuJ4DNmIXFPq5z`), sandbox only, `livemode: false` throughout. Stripe CLI 1.52.0, authenticated to the same sandbox.
- `.env.local`: `STRIPE_SECRET_KEY` (`sk_test_`), `STRIPE_WEBHOOK_SECRET` (`whsec_`), `REMEMBER_SALES_STATE=test`. Values were never printed.
- Local app: `next dev --webpack -p 3919`. Listener: `stripe listen --forward-to localhost:3919/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`.
- Setup incident: the first secret key was rejected by Stripe ("Invalid API Key provided"), so checkout returned `/remember/purchase?status=unavailable` and nothing was created. The Founder re-copied the key with Stripe's copy button; a read-only `GET /v1/account` then returned the sandbox account. No code change.

## Test-gate state before checkout

`/pathways#remember` still showed "Opening Soon" and the waitlist, with no purchase link. `/remember/purchase` was reachable only by direct URL (signed out: 307 to `/enter?next=remember-checkout`).

## Proof 1: payment → access

Test identity `9110bc4a-ea17-491a-a4de-d1b068d8abe3`, authenticated, eligible, not entitled before checkout.

| Check | Result |
|---|---|
| Checkout Session created, sandbox payment US$97 | `pi_3UK8j0DNmIXFPq5z1QylmWmg`, succeeded |
| Signed webhook | `POST /api/stripe/webhook 200` |
| Acquisition | 1 row `e3601d38…`, `status = verified`, amount 9700 usd, `livemode = false` |
| Entitlement | 1 row `5958a85f…`, `source_type = verified_acquisition`, `status = active`, product `pathway-two-remember` |
| `/remember/confirm` | 307 to `/remember` (already authorized when the browser returned) |
| `/remember` | 200 (eligible, entitled, authorized) |

**Founder ruling, 2026-09-26 (Option A): PASS** for Stripe test payment, signed webhook, acquisition creation, `verified_acquisition` entitlement creation, entitlement activation, eligibility, authorization, and post-purchase confirmation handoff.

### Distinction recorded: session resume is not a commerce defect

After purchase, `/remember` rendered only "Return to the codeXverse". This identity already had a ReMEMBER™ session (`78403f91…`, created 2026-08-18, last updated 2026-09-10) at `current_screen_key = m2_to_m3`, the terminal `exit` step of the built flow (`app/remember/RememberExperience.tsx`). `/remember` correctly resumed that session. The commerce path is not at fault.

Founder ruling: the existing session is preserved exactly as-is. It was not altered, deleted, or recreated; no responses were added. Fresh-entry proof, if wanted, uses a separate identity with no ReMEMBER™ session. The returning-purchaser experience is a separate participant-experience question: `docs/history/open-items.md` item 25.

## Proof 2: full refund → revocation

Pre-checks: acquisition `verified`; its entitlement `active`; the identity held no other entitlement.

Full refund `re_3UK8j0DNmIXFPq5z1Chht4wB` (9700, succeeded) via Stripe CLI in the sandbox.

| Check | Result |
|---|---|
| `charge.refunded` received, signature verified | `POST /api/stripe/webhook 200` |
| Acquisition | `status = refunded`, `refunded_at` set, row retained |
| This purchase's entitlement | `status = revoked`, `revoked_at` set, `revocation_reason = "Stripe full refund"`, row retained |
| Other entitlements | 2 `admin_grant` rows (other identities) unchanged |
| Effective entitlement for this identity | 0 rows (the `hasEffectiveEntitlement` query), so `/remember` redirects to `/pathways#remember` |
| Refund replay (`stripe events resend`, twice) | 200 each, no change |
| Payment replay (`checkout.session.completed` resent) | 200, no re-grant, no new rows |
| ReMEMBER™ session, progress, responses | unchanged (14 responses, both movements `completed`, `updated_at` 2026-09-10) |

Nothing was deleted. Final counts: 1 acquisition, 3 entitlements.

## Proof 3: post-refund browser check (2026-09-27)

Before the check, a read-only query confirmed the state was unchanged: acquisition `e3601d38…` still `refunded`, and entitlement `5958a85f…` still `revoked` ("Stripe full refund"). The app was restarted on port 3919, and the listener was restarted with the same three events and a matching signing secret.

The Founder tested the flow in a browser as the refunded test identity (`9110bc4a…`):

`/remember` → `/enter` (unauthenticated) → authenticate → `/pathways#remember`

**Founder ruling, 2026-09-27: PASS.** The revoked purchase entitlement no longer authorizes Pathway Two™: ReMEMBER™. No application code, participant data, or access was changed. The existing ReMEMBER™ session was not touched.

## Fresh-entry test identity (2026-09-27)

A read-only scan of all auth accounts looked for an existing identity suited to a fresh-entry proof. None was created or modified to qualify.

**Founder confirmation, 2026-09-27:** account `016f2839…` is Founder-controlled and approved for the fresh-entry Stripe sandbox proof.

Its starting state was re-verified read-only just before this record:

| Check | Result |
|---|---|
| Pathway One™ complete (`returns.q1_completed` set) | yes |
| Declaration™ | `sealed` (eligible) |
| Entitlements (any status) | 0 |
| ReMEMBER™ sessions | 0 |
| ReMEMBER™ movement progress | 0 |
| ReMEMBER™ responses | 0 |
| Acquisitions | 0 |

Access will come only from a sandbox purchase through the normal checkout and webhook path. No manual grant was made. Test A's `admin_grant` and the refunded identity's history were not touched.

## Proof 4: fresh purchase → entitlement → authorized fresh entry (2026-09-27)

Identity `016f2839…`. Its starting state is recorded above: eligible, not entitled, and with no ReMEMBER™ history.

Chain: eligible and not entitled → `/remember` blocked → US$97 sandbox checkout → payment succeeded → signed `checkout.session.completed` → verified acquisition → `verified_acquisition` entitlement → authorized → `/remember/confirm` → `/remember` → new ReMEMBER™ session → Entry Threshold screen `entry_01`.

| Check | Result |
|---|---|
| Checkout (`POST /api/remember/checkout`) | 303 to Stripe |
| Stripe event `evt_1UKRXHDNmIXFPq5zdngNuJaE` | `checkout.session.completed`, `status complete`, `payment_status paid`, 9700 usd, `livemode false`, `pi_3UKRXGDNmIX…` |
| Signed webhook | listener `[200]`; server `POST /api/stripe/webhook 200` |
| Acquisition | `1715c86a…`, `status = verified`, product `pathway-two-remember`, offer `remember-founding-access`, 9700 usd, `livemode = false`, created 2026-09-27 23:31:13 UTC |
| Entitlement | `afe5e2f6…`, `source_type = verified_acquisition`, `status = active`, not revoked, `granted_by_user_id` null (no manual grant) |
| Authorization | eligible (Declaration™ `sealed`), entitled, authorized |
| `/remember/confirm` | 307 to `/remember` |
| `/remember` | 200 |
| ReMEMBER™ session | new `751062cf…`, created 2026-09-27 23:31:15 UTC on the first `/remember` load, `status = active`, `current_movement_key = see_the_scattering`, `current_screen_key = entry_01`, `completed_at` null, linked to this identity's Pathway One™ session |
| Movement progress | 1 row, `see_the_scattering`, `active` (created on the same page load) |
| Responses | 0 |

Totals after this proof: 2 acquisitions, 4 entitlements.

**Founder ruling, 2026-09-27: PASS.** Fresh purchase → entitlement → authorized fresh entry.

### Participant state preserved

The participant is left at `entry_01`, not advanced. The session and progress row are kept exactly as the app created them. No responses were created, and this purchase has **not** been refunded.

### Screen and copy notes

- `entry_01` renders "You found yourself." (`app/remember/RememberExperience.tsx:186`; also `utils/remember.ts:241`, `ENTRY_THRESHOLD_SCREENS`). It is Entry Threshold Screen 1, which comes **before** Movement One™. The session already reads `current_movement_key = see_the_scattering` because that is the column default. That value does not mean the participant has entered Movement One™.
- "You found yourself." is existing Founder-approved, locked Entry Threshold copy according to the governing design record (`docs/design-specifications/pathway-two-remember-v1.0.md`, Part Two: Entry Threshold — LOCKED).
- The button label "continue" (`app/remember/RememberExperience.tsx:637`) has **no established Founder approval**. It is recorded for participant-facing copy review in `docs/history/open-items.md` item 26 and is unchanged.
- This proof does **not** approve current Movement One™ copy.

## Other observations

- One `GET /remember 500` (`TypeError: __webpack_modules__[moduleId] is not a function`) occurred right after a dev-server restart, before checkout. It is most likely a stale browser bundle; not reproduced.
- The dev server was once stopped by Claude Code under low system memory; it was restarted, not a code fault.

## State after this proof

*As of 2026-09-27. Current state: `docs/history/open-items.md` item 22. Prerequisite 7 was later implemented, and its first live proof was interrupted (`2026-09-27-dispute-sandbox-proof.md`).*

Canonical OPEN FOUNDING ACCESS prerequisites (`docs/history/open-items.md` item 22): 1 to 6 are met. Outstanding: 7 (dispute/chargeback handling), 8 (refund-policy copy), 9 (commerce copy), 10 (explicit ruling). Public sales remain **CLOSED**.

## Related

- `docs/history/2026-09-25-launch-sprint-2-waitlist-and-founding-access.md`
- `docs/history/2026-09-26-acquisitions-migration-applied.md`
- `docs/architecture/commerce.md`
- `docs/history/open-items.md`, items 22, 25, 26, and 27
- `docs/history/2026-09-27-dispute-sandbox-proof.md`
- `docs/design-specifications/pathway-two-remember-v1.0.md`, Part Two
