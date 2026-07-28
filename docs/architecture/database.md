# Database Architecture

**Status:** Current-state outline

## Platform

Supabase

## Known tables

### `returns`

Known fields:

- `email`
- `q1`
- `q2`
- `q3`
- `q4`
- `q5`
- `door`
- `pathway`
- `status`
- `session_id`
- `response_category`
- `next_instruction`
- `created_at`

### `declarations`

Exists beneath the Declaration™ experience.

Detailed schema should be documented from Supabase before being treated as complete.

## Data principles

- Participant-authored language must be preserved exactly.
- Recognition Records™ must remain attributable to the correct participant and session.
- Future Library queries must gather artifacts without turning them into a score or linear worthiness tracker.
- Service-role access must remain server-side.
- Participant-facing routes must not expose service-role credentials.

## Pathway Two™: ReMEMBER™ tables

**Status:** Verified Live. Applied manually through the Supabase Dashboard SQL Editor.

**Application date:** July 28, 2026
**Verification date:** July 28, 2026

**Migration file:** `supabase/migrations/20260728_create_remember_tables.sql` — this file remains the authoritative record of the executed SQL and was not altered after execution. It is the first repository-tracked Supabase migration. No `supabase/migrations` directory, and no migration-file workflow of any kind, existed in this repository before this file was created. No Supabase CLI migration history exists for this change, because it was applied manually through the Dashboard SQL Editor rather than `supabase db push`. Every table described elsewhere in this document (`returns`, `declarations`, `pathway_two_agreements`, `loops`, `participant_flows`, `welcome_flows`, `scheduled_emails`, and others referenced only in code) was created directly against Supabase and remains undocumented at the schema level here. This migration does not change that for existing tables — it establishes the tracked-migration workflow going forward, for `remember_sessions` and `remember_responses` only.

**Verification evidence** (read-only query against the live project, July 28, 2026):

| Check | Result |
|---|---|
| `public.remember_sessions` exists | yes |
| `public.remember_responses` exists | yes |
| `remember_sessions` column count | 11 |
| `remember_responses` column count | 8 |
| Row Level Security enabled, `remember_sessions` | true |
| Row Level Security enabled, `remember_responses` | true |
| Named indexes matched | 4 of 4 expected |
| Named constraints matched | 5 of 5 expected |
| Direct-access policies | 0 (intended — see Row Level Security posture below) |

See `docs/history/2026-07-28-remember-database-foundation-applied.md` for the full provenance record of this application.

### `remember_sessions`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | primary key, `default gen_random_uuid()` |
| `user_id` | `uuid not null` | references `auth.users(id) on delete cascade` — the authoritative owner |
| `email` | `text not null` | normalized snapshot only, not an ownership key |
| `pathway_one_session_id` | `text not null` | records the qualifying Pathway One™ `returns.session_id` |
| `status` | `text not null default 'active'` | check constraint: `active` or `completed` |
| `current_movement_key` | `text not null default 'see_the_scattering'` | |
| `current_screen_key` | `text not null default 'entry_01'` | |
| `started_at` | `timestamptz not null default now()` | |
| `completed_at` | `timestamptz null` | |
| `created_at` / `updated_at` | `timestamptz not null default now()` | `updated_at` is set explicitly by the application on write; no database trigger is defined (see Timestamp behaviour below) |

### `remember_responses`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | primary key, `default gen_random_uuid()` |
| `remember_session_id` | `uuid not null` | references `remember_sessions(id) on delete cascade` |
| `movement_key` | `text not null` | |
| `prompt_key` | `text not null` | |
| `prompt_order` | `smallint not null` | check constraint: must be greater than `0` |
| `response_text` | `text not null` | |
| `created_at` / `updated_at` | `timestamptz not null default now()` | same convention as above |

### Ownership model

`user_id` is the authoritative owner of a `remember_sessions` row. `email` is a normalized snapshot for readability/audit only and must never be used as an ownership key. `pathway_one_session_id` preserves which Pathway One™ `returns` session qualified the participant for entry; it is not a live foreign key, since `returns.session_id` is not typed or guaranteed unique as a `uuid` in the current schema.

No ReMEMBER™ API route may trust a client-supplied `session_id` without first verifying ownership through `auth.getUser()`. This corrects a gap identified in the existing `declarations` API routes (`/api/declaration`, `/api/declaration-writing`, `/api/declaration/pdf`), which currently resolve records by a client-supplied `session_id` alone via a service-role client, with no check that the requesting authenticated user owns that session.

### One-active-session rule

A partial unique index — `unique (user_id) where status = 'active'` — permits at most one active `remember_sessions` row per participant. This is deliberately a partial index rather than a table-wide unique constraint on `user_id`, so that multiple *completed* sessions remain possible for the same participant. Whether ReMEMBER™ ultimately produces one or multiple Recognition Records™ per participant is an open constitutional question (see `docs/architecture/pathway-two-build-plan.md`) that this schema does not foreclose.

Movement completion does not set `status = 'completed'` on the session. Pathway Two™ has movements beyond Movement One that are not yet implemented; a session is only marked `completed` when the full ReMEMBER™ experience is complete, not at the end of any single movement. Internal progress within a movement is tracked via `current_movement_key` / `current_screen_key`, which are server-side fields only and must not be exposed as participant-facing progress tracking.

### Response uniqueness rule

A unique constraint on `(remember_session_id, movement_key, prompt_key)` guarantees exactly one response row per prompt within a movement, supporting safe upsert-on-conflict behaviour (the same idiom already used by `declarations` via `onConflict: 'session_id'`), and enabling resumable, editable responses without duplicate rows.

A named check constraint, `remember_responses_prompt_order_positive_check`, requires `prompt_order > 0`, preventing a zero or negative ordering value from ever being written.

### Row Level Security posture

Row Level Security is enabled on both `remember_sessions` and `remember_responses`. No policies are defined for either table in this migration. With RLS enabled and zero policies, the `anon` and `authenticated` Postgres roles are denied all access by default. The service-role client is the only intended access path for Version 1, and only after the application has established ownership through `auth.getUser()` server-side — mirroring the existing pattern in `app/record/page.tsx` rather than the unbound pattern in the `declarations` API routes. No policy permitting a participant to read or write another participant's records has been created, and none should be added without a deliberate decision to allow direct client-side access.

### Timestamp behaviour

No reusable `updated_at` trigger function exists elsewhere in this repository. None is introduced by this migration. `updated_at` must be set explicitly by application code on every write, consistent with the existing `declarations` PATCH route.

## Pending documentation

- Full `declarations` schema
- Declaration-writing table or fields
- Agreement-related tables
- Email scheduling fields
- Row-level security policies for `returns`, `declarations`, `pathway_two_agreements`, and other existing tables
- Record ownership rules for tables that predate this migration
- Future Library indexing strategy
