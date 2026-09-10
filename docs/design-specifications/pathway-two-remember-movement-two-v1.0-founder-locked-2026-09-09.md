# Pathway Two™: ReMEMBER™
## Movement Two: Separate the Self from the Role
### Participant Architecture v1.0 | Founder Locked

**Status:** IMPLEMENTATION PASSED / FOUNDER-LOCKED / CLOSED — Founder Walkthrough Passed September 10, 2026
**Supersedes:** `docs/design-specifications/pathway-two-remember-movement-two-v0.1.md` (local implementation draft, September 5, 2026 — preserved as provenance, marked superseded, not erased) and the Movement Two opening-question correction recorded in `docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md`
**Authority:** Diana Francis
**Governing foundation:** `docs/architecture/pathway-two-build-plan.md`; `docs/design-specifications/pathway-two-remember-movement-one-v2.1.md`

This document records the Founder-locked participant architecture for Movement Two, implemented from Diana's Movement Two Final Founder Correction Package of September 9, 2026, and amended by the Bedrock correction of September 10, 2026 (see below). It is the current governing document for Movement Two. Do not treat `pathway-two-remember-movement-two-v0.1.md` as current; it remains only as historical provenance.

## Founder Close — September 10, 2026

Diana completed the final end-to-end walkthrough and approved the movement in full: the six writing questions, three Witness Moments, Differentiation Recognition Mirror™, Bedrock ("What do you know now?"), Bedrock Witness, Recognition Lens, Closing, and Return flow. The movement passed the four Founder Close Gate tests:

1. The sequence pulls inward rather than requiring cognitive decoding.
2. Witnesses allow recognition to accumulate without interrupting it.
3. The Mirror increases visibility without interpreting participant meaning.
4. Bedrock, Lens, and Closing leave the participant with more authority over herself, not less.

**Movement Two is closed for redesign.** It may be reopened only for a genuine implementation defect, broken continuity, accessibility failure, constitutional conflict, or a further Founder-directed amendment — not because alternate wording or another design idea appears later.

See `docs/history/2026-09-10-movement-two-closed.md` for the full closure record.

## Bedrock Amendment — September 10, 2026

The Bedrock participant question locked on September 9, 2026 below failed the Founder Resonance Test ("Does the body begin answering before the mind starts explaining?"): it required the participant to cognitively sort, compare, and analyze her prior responses, rather than simply create space for whatever recognition had already been forming. The Internal Bedrock (section 1) was updated for the same reason.

**SUPERSEDED Bedrock participant question (September 9, 2026, preserved here as provenance):** "Looking at your own words, what feels like yours, and what feels like what was expected of you?"

**Current Bedrock participant question, Founder-locked September 10, 2026:** "What do you know now?"

**SUPERSEDED Internal Bedrock (preserved as provenance):** "I can keep what is mine without keeping the role."

**Current Internal Bedrock, September 10, 2026:** "I can recognize what is mine without having to carry what was expected of me." This remains internal architecture only. It is never displayed, prefilled, suggested to, or treated as required recognition for the participant. The participant remains the sole authority on what she knows now.

All other Movement Two Founder-locked architecture (the six writing questions, three Witness Moments, Differentiation Recognition Mirror™, Bedrock witness mechanism, Recognition Lens, and Closing) is unchanged by this amendment. Section 1 and section 7 below are updated to reflect this amendment directly, with the superseded wording preserved inline as provenance rather than in a separate historical document, since this is a single-question correction to an already-current document.

---

## 1. Movement Function

**Movement:** Separate the Self from the Role

**Hidden Mechanism:** Role Fusion Through Conditional Belonging

**Internal Bedrock (amended September 10, 2026; superseded wording preserved for provenance: "I can keep what is mine without keeping the role."):**

> I can recognize what is mine without having to carry what was expected of me.

This is internal architecture only. It is never displayed to the participant, prefilled, suggested, used as helper copy, or treated as required recognition. The participant remains the authority on what she knows now.

**Recognition Lens:**

> A quality can belong to me without becoming my assignment.

**Movement outcome:** The participant may become able to distinguish what belongs to her from what became expected of her. The system must not make that distinction for her.

---

## 2. Governing Experience Law

Movement Two questions are not information-gathering prompts. They work cumulatively as scaffolding toward participant-owned recognition and the possibility of a ME Moment.

The system creates conditions. The participant supplies the recognition.

the codeXverse™ must not:
- tell the participant what she discovered
- interpret her response
- diagnose her
- classify her experience for her
- tell her which part is "really" her
- manufacture or announce a ME Moment

**Founder Resonance Test:** Does the body begin answering before the mind starts explaining?

**Recognition Key Law:** The question is the key, not the explanation.

**Witness Law:** A witness returns participant evidence without assigning meaning to it.

**Mirror Law:** The Mirror increases visibility without increasing interpretation.

**Participant Authority Law:** The participant remains the authority on what her own words mean.

**ME Moment scaffolding principle:** The six questions, witnesses, and Mirror may create conditions in which mental and emotional realization/discovery surfaces organically. the codeXverse™ must never announce, manufacture, interpret, or certify a participant's ME Moment.

**Movement Three boundary:** Movement Three remains closed. This document does not create, revise, or preview Movement Three participant architecture in any way.

**No-pressure/no-interpretation rule:** No screen in this movement asks the participant what she will change, stop doing, protect, refuse, never do again, no longer tolerate, agree to, commit to, negotiate, or no longer negotiate away. No vow, declaration, boundary exercise, authored covenant, purchase invitation, or next-pathway pressure appears anywhere in Movement Two. That territory belongs to later architecture, especially Pathway Three™: the Agreement™.

---

## 3. Exact Screen Sequence

Unchanged from the prior implementation; verified against `utils/remember.ts` before this correction was made:

`m2_wm1` → `m2_wm2` → `m2_witness_1` → `m2_wm3` → `m2_wm4` → `m2_witness_2` → `m2_wm5` → `m2_wm6` → `m2_witness_3` → `m2_mirror` → `m2_bedrock` → `m2_lens` → `m2_closing` → `m2_to_m3`

No screen was added or removed by this correction. `m2_bedrock` gained a second local UI phase (write, then witness) implemented within the same screen key — see section 7.

---

## 4. Six Writing Moments — Founder-Locked

| Screen | Exact question | Storage key |
|---|---|---|
| `m2_wm1` | "When nobody needs anything from you, what changes in you?" | `room_identity` |
| `m2_wm2` | "When the time is yours, what do you reach for?" | `genuinely_mine` |
| `m2_wm3` | "What did people come to count on you for?" | `role_requirement` |
| `m2_wm4` | "What would you miss about being that person?" | `harder_to_bring` |
| `m2_wm5` | "What wouldn't you miss?" | `mine_without_expectation` |
| `m2_wm6` | "If you didn't have to be that person anymore, what would still feel like you?" | `uncertain_without_role` |

No helper copy. No examples. No interpretation. No required nonblank response on any of the six. A participant may answer, leave blank, say "I don't know," write an incomplete thought, or change her answer.

---

## 5. Three Witness Moments — Founder-Locked

Each witness returns the exact question and the participant's exact response for each of the two writing moments since the last checkpoint, then nothing else, except Witness Three's closing line.

| Screen | Returns | Closing line |
|---|---|---|
| `m2_witness_1` | `m2_wm1` question + response, `m2_wm2` question + response | none |
| `m2_witness_2` | `m2_wm3` question + response, `m2_wm4` question + response | none |
| `m2_witness_3` | `m2_wm5` question + response, `m2_wm6` question + response | "Take a moment with what you wrote." |

No summaries, categories, interpretations, meaning-labels, AI reflection, additional questions, or forced pause appear on any witness screen.

If a response is blank, the question remains visible and no fabricated text, "Skipped," "No answer," or similar system language is displayed. A blank response is not evidence.

---

## 6. Differentiation Recognition Mirror™ — Founder-Locked

**Screen:** `m2_mirror`

**Heading (exact, no subtitle):** "Read your own words together."

Displays all six questions, in the order given in section 4, each followed by the participant's exact response.

**Closing line (exact):** "These are your words. Take a moment with them."

### Mirror prohibitions

- No interpretive category headings (the previously used "What feels genuinely mine," "What seemed required of me," "What felt harder to bring into the room," "Without the expectation, what still felt like mine," "What felt uncertain when the role was no longer required" are removed and not replaced with new interpretive categories).
- No visual division into mine/role, authentic/imposed, self/expectation, before/after, positive/negative, or keep/release.
- No arrows, badges, color coding, generated summaries, or visual treatments that assign meaning.
- One continuous vertical sequence, reusing the existing Movement One Mirror's design tokens and styling.
- The participant's own response carries more visual prominence than the question; questions are visually quieter.

### Mirror blank-response behavior

If a writing moment was left blank, the Mirror still shows the original question, displays nothing fabricated in its place, and never inserts "Skipped," "No answer," "I don't know," or an inferred value.

---

## 7. Bedrock and Bedrock Witness — Founder-Locked

**Screen:** `m2_bedrock`

**Exact question, Founder-locked September 10, 2026:** "What do you know now?"

**Superseded (Founder-locked September 9, 2026, preserved as provenance, failed the Founder Resonance Test because it required the participant to cognitively sort, compare, and analyze her prior responses):** "Looking at your own words, what feels like yours, and what feels like what was expected of you?"

Also specifically not used, from earlier candidates: "If this were no longer expected of you, what, if anything, would still feel like yours?"; "Is there anything you've been calling 'me' that may actually belong to the role?"; "Looking at your own words, what was you, and what was the role?"

By the time the participant reaches Bedrock, the six writing moments, three Witness Moments, and Differentiation Recognition Mirror™ have already provided the scaffolding and evidence. Bedrock's job is not to make the participant sort the architecture; it is to create space for whatever recognition has already been forming to surface. Recognition Key Law: the question is the key, not the explanation.

No helper copy. No examples. No interpretation. No required nonblank response. Storage key unchanged: `bedrock_response`.

**Bedrock witness behavior:** after the Bedrock response is submitted or passed, the exact Bedrock question and the participant's exact response are returned before the Recognition Lens appears. Implementation note: this is built as a second local UI phase of the same `m2_bedrock` screen key, not a new screen key, route, or schema object — `current_screen_key` only advances to `m2_lens` once the participant continues from this witness phase. Content is exactly the question, then the response, nothing else — no "Here is what you discovered," no "Notice the difference," no summary, no interpretation.

---

## 8. Recognition Lens — Founder-Locked

**Screen:** `m2_lens`

Presents exactly:

> A quality can belong to me without becoming my assignment.

Nothing else. No heading explaining the Lens, no examples, no explanation, no interpretation, no agreement prompt, no "Does this resonate?", no "What does this mean to you?", no additional writing field. The Lens arrives only after the participant has encountered her own Bedrock response.

---

## 9. Closing — Founder-Locked

**Screen:** `m2_closing`

Presents exactly:

> You don't have to decide anything from here.

Then meaningful visual space, then:

> What is yours is still yours.

No additional participant-facing interpretation. Continue control is consistent with the rest of the experience.

Movement Two must not ask the participant what she will change, stop doing, protect, set as a boundary, refuse, never do again, no longer tolerate, agree to, commit to, negotiate, or no longer negotiate away. No vow, declaration, boundary exercise, authored covenant, purchase invitation, or next-pathway pressure.

---

## 10. `m2_to_m3` — Exit, Movement Three Remains Closed

Inspected as part of this correction: the current implementation shows only a bare "Return to the codeXverse" link, with no participant-facing text of any kind describing what comes next. It does not interpret Movement Two, does not preview suppressed material, does not lead toward a predetermined Movement Three answer, and does not introduce commitment, agreement, or boundary language. **No correction was needed or made.** It continues to serve only its technical function (Movement Two completion bookkeeping trigger) and was not used as an occasion to invent Movement Three content.

---

## 11. Response Key Preservation

The seven storage keys — `room_identity`, `genuinely_mine`, `role_requirement`, `harder_to_bring`, `mine_without_expectation`, `uncertain_without_role`, `bedrock_response` — predate this locked copy and are unchanged. They are plain application-level strings, not schema-constrained beyond `remember_responses.prompt_key` being free text, and historical participant data already exists under them. Per the Founder's explicit instruction, renaming was not made a blocker for this package: the keys are preserved exactly, and this document (section 4, 5, 7) records the exact locked-question-to-key mapping. Participant-facing copy is authoritative regardless of internal key naming. See also `utils/remember.ts`'s comment above `MOVEMENT_TWO_PROMPTS` for the same mapping, server-side.

---

## 12. Blank-Response / No-Forced-Answer Law

Unchanged from the Founder ruling of 2026-09-05 (`docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md`, section 4), reaffirmed by this package: movement completion must never require nonblank responses. Progression depends only on durable screen encounter/checkpoint state and the existing completion-trigger architecture (`utils/remember.ts`, `tryCompleteMovement`), never on the participant producing a substantive written answer. "I don't know" is valid. Blank is valid. Silence is valid.

---

## 13. Completion Condition

Unchanged mechanism: Movement Two is complete when `m2_mirror` and `m2_lens` have been durably recorded as viewed, and the participant reaches `m2_closing` and continues (the trigger being reaching `m2_to_m3`). No response presence is checked. Completion writes only to `remember_movement_progress` for `movement_key = 'separate_self_from_role'`. It does not set `remember_sessions.status` or `completed_at`, and does not create, reference, or imply any Pathway Three™ architecture. Whole-pathway completion remains reserved for completion of the entire six-movement pathway.

---

## 14. What This Document Does Not Decide

- Any Movement Three architecture, screens, copy, or excavation.
- The Second Inheritance™'s naming, definition, function, or form.
- Any Pathway Three™ design.
- Any payment, commerce, or access-control mechanism.
- The internal storage key names for Movement Two's seven response fields (intentionally preserved, see section 11).

---

*the codeXverse™ | Pathway Two™: ReMEMBER™ | Movement Two Design Specification v1.0 | Founder Locked, September 9, 2026*
