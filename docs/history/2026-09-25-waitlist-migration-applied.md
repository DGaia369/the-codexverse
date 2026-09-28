# Waitlist Migration Applied and Verified (Launch Sprint 2, Migration Gate 1)

**Status:** Historical record. Migration 1 **Applied and Verified Live** in Supabase. Waitlist Founder browser proof **PASSED** (local dev server against live Supabase). Not committed. Not deployed. Public sales remain **CLOSED**.
**Date:** September 25, 2026
**Authority:** Diana Francis
**Feature branch:** `feature/pathway-two-remember`

## Migration

`supabase/migrations/20260925120000_create_waitlist_interests.sql` (SHA-256 `7d7c69fdafc69892604cff1abbf0457b5f3cef78c7699eff46978f1beaa78c06`, unchanged since it was surfaced for Founder review). The Founder applied it manually through the Supabase Dashboard SQL Editor, per the open item 18 convention. It creates `public.waitlist_interests` only and modifies no existing table.

## Founder verification (Supabase SQL Editor)

| Check | Result |
|---|---|
| columns | 7 |
| constraints | 4 |
| RLS enabled | true |
| policies | 0 |
| initial rows | 0 |

## Founder browser proof: PASSED

Run on the local dev server (`http://localhost:3919`, Webpack), which writes to live Supabase.

- `/pathways#remember` rendered "US$97 Founding Access", "Opening Soon", and LET ME KNOW WHEN IT OPENS.
- The approved waitlist copy rendered correctly.
- A valid email submission succeeded, and the approved confirmation rendered: "You’re on the list." / "When this passage opens, I’ll let you know."
- **Duplicate:** the same email was submitted again. The same confirmation was returned, prior membership was not disclosed, and no duplicate row was created.
- **Accessibility and repeated submit:** keyboard interaction passed, and repeat-click / rapid double-click behavior passed.
- **Final row count:** exactly 1.
- **Side effects** (Founder query by the submitted email): `auth_users = 0`, `entitlements = 0`, `remember_sessions = 0`.

**Founder ruling: MIGRATION 1 + WAITLIST LIVE-BROWSER PROOF: PASSED.**

## Independent read-only corroboration (builder, 2026-09-25)

The builder ran a read-only service-role query and printed no email. `waitlist_interests` returned 1 row: `interest = pathway-two-remember`, `source = public_pathways_remember_card`, `status = active`. `acquisitions` did not exist (PostgREST `PGRST205`), and there were 0 `verified_acquisition` entitlements.

## Consequence

The Migration 2 hold is **released for Founder review only**. `supabase/migrations/20260925120100_create_acquisitions.sql` remains **unapplied**. Stripe remains unconfigured.

## Related

- `docs/history/2026-09-25-launch-sprint-2-waitlist-and-founding-access.md`
- `docs/history/open-items.md`, items 18 and 22
- `docs/architecture/database.md`, "Launch Sprint 2"
