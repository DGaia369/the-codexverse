# Pathway Two™: ReMEMBER™
## Movement Two: Separate the Self from the Role
### Participant Architecture v0.1 | Local Founder Build

## SUPERSEDED — September 9, 2026

This document is superseded in full by `docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md`, which records the Founder-locked Movement Two participant architecture from Diana's Movement Two Final Founder Correction Package. Do not treat any participant-facing copy below as current. This document is preserved unedited beneath this notice as historical provenance only.

---

**Status:** Local implementation for Founder walkthrough. Partially Founder-locked, partially Working Copy, partially Founder-ruling pending. See status markers on each part below.
**Governing foundation:** `docs/architecture/pathway-two-build-plan.md`, `docs/design-specifications/pathway-two-remember-v1.0.md` (Part Four, superseded by this document per the amendment recorded there), `docs/design-specifications/pathway-two-remember-movement-one-v2.1.md`
**Authority:** Diana Francis
**Created:** September 5, 2026
**Purpose of this document:** Record the exact architecture implemented locally for Movement Two so Diana can walk through it in context and issue a bounded Founder ruling, following the same pattern used for Movement One v2.1.

Do not treat any section below as canon or as locked participant-facing copy beyond what is explicitly marked **FOUNDER-LOCKED**.

---

## Correction Notice — September 5, 2026

Following the same local walkthrough that reopened Movement One's copy, two changes were made to this document after its initial creation, both recorded in full in `docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md`:

1. The Movement Two opening question (`m2_wm1`) was reworded. See section 3's updated table row below; the originally implemented working copy is preserved in the correction document as provenance.
2. The completion condition in section 12 no longer requires any response, including `bedrock_response`, to contain non-blank text (the "no-forced-answer" Founder ruling). Section 12 below is updated accordingly; the superseded requirement is preserved in the correction document.

No other part of this document changed. The Founder-locked six-writing-moment structure and the Differentiation Recognition Mirror™ mechanism (sections 2 and 4) are untouched.

---

## 1. Status Key

- **FOUNDER-LOCKED** — given verbatim in the Founder's implementation directive of September 5, 2026. Implemented exactly. Not to be altered without a further Founder ruling.
- **APPROVED WORKING COPY** — given verbatim in the same directive as working copy for local testing. Implemented exactly, but explicitly not canon and not final.
- **IMPLEMENTATION CHOICE, FOUNDER-RULING PENDING** — a structural or presentational decision made by Claude Code to render the Founder-supplied content, where the directive did not specify the mechanism. Flagged here so Diana can veto or amend it directly.

---

## 2. Movement Function — FOUNDER-LOCKED

**Movement:** Movement Two — Separate the Self from the Role

**Hidden Mechanism:** Role Fusion Through Conditional Belonging

**Founder-locked structure:** Six writing moments.

**Founder-locked recognition mechanism:** Differentiation Recognition Mirror™

**Founder-approved Recognition Lens:**

> A quality can belong to me without becoming my assignment.

**Participant sovereignty (governing constraint):**

The system must not tell the participant which parts are "really her," diagnose her role, classify her adaptation, or tell her to abandon the role.

Movement Two differentiates:

- what genuinely feels hers
- what became required around it

It does not enter Movement Three recovery work. It does not enter Pathway Three™ vows, boundaries, agreements, or "never again" territory.

No randomized content is required for Movement Two v0.1.

Movement completion remains separate from Pathway Two™: ReMEMBER™ completion.

---

## 3. Exact Participant Sequence — APPROVED WORKING COPY

The prompt and witness copy below is working copy for local Founder testing, not Founder-locked, per the directive. It is implemented exactly as given.

| Screen Key | Function | Participant-facing copy | Persistence |
|---|---|---|---|
| `m2_wm1` | Writing Moment 1 | "When nobody needs anything from you, what feels most like you?" (reworded 2026-09-05; see Correction Notice above) | Save as `room_identity` |
| `m2_wm2` | Writing Moment 2 | "What do you recognize in that version of you that feels genuinely yours?" | Save as `genuinely_mine` |
| `m2_witness_1` | Witness | Return `room_identity` and `genuinely_mine` exactly. Then: "Something can be genuinely yours and still become the part of you a room learns to expect." | Checkpoint |
| `m2_wm3` | Writing Moment 3 | "What does being that person seem to require from you, even when no one says it out loud?" | Save as `role_requirement` |
| `m2_wm4` | Writing Moment 4 | "When you are being that person, what feels harder to bring into the room?" | Save as `harder_to_bring` |
| `m2_witness_2` | Witness | Return `role_requirement` and `harder_to_bring` exactly. Then: "What belongs to you and what became required of you are not the same question." | Checkpoint |
| `m2_wm5` | Writing Moment 5 | "If the expectation disappeared, what, if anything, would still feel like yours?" | Save as `mine_without_expectation` |
| `m2_wm6` | Writing Moment 6 | "If no one expected you to be that person, what feels uncertain, unfamiliar, or hard to name?" | Save as `uncertain_without_role` |
| `m2_witness_3` | Witness | Return `mine_without_expectation` and `uncertain_without_role` exactly. Then: "You are not being asked to stop being this person. You are only noticing what belongs to you and what became attached to it." | Checkpoint |
| `m2_mirror` | Differentiation Recognition Mirror™ | See section 4. | Checkpoint (required for completion) |
| `m2_bedrock` | Bedrock (working candidate) | "If this were no longer expected of you, what, if anything, would still feel like yours?" | Save as `bedrock_response` (required for completion) |
| `m2_lens` | Recognition Lens | "You do not have to make this sentence yours. See whether it fits: A quality can belong to me without becoming my assignment." | Checkpoint (required for completion) |
| `m2_closing` | Closing (working candidate) | "I am still here when the role is not." | Marks `separate_self_from_role` completed on Continue |
| `m2_to_m3` | Exit placeholder | No new copy. Reuses the existing "Return to the codeXverse" exit action. Movement Three is not implemented. | Completion trigger screen |

**IMPLEMENTATION CHOICE, FOUNDER-RULING PENDING:** the witness screens echo the exact two prior writing-moment responses before the witness line, reusing the witness pattern already established and Founder-locked in Movement One v2.1 (`docs/design-specifications/pathway-two-remember-movement-one-v2.1.md`, section 4). The directive gave the witness lines but did not specify whether the prior responses should be echoed. Echoing was chosen for consistency with the existing mechanism and with Recognition Law 1 (recognition through the participant's own words). If Diana wants the witness screens to omit the echoed text, this is a one-line change per screen.

---

## 4. Differentiation Recognition Mirror™ — FOUNDER-LOCKED mechanism, APPROVED WORKING COPY labels

Implemented using the participant's exact saved words. No summary, paraphrase, interpretation, or classification is generated.

| Label shown | Source |
|---|---|
| "What feels genuinely mine" | exact `genuinely_mine` response |
| "What seemed required of me" | exact `role_requirement` response |
| "What felt harder to bring into the room" | exact `harder_to_bring` response |
| "Without the expectation, what still felt like mine" | exact `mine_without_expectation` response |
| "What felt uncertain when the role was no longer required" | exact `uncertain_without_role` response |

Then: "Take a moment. These are all your words."

**IMPLEMENTATION CHOICE, FOUNDER-RULING PENDING:** the directive did not supply a heading line for this screen (Movement One's equivalent Mirror screen has the heading "Read what you have made visible."). No heading was invented; the screen opens directly with the labeled items. If Diana wants a heading, it must be supplied and is a one-line addition.

---

## 5. Bedrock — WORKING / FOUNDER REVIEW

The Movement Two Bedrock Question is not Founder-locked.

Current working candidate, implemented for local testing only:

> "If this were no longer expected of you, what, if anything, would still feel like yours?"

This is not represented as locked or canonical anywhere in participant-facing UI.

**Structural difference from Movement One's Bedrock, by explicit Founder instruction:** Movement One's Bedrock (`m1_bedrock`) has no textbox; it is a viewed-only checkpoint. Movement Two's Bedrock (`m2_bedrock`) does have a textbox, and the response is saved as `bedrock_response`, because the Founder's completion condition for Movement Two explicitly requires "Bedrock response saved," not merely viewed. This distinction is intentional and directive-sourced, not an inconsistency.

---

## 6. Recognition Lens — FOUNDER-LOCKED

> "You do not have to make this sentence yours. See whether it fits:
> A quality can belong to me without becoming my assignment."

---

## 7. Closing — WORKING / FOUNDER REVIEW

The previously proposed line, "The role may have carried something real in me. It was never large enough to contain all of me," has been rejected by the Founder and is not used anywhere in this implementation.

Two current Founder-resonant candidates exist:

- "I can still be me without having to be that for everyone."
- "I am still here when the role is not."

For this local v0.1 build, the second line is implemented:

> "I am still here when the role is not."

This is marked WORKING / FOUNDER REVIEW here, in the design specification only. It is not marked as working or provisional in the participant-facing UI, per standard practice already established for other working-copy screens in this pathway.

---

## 8. Technical Movement Key and Content Version

**Technical movement key:** `separate_self_from_role`

**Content version:** `movement_two_v0.1`

These are server-authoritative values, defined in `utils/remember.ts`, and are never participant-facing.

---

## 9. Screen Sequence (technical)

In order, following the existing `m1_*` naming convention with an `m2_` prefix:

`m2_wm1` → `m2_wm2` → `m2_witness_1` → `m2_wm3` → `m2_wm4` → `m2_witness_2` → `m2_wm5` → `m2_wm6` → `m2_witness_3` → `m2_mirror` → `m2_bedrock` → `m2_lens` → `m2_closing` → `m2_to_m3`

These fourteen keys are appended to the existing `ALLOWED_SCREEN_KEYS` sequence immediately after `m1_to_m2`, the existing Movement One completion/transition screen. `m1_to_m2`'s own Founder-locked copy ("You have seen the role more clearly. Next, we begin separating what belongs to you from what the role required of you.") already anticipates this transition and required no copy change; only its Continue action changed, from an exit link to advancing into `m2_wm1`.

`m2_to_m3` is a bare exit placeholder screen, reusing the exact "Return to the codeXverse" exit link that previously lived on `m1_to_m2` before Movement Two existed. No Movement Three copy, screen, or logic is introduced. This is not Movement Three implementation; it is the same kind of placeholder terminal screen Movement One originally had before Movement Two was built.

---

## 10. Response Keys and Persistence

Seven response keys are saved for Movement Two, all under `movement_key = 'separate_self_from_role'` in the existing `remember_responses` table:

- `room_identity`
- `genuinely_mine`
- `role_requirement`
- `harder_to_bring`
- `mine_without_expectation`
- `uncertain_without_role`
- `bedrock_response`

None of these collide with Movement One's seven keys (`comfort_responsibility`, `role_identity`, `role_capability`, `role_concealment`, `quiet_part`, `role_necessity`, `arrangement_cost`). The existing unique constraint on `(remember_session_id, movement_key, prompt_key)` already supports this without schema change, since `movement_key` disambiguates identically-named keys across movements (none exist here, but the constraint would support it regardless).

No new table or column is required for Movement Two v0.1. `remember_responses.prompt_key` already accepts arbitrary text, and `remember_movement_progress` already accepts arbitrary `movement_key` values, exactly as anticipated in Movement One v2.1, section 11 ("No new response table is required solely for v2.1 if `remember_responses.prompt_key` supports flexible text keys").

---

## 11. Continuity and Resume Behavior

Movement Two reuses the exact continuity mechanism already built for Movement One and Entry Threshold, generalized minimally (see section 13):

- The participant's single `remember_sessions` row continues to represent the whole Pathway Two™: ReMEMBER™ journey.
- `current_screen_key` now advances through the `m2_*` sequence exactly as it did through `entry_*` and `m1_*`.
- `current_movement_key` transitions from `see_the_scattering` to `separate_self_from_role` the moment the participant advances past `m1_to_m2` into `m2_wm1`. This is the only movement transition Version 1 needs to handle.
- A second `remember_movement_progress` row is created (status `active`) at that same transition point, mirroring how the first row was created for Movement One at session creation.
- `viewed_checkpoints` continues to accumulate across the whole session (not reset per movement), so Movement One's recorded checkpoints remain alongside Movement Two's.
- Resume returns the participant to the exact `m2_*` screen she was last on, with all prior responses (both movements) intact.

---

## 12. Completion Condition

**Updated 2026-09-05, per the no-forced-answer Founder ruling** (see `docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md`, section 4): Movement Two is complete only when:

- `m2_mirror` has been durably recorded as viewed;
- `m2_lens` has been durably recorded as viewed;
- the participant reaches `m2_closing` and chooses Continue (which advances to `m2_to_m3`, the completion trigger screen — itself only reachable by having advanced through every earlier Movement Two screen in sequence, one exact step at a time).

This supersedes the original condition, preserved here as provenance: all seven response keys listed in section 10 (including `bedrock_response`) were previously required to contain non-whitespace text. A participant must never be required to produce non-blank response text merely to progress or to be treated as having completed a movement; completion is now proven by durable screen/view progression alone, never by requiring or fabricating response content.

Completion writes only to `remember_movement_progress` for `movement_key = 'separate_self_from_role'`. It does not set `remember_sessions.status` or `completed_at`; those remain reserved for completion of the entire six-movement pathway, unchanged from Movement One's own rule.

---

## 13. Generalization Made to Existing Helpers

Per the Founder directive's instruction to make only the smallest safe generalization needed:

- `saveMovementOneResponse` was renamed to `saveMovementResponse` and generalized to resolve `movement_key` and prompt ordering from the owned session's own `current_movement_key`, rather than a hardcoded Movement One constant. The client still never supplies `movement_key`; nothing changed about that guarantee.
- `tryCompleteMovementOne`'s body was factored into a shared, unexported `tryCompleteMovement(...)` helper parameterized by movement key, required prompts, and required viewed checkpoints. `tryCompleteMovementOne` and the new `tryCompleteMovementTwo` are both thin wrappers over it. Movement One's own completion behavior, required prompts, and required checkpoints are unchanged.
- `advanceRememberScreen` gained one additional check: whether the screen being advanced to belongs to a different movement than the session's current one (by prefix: `m2_*` screens belong to Movement Two, everything else to Movement One). When it does, `current_movement_key` is updated and a movement-progress row is created for the new movement, using the exact same `getOrCreateMovementProgress` helper already used at session creation.
- No new database table or column was introduced.

No other part of the existing remember architecture was redesigned.

---

## 14. Boundaries — restated from governing architecture

Movement Two must not:

- diagnose the participant, classify her adaptation, or tell her which parts are "really her";
- instruct her to abandon, leave, confront, or set a boundary around the role;
- enter Movement Three recovery work;
- enter Pathway Three™ vows, boundaries, agreements, or "never again" territory;
- imply that completing this movement increases her worth.

---

## 15. What This Document Does Not Decide

- Whether "I can still be me without having to be that for everyone." should replace the current Closing line.
- The final, locked Bedrock question for Movement Two.
- Whether the witness echo pattern (section 3) is the right mechanism, versus a witness line with no echoed text.
- Any Movement Three architecture, screens, or copy.
- Any change to the Second Inheritance™, which remains intentionally undefined.

---

*the codeXverse™ | Pathway Two™: ReMEMBER™ | Movement Two Design Specification v0.1*
*Local Founder Build — Pending Founder Walkthrough and Ruling*
