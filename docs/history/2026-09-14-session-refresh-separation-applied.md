# Commerce + Access Phase 5A — Session Refresh Separation Applied

**Status:** Historical record
**Date:** September 14, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Purpose

Item 16 (`docs/history/open-items.md`) recorded an unresolved architectural question: `proxy.ts` coupled Supabase session refresh to its `PROTECTED` route-protection list, leaving `/remember` and `/record` (authenticated Server Component pages) outside session-refresh coverage even though a Server Component cannot itself persist a refreshed cookie. Founder ruling: Option B, scoped — separate session refresh from route protection structurally, rather than extending `PROTECTED` to cover these routes.

## What was implemented

`proxy.ts` now carries two independent route lists instead of one:

- `PROTECTED` — unchanged in membership and meaning. A match still triggers Proxy's redirect-to-`/enter` behavior for an unauthenticated request.
- `REFRESH_ONLY` — new: `/remember`, `/record`, `/record/evidence`. A match runs the same session-refresh branch (`supabase.auth.getUser()`, refreshed cookies persisted onto the response) but never triggers Proxy's own redirect. Each of these three pages keeps its own existing unauthenticated-participant redirect logic as the sole authority on where the participant goes (`checkRememberEligibility()` for `/remember`; the bespoke redirects already in `app/record/page.tsx` and `app/record/evidence/page.tsx`).

Both lists are matched by a single shared `matchesRoute()` helper (exact path or genuine subpath — the same fix that previously prevented `/pathway` from colliding with `/pathways`), so `PROTECTED` and `REFRESH_ONLY` use identical matching semantics.

`/api/*` Route Handlers were not touched and were not added to `REFRESH_ONLY`: they construct their own server-side Supabase client and, unlike Server Components, are permitted to persist cookies directly, so no gap existed there.

## Validation

`npx tsc --noEmit` — clean.

Runtime-verified against a local `next dev` server, unauthenticated (no session cookie):

| Path | List | Result |
|---|---|---|
| `/begin` | `PROTECTED` | 307 → `/enter` (unchanged) |
| `/remember` | `REFRESH_ONLY` | 307 → `/begin` (not `/enter`) |
| `/record` | `REFRESH_ONLY` | 307 → `/begin` (not `/enter`) |
| `/record/evidence` | `REFRESH_ONLY` | 307 → `/record` (not `/enter`) |
| `/` | neither | 200, no Supabase call |
| `/pathways` | neither | 200, no Supabase call |

This confirms: `PROTECTED` behavior is unchanged, the three `REFRESH_ONLY` routes are refreshed without being redirected to `/enter`, and public routes gained no universal Supabase refresh.

**Not directly observed:** Set-Cookie refresh under an actual near-expiry session token. No such session state existed in the local verification environment, and none was manufactured to force it. This is a source-verified fix — the previously absent refresh code path for these three routes is now present and structurally correct — not something runtime-proven under an expiring token specifically.

## What was deliberately not built

No changes to `PROTECTED` membership, no changes to `/api/*`, no changes to any page's own redirect-destination logic, no new route protection.

## Related documents

- `docs/architecture/routing.md` — "Route Protection Mechanism," updated to describe the two-list split
- `docs/architecture/session-management.md` — "Session Refresh Mechanism," updated with the resolution and verification table
- `docs/history/open-items.md` — item 16, updated to `RESOLVED (Phase 5A, 2026-09-14)`
