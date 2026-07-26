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

## Pending documentation

- Full `declarations` schema
- Declaration-writing table or fields
- Agreement-related tables
- Email scheduling fields
- Row-level security policies
- Record ownership rules
- Future Library indexing strategy
