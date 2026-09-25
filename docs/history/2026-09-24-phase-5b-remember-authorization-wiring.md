# Commerce + Access Phase 5B: ReMEMBER™ Authorization Wiring

**Status:** Historical record. Implemented, Verified Local (in-process, all identity classes; see Continuation). Founder browser proof PASSED 2026-09-25. Not committed. Not pushed. Not deployed.
**Date:** September 24, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`
**Directive:** Codexverse™ Launch Sprint 1, Part A (Phase 5B Authorization Closure)

## Purpose

Phase 5B existed only as working-tree changes and conversation history. This record preserves it in the repository. It continues `docs/history/2026-09-20-remember-entitlement-gating-runtime-verification-checkpoint.md` and open item 19 (the 2026-09-18 Founder ruling that authorized entitlement-gating as the next dependency).

## What is implemented

- `utils/authorization.ts`: `authorizeRememberAccess()` composes `checkRememberEligibility()` (eligibility, owned by `utils/remember.ts`) with `hasEffectiveEntitlement()` (entitlement, owned by `utils/entitlements.ts`). It takes no `userId` argument. An ineligible result returns before entitlement is evaluated. Eligibility and entitlement stay separate predicates in separate files.
- `app/remember/page.tsx`: unauthenticated or ineligible participants are sent to `getRedirectForIneligibility()` (unchanged destinations). Eligible participants who are not entitled are sent to `/pathway`. Only authorized participants reach `getOrCreateActiveSession()`.
- `app/api/remember/screen/route.ts` and `app/api/remember/response/route.ts`: authorization runs on every request. Unauthenticated returns 401, any other denial returns 403 `Not authorized`, and operational failures fall through to the existing sanitized 500 handler (logged internally with `console.error`, distinct from a denial, which is not logged as an error).

### Refinement made on 2026-09-24

Both API routes previously resolved identity twice: once through their own `auth.getUser()` call, and again inside `authorizeRememberAccess()`, then acted on the first. They now use the `userId` returned by `authorizeRememberAccess()` as the only identity for every downstream read and write, and map `reason: 'unauthenticated'` to 401. The routes' own `createServerSupabaseClient` import was removed. Observable 401/403 behavior is unchanged.

Nothing in `utils/remember.ts`, `utils/entitlements.ts`, Movement One, Movement Two, participant-facing copy, `proxy.ts`, or Pathway One™ eligibility was changed.

## Verification

- `npx tsc --noEmit`: clean.
- `npx eslint app/api/remember app/remember/page.tsx utils/authorization.ts`: clean.
- `npx next build`: succeeded, 47 routes (including the two temporary Phase 5B routes, see below).

### In-process runtime proof

A scratchpad Node harness (outside the repository, never staged) loaded the real `authorizeRememberAccess()`, the real route handlers, and the real `/remember` page against the live Supabase project with the service-role key. Only one thing was substituted: the cookie-bound `createServerSupabaseClient()` was replaced with a stub that returns a fixed identity. For the controlled cases, `hasEffectiveEntitlement()` was wrapped so it could be forced to `false` or to throw. No auth session was minted, and no row was written. API probes sent deliberately invalid `screenKey` and `promptKey` values, so an authorized request stops at validation before any write.

| Case | `authorizeRememberAccess()` | entitlement calls | `PATCH /screen` | `POST /response` | `/remember` |
|---|---|---|---|---|---|
| 1 Unauthenticated | `authorized:false, eligible:false, reason:unauthenticated` | 0 | 401 | 401 | redirect `/begin` |
| 2 Test A (see finding below) | `authorized:true` | 1 | 400 validation (passed authorization, reached the participant's own session) | 400 validation | data load ran; render not completed (harness JSX setting, not a product defect) |
| 3 Eligible, not entitled (real eligibility, entitlement forced `false`) | `authorized:false, eligible:true, entitled:false, reason:not_entitled` | 1 | 403 `Not authorized` | 403 `Not authorized` | redirect `/pathway` |
| 4 Eligible and entitled (holder of an `admin_grant` row; real entitlement) | `authorized:true` | 1 | 404 `No active ReMEMBER session` | 404 `No active ReMEMBER session` | not rendered (render would have created a session) |
| 5 Operational error (entitlement lookup forced to throw) | throws | 1 | 500 sanitized, logged internally | 500 sanitized, logged internally | throws to framework error page |

Before/after snapshots of `remember_sessions`, `remember_responses`, and `remember_movement_progress` for the case 2 and case 4 identities were identical. **Mutations performed: none.**

### What this proof does not cover

- **Authenticated but Pathway One™-ineligible: not runtime-proven.** Test A is no longer ineligible (see finding below), and no other ineligible identity is on record. The auto-mode permission classifier blocked a scan of all auth users to find one, so the scan was not run. The short-circuit is proven only for `reason: unauthenticated`. The other ineligible reasons use the same `!eligibility.eligible` return in code.
- **The real cookie/session layer was not exercised.** A browser-session check using a real login is still outstanding.
- The eligible-not-entitled class was proven with the case 4 identity's real eligibility and a forced `false` entitlement answer, not with a real unentitled participant.
- It could not be confirmed that the case 4 identity is the Founder account. A follow-up read-only query to identify the entitlement holders was blocked by the permission classifier.

## Findings requiring a Founder ruling (as first found; resolved in the Continuation below)

1. **Entitlement state differs from the repository record.** Phase 4 recorded exactly one `entitlements` row (the Founder's `admin_grant`). On 2026-09-24 there are **two** `admin_grant` rows for `pathway-two-remember`. No repository record describes the second grant.
2. **Test A is no longer auth-only.** The 2026-09-20 checkpoint recorded Test A as auth-only at `/begin` (no `returns`, no entitlement, no ReMEMBER™ session). On 2026-09-24 Test A is eligible, effectively entitled, and has an active `remember_sessions` row (Movement One, `current_screen_key = m1_signal`, created 2026-09-22) with one active Movement One progress row and zero responses. No repository record describes these changes.
3. **`/pathway` as the not-entitled destination is undocumented.** `app/remember/page.tsx` cites "Founder Ruling 2, 2026-09-18" for a temporary neutral destination. No such ruling text exists in `docs/`. Open item 19 records a 2026-09-18 ruling but does not mention `/pathway`. `/pathway` is Pathway One™'s pathway view and is not a ReMEMBER™ surface.

None of these were changed. No entitlement was created, moved, or revoked. No identity was merged. No ReMEMBER™ progress was reset.

## Temporary forensic artifacts

`app/api/phase5b-proof-temp/route.ts` and `app/api/phase5b-diag-temp/route.ts` (created 2026-09-14) are untracked, unstaged, and uncommitted. The in-process proof did not use them. (Superseded 2026-09-25: both were deleted after the Founder browser proof passed. See the closing section.) They were **retained** because the directive allows removal only after the production authorization path is proven, and the real-cookie browser check and the ineligible-authenticated case are still outstanding. `phase5b-proof-temp` is the natural instrument for the Founder's browser check. Both should be deleted once that check passes, and neither may be committed.

## Related documents

- `docs/history/2026-09-20-remember-entitlement-gating-runtime-verification-checkpoint.md`
- `docs/history/2026-09-14-commerce-access-entitlement-service-applied.md`
- `docs/history/open-items.md`, items 17, 19, 20, 21
- `docs/architecture/routing.md`, "Pathway Two™: ReMEMBER™ Authorization Gate"
- `docs/implementation/builder-brief.md`, "Commerce + Access Phase 5B Report"

## Continuation: Founder rulings and proof closure (2026-09-24, same day)

### Ruling 1: read-only grant and identity reconciliation

The Founder approved the previously blocked SELECT-only query. Identities are recorded here by anonymous label only.

| Grant | Holder | Granted by | source_type | status | created_at (UTC) | expires / revoked |
|---|---|---|---|---|---|---|
| 1 | Identity F (Founder primary account) | Identity F (self-grant) | `admin_grant` | `active` | 2026-09-14 13:47:10 | none / none |
| 2 | Test A | Identity F | `admin_grant` | `active` | 2026-09-22 21:51:08 | none / none |

- These are the only two rows in `entitlements` across all products.
- Test A's changes since the 2026-09-20 checkpoint, in chronological order on 2026-09-22: completed Return 18:50, Declaration™ row created 19:08, Declaration™ sealed 19:19, entitlement granted by Identity F 21:51, ReMEMBER™ session created 21:56 (Movement One, `m1_signal`, zero responses). Two `scheduled_emails` rows exist for Test A.
- Founder-controlled identities: Identity F (eligible, entitled), Test A (eligible, entitled), and Identity B (an alias; eligible, **not** entitled). No Founder-controlled identity is Pathway One™-ineligible. Non-Founder participant accounts were not used as proof subjects.
- Nothing was created, moved, revoked, deleted, or altered.

### Ruling 2

The eligible, not-entitled destination is now `/pathways#remember`. A stable `id="remember"` anchor was added to the existing public Pathway Two™: ReMEMBER™ card (plus `scrollMarginTop` so the card clears the sticky header). Card copy is unchanged.

### Final in-process proof

This used the same method as above, with `hasEffectiveEntitlement()` real in every case except the forced error.

| Case | Identity | authorize | entitlement calls | screen API | response API | `/remember` |
|---|---|---|---|---|---|---|
| Unauthenticated | none | `unauthenticated` | 0 | 401 | 401 | → `/begin` |
| Authenticated, ineligible | synthetic (not a real account, real DB reads) | `pathway_one_not_started` | 0 | 403 | 403 | → `/begin` |
| Eligible, not entitled | Identity B (real) | `not_entitled` | 1 | 403 | 403 | → `/pathways#remember` |
| Eligible and entitled | Identity F (real) | authorized | 1 | 404 no session | 404 no session | not rendered (would create a session) |
| Entitled, existing session resume | Test A (real) | authorized | 1 | 400 validation | 400 validation | renders `RememberExperience` with the resumed session |
| Operational error | Identity F, lookup forced to throw | throws | 1 | 500 sanitized | 500 sanitized | error page |

No mutation of ReMEMBER™ state, `participant_messages`, or `entitlements` for Identity F, Test A, or Identity B. The ineligible branch used a synthetic identity because no existing suitable identity was available. The real cookie and RLS layer remains for the Founder browser check.

## Closure: Founder browser proof (2026-09-25)

**Status:** PASSED. Founder ruling: "The browser proof PASSES."

The Founder verified manually, in a real browser with a real login, while signed in as the primary Founder identity (Identity F), that `/api/phase5b-proof-temp` returned:

```
{"authorized":true,"eligible":true,"entitled":true}
```

This exercises the real cookie/session layer and the RLS-bound queries behind `authorizeRememberAccess()` for the eligible and entitled class, which the in-process proof could not cover.

Afterwards:

- `app/api/phase5b-proof-temp/` and `app/api/phase5b-diag-temp/` were deleted. Neither was ever staged or committed, and neither appears in `git status`.
- `npx tsc --noEmit`: clean.
- Targeted ESLint on every Launch Sprint 1 implementation file: clean, except the pre-existing `app/enter/page.tsx:21` error (see `docs/history/2026-09-24-day-7-routing-repair-applied.md`).
- `npx next build`: succeeded, 45 routes (47 minus the two temporary routes).

Open item 20: Founder ruling 2026-09-25 is to preserve the established provenance, change neither entitlement nor Test A's state, and leave the data as it is.

Phase 5B final status: **Verified Local, including the Founder browser proof.** Not committed. Not pushed. Not deployed. Verified Live requires production testing after deployment.
