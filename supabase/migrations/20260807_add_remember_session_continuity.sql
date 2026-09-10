-- Migration: add Movement One v2.1 session continuity fields to remember_sessions
--
-- Status: Approved architecture (Founder ruling, 2026-08-07). NOT yet applied
-- to Supabase. NOT yet verified.
-- Authority: Diana Francis
-- Created: 2026-08-07
--
-- Purpose: additive persistence for Founder-locked Movement One v2.1
-- (docs/design-specifications/pathway-two-remember-movement-one-v2.1.md):
-- sticky content-version identity, sticky randomized variant and role-cue
-- assignment, and durable viewed-checkpoint evidence (Recognition Mirror,
-- Bedrock, Recognition Lens) independent of the single-value
-- current_screen_key resume checkpoint.
--
-- Scope: additive only. No column is dropped, renamed, or altered. No
-- existing constraint is changed. Existing rows are not backfilled;
-- content_version remains null for prototype sessions created before this
-- migration, by explicit Founder instruction. Application code must not
-- silently relabel them as movement_one_v2.1.

alter table remember_sessions
  add column if not exists content_version text null;

alter table remember_sessions
  add column if not exists variant_assignments jsonb not null default '{}'::jsonb;

alter table remember_sessions
  add column if not exists viewed_checkpoints text[] not null default '{}'::text[];
