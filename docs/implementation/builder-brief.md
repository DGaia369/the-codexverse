# Builder Brief
## Architecture-to-Implementation Bridge
### the codeXverse™

---

## Document Status

**Status:** Founder Approved  
**Authority:** Diana Francis  
**Document class:** Working implementation instrument  
**Repository location:** `docs/implementation/builder-brief.md`

The Builder Brief is not a constitutional layer. It carries no authority over Governance, Source, Canon, Standards, Architecture, Design Specifications, Excavations, History, or Code.

**Governance note:** The Design Specifications layer has been approved in principle by Diana Francis but has not yet been formally added to `docs/GOVERNANCE.md` because the existing repository-hierarchy conflict must first be reconciled. Its use in this Builder Brief reflects the approved direction, not a claim that the Governance file has already been amended.

---

## Purpose

The Builder Brief preserves the verified current state of the codeXverse™ build and provides the working bridge between architectural direction and technical implementation.

It exists so that:

- Diana remains the founder and final decision authority.
- Zaia can preserve and review architectural intent, participant experience, governance, and scope.
- Claude Code can inspect and modify the live repository and database using verified technical facts.
- No contributor is required to hold the entire project in memory.
- The project can remember what was approved, what was implemented, what remains unresolved, and why decisions were made.

The Builder Brief does not replace Canon, Architecture, Design Specifications, Standards, History, or implementation documentation. It connects them during active development.

---

## Operating Roles

### Diana Francis

Founder and final decision authority.

Diana approves:

- canon
- architectural rulings
- participant-facing copy
- design specifications
- schema direction
- implementation scope
- production deployment

### Zaia

Architectural and governance collaborator.

Zaia may:

- preserve experiential and architectural context
- review alignment with Canon and approved Design Specifications
- identify drift, contradiction, and unresolved decisions
- prepare architectural and governance proposals
- review Claude Code’s verified technical reports

Zaia may not:

- create or alter Canon
- issue founder rulings
- claim verification of live repository or database facts without direct access
- authorize implementation or deployment
- supersede Governance or Diana Francis

### Claude Code

Implementation executor with access to the live repository and development environment.

Claude Code:

- inspects actual files
- verifies repository state
- inspects available schema and migrations
- identifies call sites and dependencies
- proposes technical changes
- implements only approved work
- runs local verification
- reports what changed and what remains unverified

Claude Code does not independently redefine canon, participant experience, architecture, or approved scope.

---

## Governing Workflow

1. Diana and Zaia define or approve the architectural and design direction.
2. A bounded implementation directive is given to Claude Code.
3. Claude Code inspects the actual repository and technical environment.
4. Claude Code returns a verified implementation report or reconciliation report before changing anything when conflicts exist.
5. Diana and Zaia review the report for architectural alignment.
6. Diana issues the final ruling.
7. Claude Code implements the approved change.
8. Claude Code updates this Builder Brief with the verified result.
9. Significant decisions are also recorded in the appropriate governed documents and History.

The Builder Brief is a bridge, not a substitute for permanent documentation.

---

## Current Build State

**Project:** the codeXverse™  
**Pathway:** Pathway Two™: ReMEMBER™  
**Current branch:** `feature/pathway-two-remember`  
**Current environment:** Local development environment connected to the live Supabase project  
**Current implementation slice:** Entry Threshold (locked), Movement One (architecture Founder-locked v2.1; specific participant-facing copy REOPENED 2026-09-05, working copy pending another walkthrough), and Movement Two (IMPLEMENTATION PASSED / FOUNDER-LOCKED / CLOSED 2026-09-10, see `pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md` and `docs/history/2026-09-10-movement-two-closed.md`)  
**Deployment status:** No deployment authorized  
**Last verified date:** 2026-09-10 (local typecheck, lint, and production build only; no live Supabase or participant-flow verification performed beyond the bounded Founder test-state resets already recorded below)  

---

## Current Architectural Ruling

`remember_sessions` represents one participant’s entire Pathway Two™: ReMEMBER™ journey.

It does not represent a separate session for each movement.

Therefore:

- pathway completion remains distinct from movement completion
- `remember_sessions.status = 'completed'` is reserved for completion of the full pathway
- Movement One requires its own explicit, queryable completion state
- `current_screen_key` is a resume checkpoint, not permanent completion evidence

Shared technical infrastructure should remain generic, while movement-specific orchestration and completion functions may be additive.

---

## Current Technical Reconciliation

### Verified

- `remember_sessions` and `remember_responses` exist in the live Supabase project.
- The verified response constraint is `(remember_session_id, movement_key, prompt_key)`.
- The matching `onConflict` target is `remember_session_id,movement_key,prompt_key`.
- A participant with no `returns` row must be redirected to `/begin`, not `/return`.
- `utils/remember.ts` currently has no call sites.
- Service-role reads and writes must be bound to the authenticated user.
- Entry Threshold requires resume checkpoints for all five screens.

### Approved, not yet implemented

A normalized `remember_movement_progress` table with one row per movement per pathway session, including:

- `id`
- `remember_session_id`
- `movement_key`
- `status`
- `started_at`
- `completed_at`
- `created_at`
- `updated_at`

Movement One completion must update the movement-progress row while leaving the pathway-level session active.

---

## Active Blockers

- The full approved reconciliation change set has not yet been applied.
- `remember_movement_progress` has not yet been created in Supabase.
- `utils/remember.ts` remains uncommitted.
- No production file or schema change is authorized until the proposed diff is approved.
- The inconsistent Pathway One™ `/record` redirect to `/return` must be tracked as a separate open item outside the current ReMEMBER™ implementation slice.

---

## Approved Documents

- Pathway Two™: ReMEMBER™ Design Specification v1.0
- ReMEMBER™ Session Model Reconciliation Directive
- Claude Code Reconciliation Report dated 2026-08-02
- Movement One locked participant-facing copy
- Builder Brief approval and Zaia role ruling

---

## Files Currently Under Review

- `utils/remember.ts`
- `supabase/migrations/20260802_create_remember_movement_progress.sql`
- `docs/architecture/database.md`
- ReMEMBER™ API route, page, and client component files once created
- Pathway One™ eligibility and redirect logic as a separate future open item

---

## Pending Founder Rulings

**2026-09-01 — Pathway Two™: ReMEMBER™ participant entry remains intentionally unwired.**

Ruling: The absence of a participant-facing link from `/record` or the public website into `/remember` is not an implementation defect. Pathway Two™: ReMEMBER™ is a paid Pathway. Participant entry must remain pending the reusable commerce/access architecture, so that access is governed consistently for Pathway Two™: ReMEMBER™ and future paid Pathways.

Do not wire `/record` directly to `/remember`.

Do not wire the public website directly to `/remember`.

Do not implement commerce as part of resolving this ruling.

Do not redesign routing as part of resolving this ruling.

This is a continuity/governance record only.

**2026-09-14 status note:** the "reusable commerce/access architecture" this ruling anticipates now has its Phase 3 + Phase 3A database foundation live (`products`, `entitlements` — see the Commerce + Access Phase 3 + 3A Report below). Authorization composition (`authorizeRememberAccess` or equivalent) and route wiring have not been implemented. This ruling remains unresolved: do not wire `/record` or the public website to `/remember` yet.

**Session-start requirement:** Claude Code must verify and refresh this section at the beginning of every implementation session before proceeding. A prior statement of a ruling, or of “None,” must never be carried forward without checking the current reconciliation reports, open-items register, latest History entries, and most recent founder rulings.

**2026-09-10 — Library of Yourself™ Pathway Two™ continuity: next bounded architecture item, not yet implemented.**

Recorded per Diana's Movement Two Close & Preserve Directive of the same date. Question awaiting a Founder architecture ruling:

> How should the Library of Yourself™ acknowledge and preserve participant-owned evidence from Pathway Two™: ReMEMBER™ without prematurely defining the Second Inheritance™?

The Library of Yourself™ currently presents only Pathway One™ (Return to Self™, Pathway One evidence, First Inheritance™, Between Thresholds). Pathway Two™ returns the participant to this Library after Movement Two completion, but there is no Pathway Two continuity presence there yet. This is explicitly not a Movement Two defect. Until Diana rules on it: do not add a Pathway Two card, do not create an artifact or Recognition Record™, do not define what evidence belongs there, do not infer a Second Inheritance™, and do not redesign `/record`. See `docs/history/2026-09-10-movement-two-closed.md` for the full closure context this item was recorded alongside.

---

## Latest Verified Implementation Report

**Date:** 2026-08-02  
**Branch:** `feature/pathway-two-remember`  
**Inspection completed:** Live Supabase schema, committed migration, relevant routes, helper comments, and repository call sites  
**Verified findings:** Recorded in the ReMEMBER™ reconciliation report  
**Files changed:** None during inspection  
**Tests performed:** Read-only inspection only  
**Deployment status:** Not deployed  
**Unresolved implementation work:** Apply the approved reconciliation change set only after final diff approval

---

## Movement Two Implementation Report

**Date:** 2026-09-05  
**Branch:** `feature/pathway-two-remember`  
**Directive:** Diana's Movement Two ("Separate the Self from the Role") implementation directive of the same date.  
**Files changed:**
- `utils/remember.ts` — added Movement Two identifiers, prompts, and screen keys; generalized `saveMovementOneResponse` into `saveMovementResponse` (movement-key resolved from the session's own `current_movement_key`, never client-supplied); factored `tryCompleteMovementOne` into a shared `tryCompleteMovement` helper plus a new `tryCompleteMovementTwo`; added `getMovementKeyForScreen` and a movement-transition step inside `advanceRememberScreen`.
- `app/remember/RememberExperience.tsx` — parameterized the Mirror, Lens, Closing, and Transition step kinds to carry their own copy (Movement One's rendered output is unchanged); added a new Exit step kind; appended the fourteen Movement Two screens.
- `app/api/remember/response/route.ts` — updated the one call site for the `saveMovementResponse` rename; updated one stale comment.
- `docs/design-specifications/pathway-two-remember-movement-two-v0.1.md` — created. Records Founder-locked architecture, approved working copy, and open Founder-ruling-pending items separately.
- `docs/design-specifications/pathway-two-remember-v1.0.md` — added an amendment-history entry and status-table updates pointing to the new Movement Two document, mirroring how Movement One v2.1 was recorded.
- `docs/architecture/database.md` — documented that Movement Two required no migration (reuses `remember_sessions`, `remember_responses`, `remember_movement_progress` exactly as they exist).

**Schema changes:** None. No new migration file was created or applied.

**Verified this session:** `npx tsc --noEmit` (clean), `npm run lint` (12 pre-existing errors and 4 warnings, all in files this work did not touch — `app/foundation/page.tsx`, `app/next-step/page.tsx`, `app/pathway/page.tsx`, `app/pathway/return-to-self/page.tsx`, `app/return/page.tsx`, `utils/flow.ts`, `components/threshold/*`; none in `utils/remember.ts`, `app/remember/**`, or `app/api/remember/**`), `npm run build` (succeeded, `/remember` and both `/api/remember/*` routes compiled and listed in the route manifest).

**Not verified this session:** the actual participant flow in a running dev server or browser; live Supabase read/write behavior; whether an existing in-progress `remember_sessions` row (created before this change) resumes correctly into Movement Two.

**Deployment status:** Not deployed. Not staged. Not committed. Not pushed, per explicit instruction.

**Founder decisions still open (see the new design specification's sections 3–7, 15 for full detail):**
- Whether the witness screens should echo the two prior writing-moment responses (implementation choice, not directive-specified).
- The final Bedrock question for Movement Two (two working candidates recorded).
- The final Closing line ("I am still here when the role is not." implemented; "I can still be me without having to be that for everyone." is the other live candidate).
- Whether the Differentiation Recognition Mirror™ screen should carry a heading line (none was given; none was invented).

---

## Movement One and Movement Two Copy Correction Report

**Date:** 2026-09-05  
**Branch:** `feature/pathway-two-remember`  
**Directive:** Diana's governed Founder walkthrough correction pass of the same date, reopening specific previously locked/working Movement One and Movement Two copy for feeling mechanical, constructed, and leading, and issuing the no-forced-answer ruling.  
**Files changed:**
- `utils/remember.ts` — `tryCompleteMovement` no longer queries `remember_responses` or requires non-blank response text; completion now depends only on required viewed checkpoints plus reaching the movement's completion-trigger screen. `tryCompleteMovementOne` and `tryCompleteMovementTwo` updated to match (dropped their `requiredPrompts` argument).
- `app/remember/RememberExperience.tsx` — replaced the affected Movement One writing-moment questions, removed two helper lines, hid role-language cues behind an explicit "need help finding words?" request (tracked per screen key, no effect-based reset needed), removed the forced-answer validation message, made `WitnessStep.closingLine` and `LensStep.body` optional to support a witness with no added line and an unstacked single-line Lens, replaced the Recognition Mirror™ heading/labels/closing line, replaced the Bedrock and Recognition Lens copy, simplified the Closing to one line, replaced the Movement One → Movement Two transition line, and replaced the Movement Two opening question. Updated the top-of-file provenance comment to reflect the reopened status.
- `app/api/remember/response/route.ts` — not touched this pass (checked; no reference to the removed validation logic).
- `docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md` — created. Full old-to-new copy mapping, the no-forced-answer ruling, and completion-logic effects.
- `docs/design-specifications/pathway-two-remember-movement-one-v2.1.md` — added a Copy Reopened Notice; original locked section 4 table preserved unedited as provenance.
- `docs/design-specifications/pathway-two-remember-movement-two-v0.1.md` — added a Correction Notice; updated the `m2_wm1` table row and section 12's completion condition, both additively.
- `docs/history/2026-09-05-movement-one-two-copy-reopened.md` — created.

**Schema changes:** None.

**Verified this session:** `npx tsc --noEmit` (clean), `npm run lint` (no errors in any touched file; pre-existing unrelated errors elsewhere unchanged), `npm run build` (succeeded, all routes including `/remember` compiled).

**Not verified this session:** the actual participant flow in a running dev server or browser.

**Deployment status:** Not deployed. Not staged. Not committed. Not pushed. No Supabase data reset, altered, or cleaned.

**Founder decisions still open:**
- Whether this working copy (all of it) is ready to lock, or needs another pass.
- The `m1_belonging` / pre-mirror screen's participant-facing subcopy noting no answer is required was not added to the UI (per existing pattern, this kind of note lives in governing documents, not on-screen); confirm this is the intended treatment.
- Everything already listed as open in the Movement Two Implementation Report above remains open.

---

## Movement Two Final Founder Correction Report

**Date:** 2026-09-09  
**Branch:** `feature/pathway-two-remember`  
**Directive:** Diana's Movement Two Final Founder Correction Package of the same date — Founder-locked participant architecture for Movement Two.  
**Files changed:**
- `app/remember/RememberExperience.tsx` — replaced all six Movement Two writing-moment questions; witness screens now return the exact question paired with the exact response (new `items` mode on `WitnessStep`, additive; Movement One's `sourceKeys` mode untouched); Movement Two Mirror now includes all six questions (previously five), gained an exact heading and exact closing line, and dropped its interpretive category labels; Bedrock became a new `bedrockPrompt` step kind — a saved response followed by an in-place witness return of that exact question and response, before advancing to the Lens (no new screen key); Recognition Lens now shows only its one locked line; Closing reworded to its two locked lines. Removed all stale prior-version Movement Two copy.
- `utils/remember.ts` — updated `MOVEMENT_TWO_PROMPT_COPY` to the Founder-locked wording; updated governing-document comments. No change to `MOVEMENT_TWO_PROMPTS`, `MOVEMENT_TWO_SCREEN_KEYS`, `MOVEMENT_TWO_REQUIRED_VIEWED_CHECKPOINTS`, or completion logic — none were authorized or needed.
- `docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md` — created; the new governing Movement Two document.
- `docs/design-specifications/pathway-two-remember-movement-two-v0.1.md` — marked SUPERSEDED (notice added, body preserved as provenance).
- `docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md` — added a forward pointer for its Movement Two content; its Movement One content and no-forced-answer ruling remain current.
- `docs/design-specifications/pathway-two-remember-v1.0.md` — status table and Movement Two governing-doc pointer updated to the new locked document; amendment-history entry added.

**Response keys:** preserved unchanged (`room_identity`, `genuinely_mine`, `role_requirement`, `harder_to_bring`, `mine_without_expectation`, `uncertain_without_role`, `bedrock_response`). Historical participant data already existed under these exact keys; renaming was explicitly not required and was not made a blocker. The locked-question-to-key mapping is recorded in both the new design spec and in code comments.

**Schema changes:** None.

**m2_to_m3 inspection:** bare "Return to the codeXverse" link, no participant-facing text of any kind. No interpretation, no preview of suppressed material, no commitment/agreement/boundary language. No correction needed or made.

**Verified this session:** `npx tsc --noEmit` (clean), `npm run lint` (zero issues in touched files; repository-wide: same 12 pre-existing errors + 4 warnings as before this session, all in files this work did not touch), `npm run build` (succeeded, all routes including `/remember` compiled).

**Deployment status:** Not deployed. Not staged. Not committed. Not pushed.

**Founder test-state reset:** Performed after validation succeeded, same bounded scope and safety pattern as the prior Movement Two-only reset. Diana's single active session (`78403f91-408d-4068-b460-27f678cbc2de`) had progressed to `m2_wm2` with one Movement Two response saved (`room_identity`, under the now-superseded wording) since the previous reset. Reset: `current_screen_key` → `m2_wm1`; deleted the 1 Movement Two response row; removed `m2_wm1` from `viewed_checkpoints` (the only Movement Two key present). Movement Two's `remember_movement_progress` row was already `active`/not completed — no mutation made. Movement One responses (7 rows), Movement One progress (`completed`), and all Entry/Movement-One checkpoints (21 keys) verified intact and untouched. Exactly one active session existed in the table both before and after, confirming no other participant was touched.

---

## Movement Two Bedrock Final Correction Report

**Date:** 2026-09-10  
**Branch:** `feature/pathway-two-remember`  
**Directive:** Diana's Movement Two Bedrock Final Correction of the same date — the Bedrock question failed the Founder Resonance Test by requiring cognitive sorting/comparison; replaced with "What do you know now?"  
**Files changed:**
- `app/remember/RememberExperience.tsx` — `m2_bedrock`'s question changed to "What do you know now?" No other Movement Two step touched; the existing write-then-witness Bedrock mechanism (unchanged since 2026-09-09) already satisfies the required Bedrock witness behavior with the new question.
- `utils/remember.ts` — `MOVEMENT_TWO_PROMPT_COPY.bedrock_response` and the response-key mapping comment updated to match; governing-document comment updated.
- `docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md` — amended (not replaced): new "Bedrock Amendment — September 10, 2026" section added; section 1's Internal Bedrock and section 7's Bedrock updated in place, with all superseded wording preserved inline as provenance.
- `docs/excavations/pathway-two-naming-evolution.md` — added a "SECOND INHERITANCE™ SIGNAL — UNDEFINED / NOT FOUNDER-LOCKED" note recording only that an unresolved Founder signal exists (self-witnessing, capacity, internal authority, ownership of recognition, interpretive sovereignty, awareness, freedom), per explicit instruction not to define, implement, or create new architecture from it.

**Verified this session:** `npx tsc --noEmit` (clean), `npm run lint` (zero issues in touched files; repository-wide: same 12 pre-existing errors + 4 warnings as before, unchanged), `npm run build` (succeeded).

**Confirmed unchanged:** all six writing questions, all three witnesses, the Differentiation Recognition Mirror™, the Recognition Lens, and the Closing — verified by direct re-read of the Movement Two section after the edit.

**Schema changes:** None.

**Founder test-state reset:** Diana's session had completed the full Movement Two flow through `m2_to_m3` under the old Bedrock question (`bedrock_response` present, 77 chars; Movement Two progress `completed`). Reset: `current_screen_key` → `m2_bedrock`; deleted the 1 `bedrock_response` row; removed `m2_bedrock`, `m2_lens`, `m2_closing` from `viewed_checkpoints` (everything at/after the reopened slice — `m2_mirror` and everything earlier preserved). `remember_movement_progress` for Movement Two was deliberately left as `completed` (stale) rather than force-reset to `active`: nothing in the codebase reads that status to gate navigation, and it self-corrects the moment the participant reaches `m2_to_m3` again. All six Movement Two writing responses, all Movement One data, and all other participants (exactly one session existed in the table, before and after) confirmed untouched.

---

## Movement Two Close & Preserve Report

**Date:** 2026-09-10  
**Branch:** `feature/pathway-two-remember`  
**Directive:** Diana's Movement Two Close & Preserve Directive of the same date — Founder Close ruling (IMPLEMENTATION PASSED / FOUNDER-LOCKED / CLOSED), documentation-only closure, and authorized staging/commit.  
**Files changed (documentation only, no code):**
- `docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md` — status header updated to the closure status; new "Founder Close — September 10, 2026" section added recording the four Close Gate tests and the reopen-only-for-defect rule.
- `docs/design-specifications/pathway-two-remember-v1.0.md` — status table row and amendment history updated to reflect closure.
- `docs/history/2026-09-10-movement-two-closed.md` — created: the full closure record, including the Founder Close Gate tests, the reaffirmed governing laws, confirmation that the Second Inheritance™ excavation signal and Movement Three remain untouched, and the Library of Yourself™ continuity question.
- `docs/implementation/builder-brief.md` — build-state header, Pending Founder Rulings (Library continuity item), and this report.

**Verified before staging:** `npx tsc --noEmit` (clean), `npm run lint` (zero issues in any touched file — this pass touched no code, only documentation; repository-wide: the same 12 pre-existing errors + 4 warnings present before this pass, unchanged), `npm run build` (succeeded, all routes including `/remember` compiled).

**Movement Two participant-facing copy:** unchanged. This pass made zero edits to `app/remember/RememberExperience.tsx` or `utils/remember.ts` — confirmed by the edit list above containing only documentation files.

**Second Inheritance™:** left exactly as recorded in the prior session (`docs/excavations/pathway-two-naming-evolution.md`); not touched, not promoted, not equated with Witness Moments.

**Movement Three:** not opened; no participant copy, screens, database fields, migrations, or routes created for it.

**Library of Yourself™ continuity question:** recorded only, per the directive, in `docs/history/2026-09-10-movement-two-closed.md` and this Builder Brief's Pending Founder Rulings section — not implemented. No Pathway Two card, artifact, Recognition Record™, or `/record` change was made.

---

## Commerce + Access Phase 3 + 3A Report

**Date:** 2026-09-13 (Phase 3), 2026-09-14 (Phase 3A)
**Branch:** `feature/pathway-two-remember`
**Directive:** Diana's Commerce + Access Phase 2 entitlement design corrections, Phase 3 migration draft/safety pass/application, and Phase 3A integrity follow-up.
**Files changed:**
- `supabase/migrations/20260913_create_products_and_entitlements.sql` — created and applied. Establishes `products` (minimal product identity registry) and `entitlements` (participant access grants, independent of Pathway eligibility). Seeds exactly one product: `pathway-two-remember` / `Pathway Two™: ReMEMBER™` / `active`. No offer, price, or Founding Access data in either table.
- `supabase/migrations/20260914040441_add_entitlement_integrity_constraints.sql` — created and applied. Adds `entitlements_expires_at_after_starts_at_check`; replaces `entitlements_revoked_at_matches_status_check` with the stronger `entitlements_revocation_integrity_check` in one atomic `ALTER TABLE` statement. Deliberately does not add an admin-grant provenance database constraint (Founder ruling — see file header and `docs/history/2026-09-14-commerce-access-entitlement-integrity-applied.md`).
- `docs/architecture/database.md` — new "Commerce + Access: `products` and `entitlements`" section, including the Phase 3A subsection.
- `docs/history/2026-09-13-commerce-access-entitlement-schema-applied.md`, `docs/history/2026-09-14-commerce-access-entitlement-integrity-applied.md` — created.
- `docs/history/open-items.md` — item 17 (schema status and approved next implementation sequence), item 18 (Supabase migration-workflow normalization, deferred).

**Schema changes:** Both migrations applied manually through the Supabase Dashboard SQL Editor and independently verified against live PostgreSQL system catalogs, per the established repository convention (no Supabase CLI project link exists).

**Verified this session:** Live catalog verification for both migrations (constraint presence and definitions, FK behavior, RLS enablement and zero-policy posture, index non-uniqueness, seed content, zero-row `entitlements`). A high-effort manual code review of commit `0974d5263cc2704971c6f4b9ab0634b68175ea05` was also performed before push, which identified the two gaps Phase 3A closes plus several non-blocking observations (see that review for the full list, including already-Founder-ruled FK tradeoffs and a future index-ordering consideration).

**Not implemented:** `utils/entitlements.ts` (still a 0-byte stub), any Founder/Admin grant path, `hasEffectiveEntitlement()`, authorization composition, and all route wiring. No checkout or payment-provider logic.

**Next implementation phase:** Commerce + Access Phase 4 — Entitlement Service + Founder/Admin Grant Proof, starting with `utils/entitlements.ts`. Proof condition: a Founder/Admin grant produces a live entitlement row, and `hasEffectiveEntitlement()` returns true for it, before any commerce or Pathway authorization work is connected.

**Outstanding blocker, unaffected by this work:** the proxy.ts/session-refresh gap (`docs/history/open-items.md`, item 16) remains OPEN and is a prerequisite before protected Commerce + Access entry is considered production-ready.

**Deployment status:** Both migrations applied to the live Supabase project. Repository changes committed locally (`0974d5263cc2704971c6f4b9ab0634b68175ea05`, plus the Phase 3A commit). No application code, route, or participant-facing behavior was added or changed.

---

## Repository Memory Principle

The repository is where constitutional memory lives.

The repository remembers so the codeXverse™ never has to begin again.

The Builder Brief does not replace that memory. It carries the verified current build state between architectural review and technical implementation so active work remains aligned with Governance, Canon, Standards, Architecture, Excavations, History, and approved Design Specifications.

Anything that becomes enduring truth, approved architecture, governing standard, constitutional history, or permanent implementation record must be returned to its proper repository layer before the session is considered complete.

---

*the codeXverse™ | Builder Brief | Active Development Record*
