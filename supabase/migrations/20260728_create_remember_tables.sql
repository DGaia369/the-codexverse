-- Migration: create ReMEMBER™ (Pathway Two™) session and response tables
--
-- Status: Approved architecture. NOT yet applied to Supabase. NOT yet verified.
-- Authority: Diana Francis
-- Created: 2026-07-28
--
-- This is the first migration file in supabase/migrations. No repository-tracked
-- migration workflow existed before this file — prior schema changes were made
-- directly against Supabase and are not otherwise version-controlled here.
--
-- Scope: database structure only. No API routes, no participant-facing pages,
-- and no participant-facing copy are introduced by this migration.
--
-- Ownership model:
--   user_id is the authoritative owner of a remember_sessions row.
--   email is stored as a normalized snapshot only, not as an ownership key.
--   pathway_one_session_id records the Pathway One™ returns.session_id that
--   qualified the participant for entry (evidence, not a live foreign key,
--   since returns.session_id is not guaranteed unique/typed as uuid today).
--   No ReMEMBER™ API may trust a client-supplied session_id without verifying
--   ownership through auth.getUser() first. This migration only establishes
--   structure; it does not implement or authorize that check.

-- ---------------------------------------------------------------------------
-- remember_sessions
-- ---------------------------------------------------------------------------

create table if not exists remember_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  pathway_one_session_id text not null,
  status text not null default 'active',
  current_movement_key text not null default 'see_the_scattering',
  current_screen_key text not null default 'entry_01',
  started_at timestamptz not null default now(),
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint remember_sessions_status_check
    check (status in ('active', 'completed'))
);

-- Only one active ReMEMBER™ session may exist per participant at a time.
-- This is a partial unique index (not a table-wide unique constraint) so that
-- multiple completed sessions remain possible in the future, leaving the
-- constitutional question of multiple Recognition Records™ per pathway open
-- rather than foreclosing it at the schema level.
create unique index if not exists remember_sessions_one_active_per_user
  on remember_sessions (user_id)
  where status = 'active';

-- General ownership lookup support. The partial index above only covers
-- active rows; this index supports lookups across all statuses (e.g. a
-- participant's full ReMEMBER™ session history).
create index if not exists remember_sessions_user_id_idx
  on remember_sessions (user_id);

alter table remember_sessions enable row level security;

-- No policies are created here. With RLS enabled and zero policies, both the
-- anon and authenticated Postgres roles are denied all access by default.
-- The service-role client bypasses RLS entirely and is the only client
-- expected to read or write these tables in Version 1, and only after the
-- application has verified ownership via auth.getUser() server-side.
-- Do not add anon/authenticated policies in a later migration without an
-- explicit decision to allow direct client access.

-- ---------------------------------------------------------------------------
-- remember_responses
-- ---------------------------------------------------------------------------

create table if not exists remember_responses (
  id uuid primary key default gen_random_uuid(),
  remember_session_id uuid not null references remember_sessions(id) on delete cascade,
  movement_key text not null,
  prompt_key text not null,
  prompt_order smallint not null,
  response_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint remember_responses_unique_prompt
    unique (remember_session_id, movement_key, prompt_key),
  constraint remember_responses_prompt_order_positive_check
    check (prompt_order > 0)
);

-- Supports retrieval of every response belonging to a session.
create index if not exists remember_responses_session_idx
  on remember_responses (remember_session_id);

-- Supports ordered retrieval of a session's responses within a movement,
-- in prompt sequence.
create index if not exists remember_responses_session_movement_order_idx
  on remember_responses (remember_session_id, movement_key, prompt_order);

alter table remember_responses enable row level security;

-- No policies are created here, for the same reason as remember_sessions:
-- RLS enabled with zero policies denies all anon/authenticated access.
-- The service-role client, gated by an application-level ownership check,
-- is the only intended access path in Version 1.

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
-- No reusable updated_at trigger function exists elsewhere in this repository
-- (none was found in the codebase). No trigger is introduced by this
-- migration. The future API implementation is responsible for setting
-- updated_at explicitly on every write, matching the pattern already used in
-- declarations (see app/api/declaration-writing/route.ts).
