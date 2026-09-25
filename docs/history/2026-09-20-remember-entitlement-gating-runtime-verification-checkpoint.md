# Pathway Two™: ReMEMBER™ Entitlement Gating — Runtime Verification Checkpoint

**Status:** Historical record (checkpoint — implemented and staged; entitlement behavior runtime verification incomplete)
**Date:** September 20, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Purpose

Continues item 19 (`docs/history/open-items.md`). The Founder's 2026-09-18 ruling authorized entitlement-gating as the next dependency: wiring `authorizeRememberAccess()` into `/remember`'s page and its two API routes. This checkpoint preserves the verified state reached on 2026-09-20 so work can resume from a known point rather than being re-derived.

Evidence provenance: This checkpoint preserves Founder-supplied and session-verified runtime evidence from September 20, 2026, reconciled against the repository before documentation. It must not be treated as evidence that every stated database condition was independently re-queried during this documentation-only pass.

## What is staged

The ReMEMBER™ entitlement implementation exists as uncommitted working-tree changes across four files:

- `utils/authorization.ts`
- `app/remember/page.tsx`
- `app/api/remember/screen/route.ts`
- `app/api/remember/response/route.ts`

Status: **Implemented and staged; entitlement behavior runtime verification incomplete.** Nothing described in this section has been committed or pushed.

## Verification performed

- TypeScript verification (`tsc --noEmit`) passed.
- Existing repository lint findings were reviewed and confirmed unrelated to the four files above.

## Local dev server issue and workaround

- Turbopack failed locally with Windows child-process exit code `0xc0000142`.
- The same project served successfully under Webpack, on port 3919.
- Temporary test harness command:

  ```
  npm run dev -- --webpack -p 3919
  ```

## Test identity created

**Test A** synthetic identity: `2emaildee+rememberA@gmail.com`

- Created successfully through the real `/enter` application flow.
- Reached `/begin`.
- Did **not** enter `/return` or begin Pathway One™.
- Auth user ID: `abdeb535-4d72-426b-b4ab-845e78c14e86`

**Test B** was not created.

## What did not happen

- No entitlement was granted, revoked, expired, restored, or otherwise mutated.
- No ReMEMBER™ session creation was intentionally triggered during this checkpoint. Whether a `remember_sessions` row exists for Test A remains to be established by the pending read-only participant-state verification.
- No participant-state verification queries were executed after the final schema/key reconciliation below.

## Reconciled lookup relationships

For use by the next verification pass:

| Table | Key relationship |
|---|---|
| `returns` | `email`, `user_id`, `session_id`, where `user_id`/`session_id` = auth user id |
| `entitlements` | `user_id` |
| `remember_sessions` | `user_id` |
| `remember_responses` | `remember_session_id`, derived from `remember_sessions.id` |
| `remember_movement_progress` | `remember_session_id`, derived from `remember_sessions.id` |
| `participant_flows` | `user_id`/`session_id` = auth user id |
| `loops` | `user_id`/`session_id` = auth user id |
| `scheduled_emails` | `email` |
| `pathway_two_agreements` | `session_id` = auth user id |
| `declarations` | conditional on a found `returns.session_id` |
| `participant_messages` | `session_id`, caveated as documented elsewhere |
| `door_messages` | global content, not participant-specific |
| `welcome_flows` | global content, not participant-specific |

## Next verified starting point

1. Reconfirm/restart the Webpack harness on port 3919.
2. Run the approved GET/read-only Test A participant-state verification using the reconciled key map above.
3. Only if a parent row exists, query its legitimate child rows.
4. Otherwise, establish Test A as auth-only at `/begin`.

## Test A baseline verification result

Performed as a fileless, in-memory, read-only Node process (Next's own `loadEnvConfig`, service-role Supabase client, `count: "exact", head: true` queries only — no row content fetched, no repository or scratchpad files created, service-role key never printed). No mutation of any kind was performed.

- Webpack harness: PASS
- `/enter`: HTTP 200
- Test A auth user: CONFIRMED
- `returns`: 0
- `entitlements`: 0
- `remember_sessions`: 0
- `participant_flows`: 0
- `loops`: 0
- `scheduled_emails`: 0
- `pathway_two_agreements`: 0
- `participant_messages`: 0
- `declarations`: not applicable — no `returns` parent row exists
- `remember_responses`: not applicable — no `remember_sessions` parent row exists
- `remember_movement_progress`: not applicable — no `remember_sessions` parent row exists
- Entitlement row exists: NO
- ReMEMBER™ session exists: NO
- Classification: auth-only at `/begin`
- Mutations performed: NONE

This establishes the clean pre-eligibility / pre-entitlement baseline only. It does not yet prove entitlement authorization behavior — no entitlement has been granted to Test A, and `authorizeRememberAccess()` has not yet been runtime-exercised against either an entitled or an unentitled participant.

## What was deliberately not done in this session

During the original documentation-only checkpoint creation pass, no new tests were run, no application code was modified, no Supabase state was modified, no server was started as part of creating the checkpoint, no entitlement action was taken, and no commit or push occurred. Subsequent Test A baseline verification is documented above; that verification started the approved temporary Webpack harness and performed read-only queries only, with no Supabase mutation, entitlement mutation, application-code change, commit, or push.

## Related documents

- `docs/history/open-items.md` — item 19
- `docs/history/2026-09-14-commerce-access-entitlement-service-applied.md`
- `docs/history/2026-09-14-session-refresh-separation-applied.md`

## Continuation

Continued on 2026-09-24 in `docs/history/2026-09-24-phase-5b-remember-authorization-wiring.md`. Test A's state had changed since this checkpoint: it is now eligible, entitled, and has an active ReMEMBER™ session created 2026-09-22 (open item 20). This checkpoint's baseline remains accurate for 2026-09-20.
