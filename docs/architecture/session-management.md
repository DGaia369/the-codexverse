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

Root `proxy.ts` implements the standard Supabase SSR cookie/session-refresh pattern: it builds a `createServerClient` bound to both `request.cookies` and `response.cookies`, calls `supabase.auth.getUser()`, and returns the mutated response. This runs only for request paths matched by `proxy.ts`'s internal `PROTECTED` list (see `docs/architecture/routing.md`, "Route Protection Mechanism").

`/remember` and `/record` are Server Component pages and are not currently included in that `PROTECTED` coverage. Their own server-side Supabase client (`utils/supabase/server.ts`) cannot itself persist a refreshed session cookie when `setAll` is invoked there — Next.js does not permit a Server Component to write cookies, and `setAll`'s catch block silently no-ops in that context.

This creates a potential session-refresh persistence gap for `/remember` and `/record`: `auth.getUser()` still succeeds for the individual request, but a refreshed token has no path to reach the browser on these two pages, since neither `proxy.ts` nor the page itself can write it there. **The actual participant-facing effect of this gap has not been runtime-verified** — this is a source-reading finding only.

`/api/*` Route Handlers are a different case: they construct their own server-side Supabase client, and, unlike Server Components, Route Handlers are permitted to persist cookies directly. No defect is declared for `/api/*` routes on the basis of source inspection alone.

See `docs/history/open-items.md` ("Decouple Supabase session refresh from route protection") for the unresolved architectural decision this raises.

## Pending documentation

- Session creation point
- Session expiry
- Cookie configuration
- Supabase authentication relationship
- Email-to-session resolution
- Recovery behavior
- Multiple-device behavior
- Future Library access rules
