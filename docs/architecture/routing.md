# Routing Architecture

**Status:** Current-state map

## Participant routes

- `/`
- `/begin`
- `/pathway`
- `/pathway/return-to-self`
- `/return`
- `/return-complete`
- `/between-threshold`
- `/declaration`
- `/door`
- `/door/lost`
- `/door/rebuilding`
- `/door/stuck`
- `/enter`
- `/foundation`
- `/guided`
- `/next-step`
- `/tier-2`
- `/record`
- `/remember`

## API routes

- `/api/agreement`
- `/api/declaration`
- `/api/declaration-writing`
- `/api/declaration/pdf`
- `/api/return`
- `/api/return/cron/send-scheduled-emails`
- `/api/remember/screen`
- `/api/remember/response`
- `/auth/callback`

## Route Protection Mechanism

**Verified (source inspection, 2026-09-10):** Route protection is implemented in `proxy.ts` at the repository root, under the current Next.js Proxy convention. Next.js has renamed the `middleware.ts` file convention to `proxy.ts`; this repository correctly follows the current convention, and no `middleware.ts` file should be expected here. Any prior reading of this repository that treated the absence of `middleware.ts` as an absence of route-level session/auth handling was incomplete — the mechanism exists, under its current name.

For paths matched by its internal `PROTECTED` list, `proxy.ts` constructs a Supabase SSR client bound to both the incoming request's cookies and the outgoing response's cookies, calls `supabase.auth.getUser()` (refreshing the session), and redirects unauthenticated requests to `/enter`.

`PROTECTED` currently contains: `/begin`, `/return`, `/pathway`, `/door`, `/foundation`, `/guided`, `/next-step`, `/tier-2`, `/return-complete`.

Paths not in `PROTECTED` — currently including `/remember`, `/record`, `/declaration`, `/between-threshold`, `/enter`, and every `/api/*` route — return immediately without any Supabase call. See `docs/architecture/session-management.md` ("Session Refresh Mechanism") for the session-refresh implication of this for `/remember` and `/record` specifically, and `docs/history/open-items.md` ("Decouple Supabase session refresh from route protection") for the unresolved architectural decision.

## Routing principles

- Routes should reflect participant experience, not internal jargon.
- Session-protected pathway pages must not be directly accessible without valid context.
- Future Library routes must preserve the distinction between the collection and the individual Recognition Record™.
- Retired tier language should not be expanded without deliberate review.

## Pending review

- Confirm which legacy routes remain necessary.
- Confirm whether `/tier-2` should be renamed or retired.
- Document all redirects and guard logic.
