# Session Management

**Status:** Current-state outline

## Current identifier

`session_id`

## Known use

The Return to Self flow uses a protected session across participant pages and API requests.

## Principles

- A participant’s answers and artifacts must remain associated with the correct session.
- Session protection must prevent accidental cross-participant access.
- Recognition Records™ must be retrieved through authenticated or otherwise verified participant context.
- Future Library access must be private and participant-specific.
- Session handling must not depend on client-trusted values alone.

## Session Refresh Mechanism

**Verified (source inspection, 2026-09-10):** This repository uses the current Next.js `proxy.ts` file convention, which is the renamed successor to `middleware.ts`. No `middleware.ts` file exists in this repository, and none should be expected — `proxy.ts` is the current convention, not a missing file.

Root `proxy.ts` implements the standard Supabase SSR cookie/session-refresh pattern: it builds a `createServerClient` bound to both `request.cookies` and `response.cookies`, calls `supabase.auth.getUser()`, and returns the mutated response.

**Resolved 2026-09-14 (item 16):** Session refresh and route protection are now structurally independent in `proxy.ts`. Two lists govern this, matched with identical semantics (exact path or genuine subpath):

- `PROTECTED` — unchanged in membership and meaning. Only a `PROTECTED` match can trigger the redirect-to-`/enter` behavior for an unauthenticated request (see `docs/architecture/routing.md`, "Route Protection Mechanism").
- `REFRESH_ONLY` — new. Currently `/remember`, `/record`, `/record/evidence`. A match here runs the same session-refresh branch (`getUser()`, refreshed cookies persisted onto the response) but never triggers Proxy's own redirect; the page's existing unauthenticated-participant logic remains the sole authority on where the participant goes.

`/remember` and `/record` (and `/record/evidence`, which shares the same pattern) are Server Component pages. Their own server-side Supabase client (`utils/supabase/server.ts`, or the equivalent inline client in `app/record/page.tsx` and `app/record/evidence/page.tsx`) cannot itself persist a refreshed session cookie when `setAll` is invoked there — Next.js does not permit a Server Component to write cookies, and `setAll`'s catch block silently no-ops in that context. Adding these three routes to `REFRESH_ONLY` closes that persistence gap: Proxy now refreshes their session cookies on every matched request, while each page keeps its own existing redirect destination unchanged (`checkRememberEligibility()`'s redirects for `/remember`; the bespoke `/begin` / `/return-to-self` / `/declaration` / `/record` redirects already in `app/record/page.tsx` and `app/record/evidence/page.tsx`).

Runtime behavior verified locally (unauthenticated, no session cookie): `/begin` (`PROTECTED`) still redirects to `/enter`, unchanged; `/remember` redirects to `/begin` (not `/enter`); `/record` redirects to `/begin` (not `/enter`); `/record/evidence` (no `session_id`) redirects to `/record` (not `/enter`); `/` and `/pathways` (neither list) return `200` with no Supabase call. **Set-Cookie refresh on an actual near-expiry token was not directly observed** — no such session state existed in the local verification environment, and none was manufactured to force it. This remains a source-verified fix (the code path that was previously absent for these three routes is now present and structurally correct), not something runtime-proven under an expiring token specifically.

`/api/*` Route Handlers were not added to `REFRESH_ONLY` and remain unaffected: they construct their own server-side Supabase client, and, unlike Server Components, Route Handlers are permitted to persist cookies directly. No defect was ever declared for `/api/*` routes on the basis of source inspection, and this phase did not change them.

See `docs/history/2026-09-14-session-refresh-separation-applied.md` for the full application record and `docs/history/open-items.md` (item 16) for the current status.

## Pending documentation

- Session creation point
- Session expiry
- Cookie configuration
- Supabase authentication relationship
- Email-to-session resolution
- Recovery behavior
- Multiple-device behavior
- Future Library access rules
