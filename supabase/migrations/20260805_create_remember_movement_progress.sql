-- Migration: create remember_movement_progress (Pathway Two™: ReMEMBER™)
--
-- Status: Approved architecture. NOT yet applied to Supabase. NOT yet verified.
-- Authority: Diana Francis
-- Created: 2026-08-05
--
-- Purpose: explicit, queryable completion evidence for a single movement
-- within a remember_sessions row, distinct from pathway-level completion.
-- remember_sessions.status = 'completed' / completed_at remain reserved for
-- completion of the full Pathway Two™: ReMEMBER™ pathway (Movements One
-- through Six). remember_sessions.current_screen_key remains a
-- navigation/resume checkpoint only and is not completion evidence.
--
-- Scope: database structure only. No participant-facing copy is introduced
-- by this migration.

create table remember_movement_progress (
  id uuid primary key default gen_random_uuid(),
  remember_session_id uuid not null references remember_sessions(id) on delete cascade,
  movement_key text not null,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint remember_movement_progress_status_check
    check (status in ('active', 'completed')),
  constraint remember_movement_progress_unique_movement
    unique (remember_session_id, movement_key)
);

-- No separate single-column index on remember_session_id is created here:
-- the unique constraint above already creates a composite index on
-- (remember_session_id, movement_key), and Postgres can use its leftmost
-- column (remember_session_id) for "all movements in this session" lookups
-- without a redundant second index.

alter table remember_movement_progress enable row level security;

-- No policies are created here, matching remember_sessions and
-- remember_responses. With RLS enabled and zero policies, both the anon and
-- authenticated Postgres roles are denied all access by default. The
-- service-role client, gated by an application-level ownership check via
-- auth.getUser(), is the only intended access path in Version 1.

-- No reusable updated_at trigger function exists elsewhere in this
-- repository. None is introduced by this migration. Application code is
-- responsible for setting updated_at explicitly on every write, matching
-- remember_sessions and remember_responses.
