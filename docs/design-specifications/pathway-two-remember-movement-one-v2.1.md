# Pathway Two™: ReMEMBER™
## Movement One: See the Scattering
### Participant Architecture v2.1 | Founder Locked

**Status:** Founder Approved and Locked, with the specific participant-facing copy identified below REOPENED on September 5, 2026 (see notice immediately following)
**Governing foundation:** Pathway Two™: ReMEMBER™ Foundational Recognition Context | Founder Approved and Locked  
**Supersedes as working draft:** Movement One Participant Architecture v2.0  
**Purpose of this revision:** Deepen Movement One against the Movement Excavation Method while reducing participant writing load, integrating self-editing in service of belonging, and making randomization and continuity structural rather than decorative.

---

## Copy Reopened Notice — September 5, 2026

A local Founder walkthrough found that the writing-moment questions, several witness lines, the Recognition Mirror™ heading and labels, the Bedrock, the Recognition Lens, and the closing below felt mechanical, constructed, and leading. Diana reopened this copy for correction. **Do not treat the participant-facing wording in section 4 below as current, locked Canon.** It is preserved unedited beneath this notice as provenance only.

The current implemented working copy, the exact replacements, and the governing no-forced-answer ruling are recorded in:

`docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md`

That document is WORKING / FOUNDER REVIEW, not itself Founder-locked, pending another walkthrough. The structural architecture below (movement function, hidden mechanism, seven-response data model, randomization architecture, continuity architecture, and completion condition, with the exception that completion no longer requires non-blank response text — see the correction document, section 4) remains governing and unaffected by this notice.

---

## 1. Movement Function

Movement One makes visible what happens before, during, and after the participant begins managing a room, relationship, role, or situation.

The movement is not trying to prove that another person harmed her, nor does it require a villain. The pattern may exist in a loving marriage, a family, a workplace, caregiving, friendship, community, or any setting where belonging matters.

The movement looks for the subtle edit.

A slight withholding. A softened truth. A quick decision to become useful. A feeling she postpones. A desire she does not name yet. An instinct to read the room before reading herself.

The Hidden Mechanism is **self-editing in service of belonging**.

The participant is not told that this mechanism is present. She is given enough evidence from her own experience to recognize whether it is.

---

## 2. Internal Excavation Results

### Assumption Register

Movement One is built to test, not presume, assumptions such as:

- keeping the room steady is partly her responsibility;
- usefulness helps preserve connection;
- reducing friction protects belonging;
- some parts of her are easier for others to receive than others;
- being fully present may carry more relational risk than being adaptive;
- the role she performs may feel so familiar that it no longer feels like a role.

### Hidden Mechanism

A change is sensed in the room. Before anyone necessarily asks anything of her, she registers the signal. Her attention shifts outward. She calibrates. A familiar version of her moves forward and begins carrying, preventing, explaining, absorbing, softening, fixing, withholding, or dimming.

If the adjustment works, the room settles or the connection remains intact. The success of the strategy can hide its cost.

### Irreducible Recognition

> **I became skilled at disappearing in ways that could look like love, competence, loyalty, patience, or peace.**

### Recognition Lens

> **When the room changes, where does my attention go, and who do I become?**

A second, later-use discernment lens is:

> **Is this alignment, or am I performing belonging?**

The lens is recognition only. It does not tell the participant what action to take.

### Movement One Bedrock

> **What did becoming necessary protect you from having to find out about whether you could belong without the role?**

---

## 3. Participant Experience Principle

The participant stays with one real room, relationship, role, or situation for the duration of Movement One.

She is not asked to summarize her whole life. One specific setting is enough to expose the mechanism.

The experience should feel like recognition accumulating, not a questionnaire becoming more intense.

Movement One v2.1 contains **seven writing moments**. Two writing moments from v2.0 are absorbed into witnessing and synthesis because additional text boxes did not earn enough recognition value.

No visible step counter, percentage indicator, or “question x of y” treatment appears.

---

## 4. Exact Participant Sequence

| Screen Key | Function | Participant-facing experience | Persistence |
|---|---|---|---|
| `m1_arrival` | Choose one field of attention | **Bring one room with you.** Think of one room, relationship, role, or situation where you can feel yourself adjust. It does not have to be the hardest one. Choose somewhere specific enough that you can remember what happens to you there. | Sticky arrival variant + checkpoint |
| `m1_signal` | Notice the pre-role signal | **What tells you, before anyone has to say it, that something here now needs your attention?** Helper language may offer examples such as tone, silence, tension, expression, unfinished responsibility, disappointment, distance, or a shift she cannot yet name. | Save as `comfort_responsibility` |
| `m1_signal_witness` | Let detection register | Return her answer exactly as written. Then: **Before the role appears, you have already noticed something.** | Checkpoint |
| `m1_role` | Reveal the adaptive version | **Who do you become next?** Helper language: Describe the version of you that seems to know how to respond here. Optional randomized role cues may be offered but never assigned. | Save as `role_identity` |
| `m1_capability` | Reveal what the role takes over | **What does this version of you take over so the room, relationship, or situation does not have to carry it in the same way?** | Save as `role_capability` |
| `m1_function_witness` | Expose function without accusation | Return `role_identity` and `role_capability` exactly. Then: **The role did something useful. That may be one reason it became so familiar.** | Checkpoint |
| `m1_edit` | Reveal self-editing | **What do you edit, soften, withhold, postpone, or dim in yourself so this version of you can keep working?** Helper copy should remain light and optional. | Save as `role_concealment` |
| `m1_quiet_part` | Locate the obscured self | **While you are doing that, what part of you becomes harder to hear?** | Save as `quiet_part` |
| `m1_cost_witness` | Let hidden material sit together | Return `role_concealment` and `quiet_part` exactly as entered. Then: **Nothing here had to disappear in order to be real. It may simply have become less available to you while the role was working.** | Checkpoint |
| `m1_belonging` | Reveal feared relational consequence | **If you stopped adjusting yourself here, what are you afraid you might discover about your place in this room or relationship?** | Save as `role_necessity` |
| `m1_mirror` | Recognition Mirror™ | Heading: **Read what you have made visible.** Present the participant’s exact answers in a quiet sequence: what she noticed, who she became, what she took over, what she edited, what became harder to hear, and what she feared she might discover. No generated summary is added. | Checkpoint |
| `m1_integration` | Name the personal cost in her own language | **What has keeping your place here asked you to set aside in yourself?** Helper copy: Stay with the same room. You do not have to decide what to do about it. | Save as `arrangement_cost` |
| `m1_dd_witness` | Remove noble camouflage | Return `arrangement_cost` exactly. Then: **The role may have helped preserve something outside you while making something inside you less visible.** | Checkpoint |
| `m1_bedrock` | Earn the deepest question | **What did becoming necessary protect you from having to find out about whether you could belong without the role?** No textbox. Subcopy: You do not have to answer this here. Notice what arrives. | Checkpoint + viewed state |
| `m1_recognition_lens` | Weaponize as discernment, not action | **When a room changes, notice where your attention goes and who you become.** Then introduce, quietly: **Is this alignment, or am I performing belonging?** No action instruction follows. | Sticky recognition-lens variant + checkpoint |
| `m1_closing` | Complete Movement One | **The role was real. It protected something, and it carried a cost. It was not all of you.** Then: **All of you belongs here.** | Mark `see_the_scattering` completed only |
| `m1_to_m2` | Open the next movement | **You have seen the role more clearly. Next, we begin separating what belongs to you from what the role required of you.** | Move current checkpoint when Movement Two exists |

---

## 5. Why v2.1 Uses Seven Writing Moments

Movement One v2.0 risked equating depth with more participant output.

v2.1 preserves the deepest mechanisms but removes writing where witnessing can do the work.

The participant writes about:

1. the signal she notices;
2. the role that appears;
3. what the role takes over;
4. what she edits in herself;
5. what becomes harder to hear;
6. what she fears she might discover if she stops adjusting;
7. what keeping her place has asked her to set aside.

The Bedrock is intentionally not another writing assignment.

At Bedrock, the ecosystem stops extracting and gives recognition somewhere to land.

---

## 6. Randomization Architecture

Randomization is required, but governing recognition must remain coherent.

### Stable elements

The core questions, their order, the Recognition Mirror™, the Bedrock, the Recognition Lens, and the movement completion logic remain stable.

### Sticky randomized elements

Curated pools may vary:

- arrival wording;
- helper language;
- optional role cues;
- witness fragments;
- pause language;
- transition language.

Once assigned, the chosen variant is stored against the participant’s active Pathway Two™: ReMEMBER™ session and content version.

It does not reroll on refresh, logout/login, browser close, device change, or later resume.

### Role Cue Pool

Role cues are optional recognizers, never labels assigned by the ecosystem. A session may receive a small randomized subset from a governed pool such as:

- the one who smooths it over
- the one who becomes useful
- the one who explains everyone
- the one who absorbs the tension
- the one who stays composed
- the one who fixes what is uncomfortable
- the one who says it is fine
- the one who carries what was left undone
- the one who makes herself easier to be around
- the one who waits to see what everyone else needs first
- the one who keeps things moving
- the one who disappears into responsibility

The participant may ignore every cue and use her own words.

The cue pool must be reviewed for stacking, overreach, gender assumptions, and diagnostic language before implementation.

---

## 7. Continuity Architecture

Governing continuity law:

> **Pathway Two™: ReMEMBER™ must remember the participant before asking her to remember herself.**

A resumable session must preserve:

| Continuity element | Requirement |
|---|---|
| Active pathway session | Server-side and owner-verified |
| Content version | Fixed for the session unless a governed migration explicitly changes it |
| Current movement | Exact movement key |
| Current screen | Exact checkpoint |
| Responses | Exact saved participant text |
| Random assignments | Sticky variant IDs and role-cue subset |
| Movement progress | Separate additive progress record |
| Bedrock viewed state | Preserved |
| Completion state | Movement-level only until whole-pathway completion |

Autosave should preserve typed responses before Continue wherever technically reasonable, so closing the browser does not erase meaningful writing.

Resume returns her to the experience she actually began, not merely to the `/remember` route.

---

## 8. Recognition Mirror™ Rule

The Recognition Mirror™ is evidence, not interpretation.

V1 returns participant language exactly as written. No generated paraphrase, sentiment analysis, emotional classification, diagnosis, or inferred psychological meaning is permitted.

The system may arrange her answers so their relationship becomes visible, but it may not tell her what the answers “really mean.”

Her own language carries the emotional weight.

---

## 9. Boundaries

Movement One must remain valid for participants whose relationships are loving, harmful, mixed, ordinary, or difficult to categorize.

The ecosystem does not make another person the villain.

It does not tell the participant to leave, confront, forgive, withdraw, establish a boundary, change access, banish an imitator, or write an Agreement™.

The “shield” and “banishing imitators” territory is reserved for Pathway Three™.

Movement One does not define or imply the Second Inheritance™.

---

## 10. Completion Condition

Movement One is complete only when:

- the seven writing responses contain non-whitespace text;
- the Recognition Mirror™ has been viewed;
- the Bedrock screen has been viewed;
- the Recognition Lens has been reached;
- the participant reaches the closing and chooses Continue.

Completion writes to `remember_movement_progress` for:

`movement_key = 'see_the_scattering'`

The Pathway Two™: ReMEMBER™ session remains active.

`remember_sessions.completed_at` remains reserved for whole-pathway completion.

---

## 11. Technical Preservation

The current working data layer should be preserved wherever possible.

Existing keys remain:

- `comfort_responsibility`
- `role_identity`
- `role_capability`
- `role_concealment`
- `quiet_part`
- `role_necessity`

One additive response key remains:

- `arrangement_cost`

No new response table is required solely for v2.1 if `remember_responses.prompt_key` supports flexible text keys.

Sticky randomization and content-version continuity may require additive session metadata or a related assignment structure. Claude Code must inspect the current schema before any implementation ruling is made.

---

## 12. Founder Lock Question

Movement One v2.1 is ready for a bounded Founder review on four matters only:

**Depth:** Does the experience reach self-editing in service of belonging rather than stopping at role description?

**Human load:** Do the seven writing moments feel earned rather than extractive?

**Recognition integrity:** Does the movement allow recognition without diagnosing the participant or prosecuting the room?

**Earned close:** Does the movement genuinely earn “All of you belongs here.”?

No implementation should begin from this draft until Founder review and a bounded Zaia integrity review are complete.
