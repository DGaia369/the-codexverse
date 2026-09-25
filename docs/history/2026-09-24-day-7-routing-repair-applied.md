# Pathway One™ Day 7 Routing Repair Applied

**Status:** Historical record. Implemented, Verified Local (in-process, local dev server, and Founder browser proof PASSED 2026-09-25). Not committed. Not pushed. Not deployed.
**Date:** September 24, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`
**Directive:** Launch Sprint 1 Continuation, Founder Rulings 3, 4, 5

## Scope and boundary

Pathway One™ remains closed. This is a bounded implementation repair of the verified Day 7 defect (open item 19), not a redesign. Day 0, Day 3, the Day 7 body, the five Return questions, the Declaration™, the First Inheritance™, the Library, eligibility, the entitlement model, and the ReMEMBER™ participant experience were not changed.

## Approved architecture

Day 7 email → `/door?from=day7` → authenticated Day 7 Door branch → `/pathways#remember`.
The normal Return Complete → Door → Declaration™ flow is unchanged.

## Changes

| File | Change |
|---|---|
| `utils/resend.ts` | Day 7 CTA link is now `https://thecodexverse.com/door?from=day7`, with no identifier. CTA text is now `SEE WHAT COMES NEXT`. The stale `pathway=the_agreement` link and `CONTINUE TO THE AGREEMENT` CTA were removed. The body is unchanged. |
| `app/door/page.tsx` | Added a `from=day7` branch (early return). It resolves the participant server-side and requires a completed `returns` row for the authenticated email. It shows the Founder-approved copy with the CTA `see what comes next` → `/pathways#remember`, and falls back to the existing Door fallback otherwise. It serves no `door_messages` row and writes nothing. The diff to this file contains **no removed lines**, so the ordinary branch is byte-for-byte unchanged. |
| `proxy.ts` | An unauthenticated `/door?from=day7` request redirects to `/enter?next=day7`. All other `PROTECTED` redirects are unchanged. |
| `app/enter/page.tsx` | After OTP verification, `next === 'day7'` goes to `/door?from=day7`. Anything else goes to `/begin`, as before. Only this fixed token is recognized, and no URL is ever read from the query string. |

Founder-approved copy (Ruling 5): Door text "What you recognized is still yours." / "When you're ready, you can see what comes next.", Door CTA "see what comes next", email CTA "SEE WHAT COMES NEXT".

## Verification

- `tsc --noEmit` passed. ESLint was clean on all changed files except one error at `app/enter/page.tsx:21` (`react-hooks/set-state-in-effect`), which predates this change and is in an unchanged line. `next build` succeeded.
- In-process tests, read-only:

| Test | Result |
|---|---|
| Day 7 Door, completed Return (Identity F; Test A) | Approved copy, single CTA `/pathways#remember`, only `returns` read |
| Day 7 Door, no completed Return (synthetic) | Existing fallback |
| Day 7 Door, no user at page level | Existing fallback, no query |
| Legacy already-sent link (`from=day7&door=return_to_self&pathway=the_agreement`) | Repaired Day 7 Door |
| Ordinary Door with no `session_id` | Existing fallback (unchanged) |
| Proxy, logged-out `/door?from=day7` (and the legacy link) | 307 → `/enter?next=day7` |
| Proxy, logged-out `/door`, `/door?from=evil` | 307 → `/enter` |
| Proxy, `/door?from=day7&next=https://evil.example` | 307 → `/enter?next=day7` (the external value is discarded) |
| Proxy, `/begin?from=day7` | 307 → `/enter` (token applies to `/door` only) |
| No-mutation check (`participant_messages`, ReMEMBER™ state, entitlements) | Unchanged |

- Local dev server (port 3919, Webpack): logged-out `/door?from=day7` → 307 `/enter?next=day7`; `/pathways` serves `id="remember"`.
- The ordinary Door success path was not executed in-process, because it writes a `participant_messages` row. It is covered by the zero-removed-lines diff.

## Known limits

- The in-process tests used a service-role query client, so RLS on `returns` for the Day 7 branch is covered only by the Founder browser check. It uses the same anon-key query shape `app/auth/callback/route.ts` already relies on.
- Destination preservation covers the `/enter` OTP-code path. A link in the Supabase sign-in email (template outside the repository) would use the default site redirect.

## Launch-state copy flag (not changed)

The current Day 7 body, identical on `origin/main` and this branch, does not say "the next room is open". The nearest sentence is `utils/resend.ts:304`: "If something in you is ready to go deeper, the next door is waiting." It is returned to the Founder for a ruling on whether it conflicts with Pathway Two™: ReMEMBER™ being "Opening Soon".

**Founder ruling, 2026-09-25:** the sentence stays unchanged. It is not a launch-state defect at this time.

## Closure: Founder browser proof (2026-09-25)

**Status:** PASSED. Founder ruling: "The browser proof PASSES."

The Founder verified manually in a real browser, on the local dev server (`http://localhost:3919`, Webpack):

1. The Day 7 Door rendered the Founder-approved copy: "What you recognized is still yours." / "When you're ready, you can see what comes next.", with the CTA `see what comes next`.
2. Clicking the CTA routed to `/pathways#remember`.
3. The browser landed directly on the existing Pathway Two™: ReMEMBER™ public card.

This covers the RLS-bound `returns` read for the Day 7 branch under a real session, which the in-process tests (service-role client) could not.

Re-verification after the temporary Phase 5B routes were deleted: `tsc --noEmit` clean, `next build` succeeded (45 routes), targeted ESLint clean except `app/enter/page.tsx:21`.

### Pre-existing lint error, `app/enter/page.tsx:21`

`react-hooks/set-state-in-effect` on the `link_expired` `setUrlError(...)` call inside `useEffect`. Linting the committed `HEAD` version of the file reproduces the same error at the same line, and the line dates from commit `1f917b3` ("fix: production auth and SMTP stabilization"). The Launch Sprint 1 diff to this file touches only the post-verification redirect (around line 85). Per the Founder directive, it is **not repaired in this sprint**. Recorded here for a later, separate fix.

Day 7 repair final status: **Verified Local, including the Founder browser proof.** Not committed. Not pushed. Not deployed. The logged-out `/enter?next=day7` round trip and the Day 7 email itself are covered by in-process and dev-server checks, not by the Founder browser proof.

## Related documents

- `docs/history/open-items.md`, item 19
- `docs/architecture/email-flow.md`, "Day 7 transition"
- `docs/architecture/routing.md`, Route Protection Mechanism
- `docs/history/2026-09-24-phase-5b-remember-authorization-wiring.md`
