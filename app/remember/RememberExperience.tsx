'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// Participant-facing copy. Entry Threshold (docs/design-specifications/
// pathway-two-remember-v1.0.md, Part Two) is unaffected by this revision
// and remains locked.
//
// Movement One's copy previously locked in docs/design-specifications/
// pathway-two-remember-movement-one-v2.1.md, section 4, was REOPENED by
// Founder ruling on 2026-09-05: the local walkthrough found it mechanical,
// constructed, and leading. The affected Movement One prompts, witnesses,
// Mirror, Bedrock, Recognition Lens, closing, and the Movement One ->
// Movement Two transition below are WORKING / FOUNDER REVIEW copy, not
// locked, pending another walkthrough. See
// docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md
// for the full record, including the exact superseded wording preserved as
// provenance.
//
// Movement Two's participant-facing copy (all m2_* steps below) is
// FOUNDER-LOCKED as of 2026-09-09. Governing document:
// docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md.
// Do not reword, add helper text, add interpretation, or add examples to
// any m2_* copy without a further Founder ruling.
//
// Mirrors utils/remember.ts's server-authoritative constants; duplicated
// here because this is a client component and cannot import the
// server-only module.

type EntryStep = {
  kind: 'entry';
  screenKey: string;
  lines: string[];
  pauseAfter?: boolean;
};

type ArrivalStep = {
  kind: 'arrival';
  screenKey: string;
};

type PromptStep = {
  kind: 'prompt';
  screenKey: string;
  promptKey: string;
  question: string;
  helper?: string;
  showRoleCues?: boolean;
};

type WitnessStep = {
  kind: 'witness';
  screenKey: string;
  // Movement One's witness mode (unchanged): a flat list of prior response
  // keys, echoed with no question text above them.
  sourceKeys?: string[];
  // Movement Two's witness mode, per the Founder-locked package of
  // 2026-09-09: each item pairs the exact locked question with its exact
  // response, so the witness returns both, not just the raw answer.
  items?: { question: string; promptKey: string }[];
  // Optional per Founder ruling (2026-09-05, no-forced-answer /
  // no-interpretive-copy correction pass): a witness screen may simply
  // return the participant's own words with no added interpretive line,
  // rather than inventing a replacement for copy that was removed.
  closingLine?: string;
};

// Mirror, Lens, and Closing carry their own copy so both Movement One's and
// Movement Two's differently-worded versions can share one rendering path.
type MirrorStep = {
  kind: 'mirror';
  screenKey: string;
  heading?: string;
  items: { label: string; promptKey: string }[];
  closingNote?: string;
};
type BedrockStep = { kind: 'bedrock'; screenKey: string };
// Movement Two's Bedrock, per the Founder-locked package of 2026-09-09: a
// saved writing response, followed by returning that exact question and
// response before the Recognition Lens — implemented as a second local
// phase of the SAME screen key (no new screenKey, no schema change), per
// the package's "smallest implementation" instruction.
type BedrockPromptStep = {
  kind: 'bedrockPrompt';
  screenKey: string;
  promptKey: string;
  question: string;
};
// body is optional so a Lens screen can carry one unstacked line (heading
// only) instead of a stacked heading-plus-body pair, per Founder ruling
// against line/ladder stacking (2026-09-05 copy correction pass).
type LensStep = { kind: 'lens'; screenKey: string; heading: string; body?: string };
type ClosingStep = {
  kind: 'closing';
  screenKey: string;
  primaryLines: string[];
  secondaryLine?: string;
};
type TransitionStep = { kind: 'transition'; screenKey: string; body: string };
type ExitStep = { kind: 'exit'; screenKey: string };

type Step =
  | EntryStep
  | ArrivalStep
  | PromptStep
  | WitnessStep
  | MirrorStep
  | BedrockStep
  | BedrockPromptStep
  | LensStep
  | ClosingStep
  | TransitionStep
  | ExitStep;

// Movement One's Recognition Mirror™ items. Per Founder ruling (2026-09-05
// copy correction pass, see
// docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md),
// interpretive labels ("What she noticed", "Who she became", etc.) were
// removed because they assigned meaning the participant had not assigned
// herself. Each label here is the exact working-copy question that produced
// the response, per that document's Recognition Mirror™ section, option A.
const MOVEMENT_ONE_MIRROR_ITEMS: { label: string; promptKey: string }[] = [
  {
    label:
      'When something feels off, what do you do before you even realize you’re doing it?',
    promptKey: 'comfort_responsibility',
  },
  {
    label: 'In those moments, who do you become for everyone else?',
    promptKey: 'role_identity',
  },
  {
    label: 'What is it like for you to keep being that person?',
    promptKey: 'role_capability',
  },
  {
    label:
      'What, if anything, gets less room in you while you’re being that person?',
    promptKey: 'role_concealment',
  },
  {
    label: 'When it was just you, what did you know?',
    promptKey: 'quiet_part',
  },
  {
    label:
      'Before you see your words together, is there anything else you want to say about what you’ve been describing?',
    promptKey: 'role_necessity',
  },
];

// Movement Two's Differentiation Recognition Mirror™ items, from the
// Founder-locked package of 2026-09-09 (see
// docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md).
// Per that package's Mirror Prohibitions, labels are the exact locked
// question that produced each response, never an interpretive category.
const MOVEMENT_TWO_MIRROR_ITEMS: { label: string; promptKey: string }[] = [
  {
    label: 'When nobody needs anything from you, what changes in you?',
    promptKey: 'room_identity',
  },
  {
    label: 'When the time is yours, what do you reach for?',
    promptKey: 'genuinely_mine',
  },
  {
    label: 'What did people come to count on you for?',
    promptKey: 'role_requirement',
  },
  {
    label: 'What would you miss about being that person?',
    promptKey: 'harder_to_bring',
  },
  {
    label: 'What wouldn’t you miss?',
    promptKey: 'mine_without_expectation',
  },
  {
    label:
      'If you didn’t have to be that person anymore, what would still feel like you?',
    promptKey: 'uncertain_without_role',
  },
];

const STEPS: Step[] = [
  { kind: 'entry', screenKey: 'entry_01', lines: ['You found yourself.'] },
  {
    kind: 'entry',
    screenKey: 'entry_02',
    lines: ['Now something else is asking to be seen.'],
  },
  {
    kind: 'entry',
    screenKey: 'entry_03',
    lines: [
      'Not who you are.',
      'Where you have been leaving pieces of yourself behind.',
    ],
    pauseAfter: true,
  },
  {
    kind: 'entry',
    screenKey: 'entry_04',
    lines: [
      'Some parts of you learned to live inside roles created for other people’s comfort.',
    ],
  },
  {
    kind: 'entry',
    screenKey: 'entry_05',
    lines: ['This is where you begin bringing them home.'],
  },
  { kind: 'arrival', screenKey: 'm1_arrival' },
  {
    kind: 'prompt',
    screenKey: 'm1_signal',
    promptKey: 'comfort_responsibility',
    question:
      'When something feels off, what do you do before you even realize you’re doing it?',
  },
  {
    kind: 'witness',
    screenKey: 'm1_signal_witness',
    sourceKeys: ['comfort_responsibility'],
    closingLine: 'Before the role appears, you have already noticed something.',
  },
  {
    kind: 'prompt',
    screenKey: 'm1_role',
    promptKey: 'role_identity',
    question: 'In those moments, who do you become for everyone else?',
    showRoleCues: true,
  },
  {
    kind: 'prompt',
    screenKey: 'm1_capability',
    promptKey: 'role_capability',
    question: 'What is it like for you to keep being that person?',
  },
  {
    kind: 'witness',
    screenKey: 'm1_function_witness',
    sourceKeys: ['role_identity', 'role_capability'],
    closingLine:
      'The role did something useful. That may be one reason it became so familiar.',
  },
  {
    kind: 'prompt',
    screenKey: 'm1_edit',
    promptKey: 'role_concealment',
    question:
      'What, if anything, gets less room in you while you’re being that person?',
  },
  {
    kind: 'prompt',
    screenKey: 'm1_quiet_part',
    promptKey: 'quiet_part',
    question: 'When it was just you, what did you know?',
  },
  {
    kind: 'witness',
    screenKey: 'm1_cost_witness',
    sourceKeys: ['role_concealment', 'quiet_part'],
  },
  {
    kind: 'prompt',
    screenKey: 'm1_belonging',
    promptKey: 'role_necessity',
    question:
      'Before you see your words together, is there anything else you want to say about what you’ve been describing?',
  },
  {
    kind: 'mirror',
    screenKey: 'm1_mirror',
    heading: 'Read your own words together.',
    items: MOVEMENT_ONE_MIRROR_ITEMS,
    closingNote: 'These are your words. Take a moment with them.',
  },
  {
    kind: 'prompt',
    screenKey: 'm1_integration',
    promptKey: 'arrangement_cost',
    question: 'What stands out to you now that you can see your own words together?',
  },
  {
    kind: 'witness',
    screenKey: 'm1_dd_witness',
    sourceKeys: ['arrangement_cost'],
    closingLine: 'You do not have to do anything with what you saw.',
  },
  { kind: 'bedrock', screenKey: 'm1_bedrock' },
  {
    kind: 'lens',
    screenKey: 'm1_recognition_lens',
    heading: 'When something feels off, I can notice what I start doing.',
  },
  {
    kind: 'closing',
    screenKey: 'm1_closing',
    primaryLines: ['All of you belongs here.'],
  },
  {
    kind: 'transition',
    screenKey: 'm1_to_m2',
    body: 'Next, let’s look at what feels like you when the role isn’t asking anything of you.',
  },
  {
    kind: 'prompt',
    screenKey: 'm2_wm1',
    promptKey: 'room_identity',
    question: 'When nobody needs anything from you, what changes in you?',
  },
  {
    kind: 'prompt',
    screenKey: 'm2_wm2',
    promptKey: 'genuinely_mine',
    question: 'When the time is yours, what do you reach for?',
  },
  {
    kind: 'witness',
    screenKey: 'm2_witness_1',
    items: [
      {
        question: 'When nobody needs anything from you, what changes in you?',
        promptKey: 'room_identity',
      },
      {
        question: 'When the time is yours, what do you reach for?',
        promptKey: 'genuinely_mine',
      },
    ],
  },
  {
    kind: 'prompt',
    screenKey: 'm2_wm3',
    promptKey: 'role_requirement',
    question: 'What did people come to count on you for?',
  },
  {
    kind: 'prompt',
    screenKey: 'm2_wm4',
    promptKey: 'harder_to_bring',
    question: 'What would you miss about being that person?',
  },
  {
    kind: 'witness',
    screenKey: 'm2_witness_2',
    items: [
      {
        question: 'What did people come to count on you for?',
        promptKey: 'role_requirement',
      },
      {
        question: 'What would you miss about being that person?',
        promptKey: 'harder_to_bring',
      },
    ],
  },
  {
    kind: 'prompt',
    screenKey: 'm2_wm5',
    promptKey: 'mine_without_expectation',
    question: 'What wouldn’t you miss?',
  },
  {
    kind: 'prompt',
    screenKey: 'm2_wm6',
    promptKey: 'uncertain_without_role',
    question:
      'If you didn’t have to be that person anymore, what would still feel like you?',
  },
  {
    kind: 'witness',
    screenKey: 'm2_witness_3',
    items: [
      { question: 'What wouldn’t you miss?', promptKey: 'mine_without_expectation' },
      {
        question:
          'If you didn’t have to be that person anymore, what would still feel like you?',
        promptKey: 'uncertain_without_role',
      },
    ],
    closingLine: 'Take a moment with what you wrote.',
  },
  {
    kind: 'mirror',
    screenKey: 'm2_mirror',
    heading: 'Read your own words together.',
    items: MOVEMENT_TWO_MIRROR_ITEMS,
    closingNote: 'These are your words. Take a moment with them.',
  },
  {
    kind: 'bedrockPrompt',
    screenKey: 'm2_bedrock',
    promptKey: 'bedrock_response',
    question: 'What do you know now?',
  },
  {
    kind: 'lens',
    screenKey: 'm2_lens',
    heading: 'A quality can belong to me without becoming my assignment.',
  },
  {
    kind: 'closing',
    screenKey: 'm2_closing',
    primaryLines: ['You don’t have to decide anything from here.'],
    secondaryLine: 'What is yours is still yours.',
  },
  { kind: 'exit', screenKey: 'm2_to_m3' },
];

type InitialResponse = { promptKey: string; responseText: string };

async function patchScreen(screenKey: string, viewedScreenKey: string) {
  await fetch('/api/remember/screen', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ screenKey, viewedScreenKey }),
  });
}

async function saveResponse(promptKey: string, responseText: string) {
  const res = await fetch('/api/remember/response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ promptKey, responseText }),
  });
  const result = await res.json();
  return res.ok && result.ok;
}

const continueButtonClass =
  'mt-8 text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent disabled:opacity-60';

export default function RememberExperience({
  initialScreenKey,
  initialResponses,
  roleCues,
}: {
  initialScreenKey: string;
  initialResponses: InitialResponse[];
  roleCues: string[];
}) {
  const startIndex = useMemo(() => {
    const idx = STEPS.findIndex((s) => s.screenKey === initialScreenKey);
    return idx === -1 ? 0 : idx;
  }, [initialScreenKey]);

  const [index, setIndex] = useState(startIndex);
  const [visible, setVisible] = useState(true);
  const [responses, setResponses] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const r of initialResponses) {
      map[r.promptKey] = r.responseText;
    }
    return map;
  });
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  // Optional-language cues (role cues) must stay hidden unless the
  // participant explicitly asks for help finding words, per Founder ruling
  // (2026-09-05 copy correction pass). Tracked by screenKey rather than a
  // plain boolean so a request on one screen never silently carries over
  // to another, with no effect-based reset required.
  const [cuesRequestedForScreen, setCuesRequestedForScreen] = useState<string | null>(
    null
  );
  // Movement Two's Bedrock is one screen key with two local phases: write,
  // then a witness return of the exact question and response, before the
  // participant actually advances to the Recognition Lens. Tracked by
  // screenKey for the same reason as cuesRequestedForScreen above.
  const [bedrockWitnessForScreen, setBedrockWitnessForScreen] = useState<string | null>(
    null
  );

  const step = STEPS[index];
  const cuesRequested = cuesRequestedForScreen === step.screenKey;
  const bedrockWitnessVisible = bedrockWitnessForScreen === step.screenKey;

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearAutosaveTimer() {
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = null;
    }
  }

  // A participant who closes the browser after meaningful writing, but
  // before Continue, must not lose that writing. Autosave debounces while
  // typing and flushes immediately on blur; Continue always saves once more
  // before advancing, which is safe because saveMovementResponse is an
  // upsert keyed on (remember_session_id, movement_key, prompt_key).
  useEffect(() => {
    return () => clearAutosaveTimer();
  }, [index]);

  function handleDraftChange(promptKey: string, value: string) {
    setDraft(value);
    clearAutosaveTimer();
    autosaveTimer.current = setTimeout(() => {
      if (value.trim().length > 0) {
        void saveResponse(promptKey, value);
      }
    }, 1500);
  }

  function handleDraftBlur(promptKey: string, value: string) {
    clearAutosaveTimer();
    if (value.trim().length > 0) {
      void saveResponse(promptKey, value);
    }
  }

  function goTo(nextIndex: number, delayMs: number) {
    setVisible(false);
    setTimeout(() => {
      setIndex(nextIndex);
      setVisible(true);
    }, delayMs);
  }

  async function handleSimpleContinue(delayMs = 700) {
    const nextStep = STEPS[index + 1];
    if (!nextStep) return;
    void patchScreen(nextStep.screenKey, step.screenKey);
    goTo(index + 1, delayMs);
  }

  // Per Founder ruling (no-forced-answer, 2026-09-05 copy correction pass),
  // a participant must never be required to produce non-blank text to
  // continue. A blank or absent response is neither saved as fabricated
  // text nor blocked; it is simply not written, and progression proceeds on
  // durable screen advancement alone (see advanceRememberScreen and
  // tryCompleteMovement in utils/remember.ts).
  async function handlePromptContinue() {
    if (step.kind !== 'prompt') return;

    const text = draft.trim().length > 0 ? draft : responses[step.promptKey] ?? '';

    clearAutosaveTimer();
    setSubmitting(true);
    setError('');

    try {
      if (text.trim().length > 0) {
        const ok = await saveResponse(step.promptKey, text);

        if (!ok) {
          setError('Something went wrong. Please try again.');
          setSubmitting(false);
          return;
        }

        setResponses((prev) => ({ ...prev, [step.promptKey]: text }));
      }

      setDraft('');

      const nextStep = STEPS[index + 1];
      void patchScreen(nextStep.screenKey, step.screenKey);
      setSubmitting(false);
      goTo(index + 1, 700);
    } catch (err) {
      console.error('ReMEMBER response submit error:', err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  // Movement Two's Bedrock (m2_bedrock): saves the response exactly like
  // handlePromptContinue (no forced answer), then reveals the same screen's
  // witness phase instead of advancing. current_screen_key is not touched
  // here; the actual advance to m2_lens happens only when the participant
  // continues from the witness phase, via handleSimpleContinue below.
  async function handleBedrockContinue() {
    if (step.kind !== 'bedrockPrompt') return;

    const text = draft.trim().length > 0 ? draft : responses[step.promptKey] ?? '';

    clearAutosaveTimer();
    setSubmitting(true);
    setError('');

    try {
      if (text.trim().length > 0) {
        const ok = await saveResponse(step.promptKey, text);

        if (!ok) {
          setError('Something went wrong. Please try again.');
          setSubmitting(false);
          return;
        }

        setResponses((prev) => ({ ...prev, [step.promptKey]: text }));
      }

      setDraft('');
      setSubmitting(false);
      setBedrockWitnessForScreen(step.screenKey);
    } catch (err) {
      console.error('ReMEMBER response submit error:', err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 animate-fadeIn">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4 text-xs tracking-[0.3em] text-[#d7ba7d]">
          the codeXverse™
        </p>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {step.kind === 'entry' && (
            <div className="space-y-6">
              {step.lines.map((line, i) => (
                <p
                  key={i}
                  className="text-2xl font-serif text-white/90 leading-snug whitespace-pre-line"
                >
                  {line}
                </p>
              ))}
              <button
                onClick={() => handleSimpleContinue(step.pauseAfter ? 1400 : 700)}
                className={continueButtonClass}
              >
                continue
              </button>
            </div>
          )}

          {step.kind === 'arrival' && (
            <div className="space-y-6">
              <p className="text-2xl font-serif text-white/90 leading-snug">
                Bring one room with you.
              </p>
              <p className="text-lg font-serif text-white/80 leading-8">
                Think of one room, relationship, role, or situation where you
                can feel yourself adjust. It does not have to be the hardest
                one. Choose somewhere specific enough that you can remember
                what happens to you there.
              </p>
              <button onClick={() => handleSimpleContinue()} className={continueButtonClass}>
                continue
              </button>
            </div>
          )}

          {step.kind === 'prompt' && (
            <div className="space-y-6">
              <p className="text-xl font-serif text-white/90 leading-8">
                {step.question}
              </p>
              {step.helper && (
                <p className="text-sm text-white/50 italic">{step.helper}</p>
              )}
              <textarea
                value={draft.length > 0 ? draft : responses[step.promptKey] ?? ''}
                onChange={(e) => handleDraftChange(step.promptKey, e.target.value)}
                onBlur={(e) => handleDraftBlur(step.promptKey, e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-5 text-base leading-8 text-white/90 resize-none focus:outline-none focus:border-[#d7ba7d]/40"
              />
              {step.showRoleCues && roleCues.length > 0 && !cuesRequested && (
                <button
                  type="button"
                  onClick={() => setCuesRequestedForScreen(step.screenKey)}
                  className="text-xs text-white/30 underline underline-offset-4 hover:text-white/50"
                >
                  need help finding words?
                </button>
              )}
              {step.showRoleCues && roleCues.length > 0 && cuesRequested && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {roleCues.map((cue) => (
                      <span
                        key={cue}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50"
                      >
                        {cue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {error && (
                <p className="text-sm text-[#d7ba7d]/70 italic">{error}</p>
              )}
              <button
                onClick={handlePromptContinue}
                disabled={submitting}
                className={continueButtonClass}
              >
                {submitting ? 'saving...' : 'continue'}
              </button>
            </div>
          )}

          {step.kind === 'witness' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {step.items
                  ? step.items.map((item) => (
                      <div key={item.promptKey} className="space-y-1">
                        <p className="text-sm text-white/50 italic">{item.question}</p>
                        <p className="text-lg font-serif text-white/85 leading-8 whitespace-pre-line">
                          {responses[item.promptKey] ?? ''}
                        </p>
                      </div>
                    ))
                  : step.sourceKeys?.map((key) => (
                      <p
                        key={key}
                        className="text-lg font-serif text-white/80 leading-8 whitespace-pre-line border-l border-[#d7ba7d]/30 pl-4"
                      >
                        {responses[key] ?? ''}
                      </p>
                    ))}
              </div>
              {step.closingLine && (
                <p className="text-xl font-serif text-[#d7ba7d] leading-snug">
                  {step.closingLine}
                </p>
              )}
              <button onClick={() => handleSimpleContinue()} className={continueButtonClass}>
                continue
              </button>
            </div>
          )}

          {step.kind === 'mirror' && (
            <div className="space-y-6">
              {step.heading && (
                <p className="text-2xl font-serif text-white/90 leading-snug">
                  {step.heading}
                </p>
              )}
              <div className="space-y-5">
                {step.items.map((item) => (
                  <div key={item.promptKey} className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                      {item.label}
                    </p>
                    <p className="text-lg font-serif text-white/85 leading-8 whitespace-pre-line">
                      {responses[item.promptKey] ?? ''}
                    </p>
                  </div>
                ))}
              </div>
              {step.closingNote && (
                <p className="text-xl font-serif text-[#d7ba7d] leading-snug">
                  {step.closingNote}
                </p>
              )}
              <button onClick={() => handleSimpleContinue()} className={continueButtonClass}>
                continue
              </button>
            </div>
          )}

          {step.kind === 'bedrock' && (
            <div className="space-y-6">
              <p className="text-2xl font-serif text-white/90 leading-snug">
                What, if anything, do you know now that you did not know when
                you started?
              </p>
              <button onClick={() => handleSimpleContinue()} className={continueButtonClass}>
                continue
              </button>
            </div>
          )}

          {step.kind === 'bedrockPrompt' && !bedrockWitnessVisible && (
            <div className="space-y-6">
              <p className="text-xl font-serif text-white/90 leading-8">
                {step.question}
              </p>
              <textarea
                value={draft.length > 0 ? draft : responses[step.promptKey] ?? ''}
                onChange={(e) => handleDraftChange(step.promptKey, e.target.value)}
                onBlur={(e) => handleDraftBlur(step.promptKey, e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-5 text-base leading-8 text-white/90 resize-none focus:outline-none focus:border-[#d7ba7d]/40"
              />
              {error && (
                <p className="text-sm text-[#d7ba7d]/70 italic">{error}</p>
              )}
              <button
                onClick={handleBedrockContinue}
                disabled={submitting}
                className={continueButtonClass}
              >
                {submitting ? 'saving...' : 'continue'}
              </button>
            </div>
          )}

          {step.kind === 'bedrockPrompt' && bedrockWitnessVisible && (
            <div className="space-y-6">
              <p className="text-sm text-white/50 italic">{step.question}</p>
              <p className="text-lg font-serif text-white/85 leading-8 whitespace-pre-line">
                {responses[step.promptKey] ?? ''}
              </p>
              <button onClick={() => handleSimpleContinue()} className={continueButtonClass}>
                continue
              </button>
            </div>
          )}

          {step.kind === 'lens' && (
            <div className="space-y-6">
              <p className="text-2xl font-serif text-white/90 leading-snug">
                {step.heading}
              </p>
              {step.body && (
                <p className="text-lg font-serif text-[#d7ba7d] leading-8">
                  {step.body}
                </p>
              )}
              <button onClick={() => handleSimpleContinue()} className={continueButtonClass}>
                continue
              </button>
            </div>
          )}

          {step.kind === 'closing' && (
            <div className="space-y-8">
              <p className="text-2xl font-serif text-[#d7ba7d] leading-snug whitespace-pre-line">
                {step.primaryLines.join('\n')}
              </p>
              {step.secondaryLine && (
                <p className="text-xl font-serif text-white/90 leading-snug">
                  {step.secondaryLine}
                </p>
              )}
              <button onClick={() => handleSimpleContinue()} className={continueButtonClass}>
                continue
              </button>
            </div>
          )}

          {step.kind === 'transition' && (
            <div className="space-y-8">
              <p className="text-2xl font-serif text-white/90 leading-snug">
                {step.body}
              </p>
              <button onClick={() => handleSimpleContinue()} className={continueButtonClass}>
                continue
              </button>
            </div>
          )}

          {step.kind === 'exit' && (
            <div className="pt-10">
              <a
                href="/record"
                className="inline-block rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
              >
                Return to the codeXverse
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
