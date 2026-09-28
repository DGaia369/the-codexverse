# Launch Sprint 2: ReMEMBER™ Waitlist and Founding Access (first implementation pass)

**Status:** Historical record. **For current state see `docs/history/open-items.md` item 22** (2026-09-28: prerequisites 1–6 passed, 7 partial, 8–10 open). Implemented, Verified Local (in-process harness and local dev server). **Update 2026-09-25:** Migration 1 (waitlist) **Applied and Verified**, and the waitlist Founder browser proof **PASSED** (see `docs/history/2026-09-25-waitlist-migration-applied.md`). **Update 2026-09-26:** Migration 2 (acquisitions, corrected version) **Applied and Verified Live**, with 0 rows, and the database gate is closed (see `docs/history/2026-09-26-acquisitions-migration-applied.md`). Stripe **not configured**; no commerce test payment has occurred. Public sales **CLOSED**. Commerce proof pending. Not committed. Not pushed. Not deployed.
**Date:** September 25, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember` (baseline `8ef4f6c`)
**Directive:** Launch Sprint 2, ReMEMBER™ Waitlist + Stripe Acquisition → Entitlement → Authorized Entry

## Founder law applied

- Stripe verifies payment. the codeXverse™ decides product, eligibility, entitlement, authorization, and entry.
- Waitlist, eligibility, entitlement, and purchase are kept separate.
- Public sales remain closed until the Founder rules OPEN FOUNDING ACCESS.

## What was built

The architecture is in `docs/architecture/commerce.md`. The schema is in `docs/architecture/database.md` ("Launch Sprint 2").

| Area | Files |
|---|---|
| Waitlist | `supabase/migrations/20260925120000_create_waitlist_interests.sql`, `utils/waitlist.ts`, `app/api/waitlist/route.ts`, `components/public/RememberWaitlist.tsx`, `app/(public)/pathways/page.tsx` |
| Sales gate | `utils/salesGate.ts` (`REMEMBER_SALES_STATE`: closed by default, `test`, `open`) |
| Offer | `utils/offers.ts` (US$97, USD, server-side only) |
| Acquisition and entitlement | `supabase/migrations/20260925120100_create_acquisitions.sql`, `grantVerifiedAcquisitionEntitlement()` and `revokeRefundedAcquisition()` in `utils/entitlements.ts` |
| Stripe | `utils/stripe.ts`, `app/api/remember/checkout/route.ts`, `app/api/stripe/webhook/route.ts`; dependency `stripe@^22.6.2` (API version `2026-08-26.dahlia`) |
| Entry | `app/remember/purchase/page.tsx`, `app/remember/confirm/page.tsx`, `app/remember/confirm/ConfirmWaiting.tsx`, `app/remember/CommerceFrame.tsx`, `app/api/remember/access/route.ts`, `app/enter/page.tsx` (token table) |

Unchanged: `authorizeRememberAccess()`, `checkRememberEligibility()`, `hasEffectiveEntitlement()`, `grantAdminEntitlement()`, `proxy.ts`, `/remember`, Movement One™ through Six, the Entry Ritual, the Second Inheritance™, Recognition Mirrors™, participant responses and progress, Day 0/3/7, and the Declaration™ files `app/api/declaration-writing/route.ts` and `app/api/declaration/pdf/route.ts`. SHA-256 fingerprints of the two Declaration™ files were taken before and after.

## Verification

- `tsc --noEmit`: clean.
- ESLint on all Sprint 2 files: clean. `app/enter/page.tsx` still reports only the pre-existing `react-hooks/set-state-in-effect` error, now at line 27 (was 21) because six lines were added above it. Not repaired, per the Sprint 1 ruling.
- `next build`: succeeded, 51 routes. The first build showed `/remember/purchase` as static, because a closed gate at build time made Next prerender the redirect, so authorization would never have run per request. Fixed with `await connection()`. It is now dynamic.

### In-process harness: 50 of 50 passed

This was a scratchpad Node harness, outside the repository and never staged. It ran the **real** route handlers and services against **real PostgreSQL** (PGlite 0.5.8, PostgreSQL 18.3) carrying the repository's four commerce migrations. The following were substituted:

- `@supabase/supabase-js`: an adapter issuing the same SQL PostgREST would (`INSERT ... ON CONFLICT DO NOTHING`, `SELECT * FROM fn(...)`).
- Checkout and page tests only: `authorizeRememberAccess()` and the Stripe client.
- Page tests only: `next/server` `connection()`, which needs a live request.

Webhook signatures were produced and verified with the real Stripe SDK, using a harness-only secret. There were no network calls, and nothing touched Supabase or Stripe.

| Area | Proven |
|---|---|
| Waitlist | new email → one normalized row; duplicate → identical response, one row, `consent_at` unchanged; mixed case and whitespace → same row; invalid, missing, and non-string email → 400; unknown placement and client-supplied `interest`/`source` → cannot write other values; malformed or oversized body → 400; DB failure → 500 `unavailable` with no email in logs; no auth user and no entitlement created; DB rejects a non-normalized email directly |
| Webhook security | missing signature, wrong secret, tampered body → 400, nothing written |
| Grant | verified paid session → 1 acquisition + 1 `verified_acquisition` entitlement; effective-entitlement predicate false before and true after |
| Idempotency | same event redelivered 3× → no duplicates; 3 concurrent deliveries → exactly one grant; `async_payment_succeeded` after completion → no new grant |
| No grant | unpaid, expired, and async-failed sessions; amount, currency, mode, product, and user mismatch; non-UUID user; other offer; unrelated events; DB failure → 500 with nothing written |
| Refund | partial → access kept; full → acquisition `refunded`, own entitlement `revoked` with reason, predicate false; repeated → no change; late replay of the payment → no re-grant; an `admin_grant` for the same user survives; out-of-order refund for this offer → 500 (retry), foreign PaymentIntent → ignored |
| Privileges | `anon` and `authenticated` cannot execute `record_verified_acquisition` |
| Gate | unset, unknown, and `closed` → no checkout; `test` with a live key → refused; `open` → allowed; public card closed in `closed` and `test`, purchase link only in `open` |
| Checkout | unauthenticated → `/enter?next=remember-checkout`; ineligible → `/begin`; entitled → `/remember` (no repurchase); cross-origin → 403; body `amount=1&currency=jpy&product_key=other&user_id=...` ignored, and the session carries 9700 USD, the authenticated user, and server metadata |
| Purchase and confirm | purchase page redirects per gate and authorization, and renders the form only for eligible, not-entitled participants; confirm page: authorized → `/remember`, unauthenticated → `/enter?next=remember-confirm`, "Your payment is complete." only for this user's own paid session, no false success for another user's, unpaid, bogus, or missing session; the success page creates no entitlement |

### `/enter` fixed-token / open-redirect proof: 11 of 11 passed

Run on 2026-09-25, in the resumed Sprint 2 session. The test executed the exact `NEXT_DESTINATIONS` table and destination expression from `app/enter/page.tsx`, reproduced verbatim in Node, against these `?next=` values. It was not run through a browser.

| Input | Destination |
|---|---|
| `day7` | `/door?from=day7` (unchanged from Sprint 1) |
| `remember-checkout` | `/remember/purchase` |
| `remember-confirm` | `/remember/confirm` |
| (no `next`) | `/begin` |
| `https://evil.example` (arbitrary URL) | `/begin` |
| `//evil.example` (protocol-relative URL) | `/begin` |
| `/remember` (internal path, not a token) | `/begin` |
| `__proto__` | `/begin` |
| `constructor` | `/begin` |
| `toString` | `/begin` |
| `DAY7` (case variant) | `/begin` |

Only the three exact tokens are special-cased. The `hasOwnProperty` check keeps prototype-like names from resolving to anything, and every unsupported value falls back to `/begin`.

### Local dev server (port 3919, Webpack, gate closed)

- `/pathways` shows US$97 Founding Access, Opening Soon, and LET ME KNOW WHEN IT OPENS, and has no purchase link.
- `POST /api/waitlist` with an invalid email → `invalid_email`. With a valid email → 500 `unavailable`, because the table is not yet in Supabase (`PGRST205`, logged without the email). This is the real-stack failure path.
- `/remember/purchase` → 307 `/pathways#remember`. `POST /api/remember/checkout` → 303 `/pathways#remember`.
- Webhook without a signature → 400. With a forged signature → 500 `Not configured`, because no Stripe secret is set.
- `/api/remember/access` logged out → `{"authorized":false}`. `/remember/confirm` logged out → `/enter?next=remember-confirm`. `/remember` logged out → `/begin` (unchanged).

## Not yet proven

- ~~**Waitlist against live Supabase**, including the Founder browser proof.~~ **Closed 2026-09-25: PASSED**, including keyboard and repeated-submit behavior. See `docs/history/2026-09-25-waitlist-migration-applied.md`.
- **Stripe test mode end to end** (real Checkout, real test card, real signed webhook, and the cookie/RLS layer). This needs test keys, the webhook secret, and both migrations.
- Waitlist keyboard and loading behavior in a real browser. Covered by code (native controls, ref guard, focus management) and static render only.
- True database concurrency across separate connections. The harness ran concurrent deliveries against one PGlite connection; the `FOR UPDATE` lock and unique constraints are the guarantees.

## Related

- `docs/architecture/commerce.md`
- `docs/history/open-items.md`, items 17, 18, 19, 22

## Pre-application integrity correction: Migration 2 replay guard (2026-09-26)

**Status at the time of correction:** corrected before application; Migration 2 was not yet applied. **Later the same day:** the corrected version was Applied and Verified Live (`docs/history/2026-09-26-acquisitions-migration-applied.md`).

**Finding (Founder review of the exact SQL):** `record_verified_acquisition()` said that a replay must describe the same purchase, but for an existing row with the same `provider_checkout_session_id` it compared only `user_id` and `product_id`. A replay differing in offer, PaymentIntent, livemode, amount, or currency would have been accepted as equivalent.

**Correction (the only executable change):** the replay guard now requires every purchase-defining fact to match, using null-safe `IS DISTINCT FROM`: `user_id`, `product_id`, `offer_key`, `provider_payment_intent_id`, `livemode`, `amount`, `currency`. A mismatch raises `Acquisition replay does not match the recorded acquisition`, which aborts the call. No entitlement is created, and no acquisition or entitlement data changes. The function's purpose, the schema, the constraints, RLS, and the privileges are unchanged. Two stale comments were also corrected: the HELD status header, and "Flagged for Founder confirmation" on `ON DELETE RESTRICT`, which now cites the V1 ruling.

**Fingerprints (the earlier ones are superseded):**

| | Before | After |
|---|---|---|
| File SHA-256 | `0dd181cf5b6695243d51091480d4463ffde829b35e5e80498b68aa0fa254a222` | `10f72a8e886653c91ecb20dbdb98eeed168779166bada8ed8777bddb13966a1f` |
| Executable SQL (comments and blank lines stripped) | `023c38129fd8724dc76973304ca1cff6309e3392e0878934b792438005678f62` | `eb13f614c7c04d87c1bcda4a4f57f51384c3c4831386d4fb16d0f44e2aa2e28a` |

**Verification:** the harness passed 62 of 62 (the original 50 plus 12 new). The new tests cover:

- Same Checkout Session replayed with one differing field at a time (offer_key, payment_intent_id, payment_intent_id null versus recorded, livemode, amount, currency, user, product): each is rejected, and full before/after row snapshots of the acquisition and the user's entitlements, plus the global row counts, are identical.
- Exact duplicate ×3 is idempotent.
- A null PaymentIntent recorded, then a null replay, is idempotent; a later non-null replay is rejected.
- A signed webhook replay with a different PaymentIntent returns 500 with nothing changed.
- `anon` and `authenticated` cannot execute `revoke_refunded_acquisition`.

Also re-proved: concurrent exact duplicates produce one acquisition and one entitlement, a refunded acquisition cannot be re-granted, and `anon` and `authenticated` cannot execute `record_verified_acquisition`.

A mutation check ran the five mismatched replays against the pre-fix SQL: all five were **accepted**. Against the fixed SQL, all five were **rejected**. `tsc --noEmit` is clean. No application code changed, so lint and build were not re-run.

**Operational note:** a mismatched replay reaches the webhook as a database error, so the route returns 500 and Stripe retries until it gives up. It is logged each time and never grants.
