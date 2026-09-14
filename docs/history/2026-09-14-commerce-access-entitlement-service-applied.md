# Commerce + Access Phase 4 — Entitlement Service Implemented and Live-Proven

**Status:** Historical record
**Date:** September 14, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Purpose

Phase 4 moved Commerce + Access from database architecture (Phase 3 + 3A) into the first application-level entitlement behavior. The proof condition, approved in advance: a Founder/Admin grant produces a live `entitlements` row, `hasEffectiveEntitlement()` returns `true` for it, and no broader commerce, authorization, or route-wiring work is introduced in the same phase.

## What was implemented

`utils/entitlements.ts` (previously a 0-byte stub) now implements:

- `PATHWAY_TWO_PRODUCT_KEY` — the stable product key constant (`'pathway-two-remember'`). Founding Access and any price value remain offer/commerce concepts and are not encoded anywhere in this file.
- `hasEffectiveEntitlement(userId, productKey)` — resolves the product by key, then performs an existence-only query against `entitlements` for `status = 'active' AND starts_at <= now() AND (expires_at IS NULL OR expires_at > now())`. Does not inspect `source_type`, `product.status`, Pathway eligibility, or recognition data, and does not assume a single row per participant/product. An unknown product key throws a distinct error rather than returning `false`, so "the product doesn't exist" and "the participant lacks an entitlement" cannot be confused.
- `grantAdminEntitlement({ userId, productKey, grantedByUserId, startsAt?, expiresAt? })` — creates one `source_type = 'admin_grant'`, `status = 'active'` entitlement row. `grantedByUserId` is required by this application code (the database intentionally does not enforce this — see Phase 3A). If `expiresAt` is supplied, it is validated as strictly after `startsAt` before the write is attempted.

The service-role access pattern already established in `utils/remember.ts` was reused directly (a module-scoped singleton client plus a narrow local `Database` type covering only `products`/`entitlements`) rather than introducing a second database-access architecture. The npm `server-only` package is not installed anywhere in this repository and was not introduced by this phase; server-side-only boundaries are preserved structurally the same way `utils/remember.ts` already does it (service-role key only, never a `NEXT_PUBLIC_*` variable).

No API route, no authorization composition (`authorizeRememberAccess` or equivalent), no checkout, no payment-provider logic, and no route wiring were introduced. This matches the approved Phase 4 scope exactly.

## Validation

`npx tsc --noEmit` (clean), `eslint utils/entitlements.ts` (clean), `next build` (succeeded, all 45 routes compiled, no regressions).

## Live proof

Performed with explicit Founder approval, after a Pre-Write Review reporting the exact mechanism, target identity, and row values to be written.

**Mechanism:** No script-runner, `scripts/` directory, or admin mechanism exists in this repository. A temporary `.ts` proof script was compiled with the repository's already-installed local `typescript` compiler (no new package installed or added to `package.json`) and run once with `node` against the compiled output, calling the real `grantAdminEntitlement()` and `hasEffectiveEntitlement()` exports directly rather than reimplementing equivalent logic or inserting via raw SQL. The script and its compiled output were deleted immediately after the proof and were never staged or committed.

**Participant identification:** The Founder account was identified via a read-only `auth.admin.listUsers()` scan (40 total users at the time), which returned exactly one match for the Founder's known email — an unambiguous identity, not a guessed UUID.

**Grant created:** One `admin_grant` entitlement for product `pathway-two-remember`, participant = Founder account, `granted_by_user_id` = the same Founder account (a self-grant, as approved), `status = active`, `starts_at` = grant time, `expires_at = null`, `revoked_at = null`, `revocation_reason = null`.

**Core proof:** `hasEffectiveEntitlement(founderUserId, 'pathway-two-remember')` returned `true`.

**Negative control:** `hasEffectiveEntitlement()` called with an intentionally nonexistent product key surfaced the designed `Unknown product key` error rather than silently returning `false`, confirming the two failure modes are not conflated. No second user or second entitlement was created.

Personal identifiers (email, UUID) are deliberately not recorded in this document. They were used transiently for the live proof only. See the private Pre-Write Review exchange in the session transcript if the identifiers themselves are ever needed for direct database administration.

## Multiple-grant semantics

Not independently re-tested with a second live grant in this phase — the directive explicitly does not require this. `hasEffectiveEntitlement()`'s existence-style query (no `.single()`, no assumption of at most one row) was inspected and confirmed structurally incapable of assuming a unique entitlement row; a revoked row and an effective row for the same participant/product would not conflict, since the query filters on `status = 'active'` and returns as soon as any matching row exists. A dedicated non-production test may prove this behavior explicitly in a future phase without writing a second row against the Founder's live account.

## What was deliberately not built

`authorizeRememberAccess()` or equivalent, `/remember` route wiring, `/api/remember/*` entitlement wiring, checkout, payment-provider integration, offers, gifts, licences, memberships, and affiliate logic. Item 16 (`docs/history/open-items.md`), the `proxy.ts`/session-refresh gap, remains **OPEN** and unaffected by this phase.

## Related documents

- `docs/architecture/database.md` — "Commerce + Access: `products` and `entitlements`" section, Phase 4 subsection
- `docs/history/2026-09-13-commerce-access-entitlement-schema-applied.md` — Phase 3 foundation record
- `docs/history/2026-09-14-commerce-access-entitlement-integrity-applied.md` — Phase 3A integrity record
- `docs/history/open-items.md` — item 17, updated to reflect Phase 4 completion and the remaining approved next steps
- `docs/implementation/builder-brief.md` — Commerce + Access Phase 4 Report
