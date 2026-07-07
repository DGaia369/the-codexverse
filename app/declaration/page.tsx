'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type DeclarationRecord = {
  q1_completed: string | null;
  q2_resistance: string | null;
  q3_changed: string | null;
  q4_truth_revealed: string | null;
  q5_non_negotiable: string | null;
};

const FIELD_LABELS: { key: keyof DeclarationRecord; label: string }[] = [
  { key: 'q1_completed', label: 'What you completed' },
  { key: 'q2_resistance', label: 'What resisted' },
  { key: 'q3_changed', label: 'What changed' },
  { key: 'q4_truth_revealed', label: 'What was revealed' },
  { key: 'q5_non_negotiable', label: 'What became non-negotiable' },
];

// --- the Declaration™ writing experience — 15 fields across five parts ---

type WritingFieldKey =
  | 'p1_q1' | 'p1_q2'
  | 'p2_q1' | 'p2_q2' | 'p2_q3'
  | 'p3_q1' | 'p3_q2'
  | 'p4_q1' | 'p4_q2' | 'p4_q3'
  | 'p5_q1' | 'p5_q2' | 'p5_q3' | 'p5_q4' | 'p5_q5';

type DeclarationWriting = {
  session_id: string;
  status: 'draft' | 'sealed';
  sealed_at: string | null;
} & Record<WritingFieldKey, string | null>;

type WritingPart = {
  title: string;
  fields: { key: WritingFieldKey; prompt: string }[];
};

const WRITING_PARTS: WritingPart[] = [
  {
    title: 'Part One — The Interruption',
    fields: [
      { key: 'p1_q1', prompt: 'What was happening in your life when you found the codeXverse™?' },
      { key: 'p1_q2', prompt: 'How long have you been carrying what you have been carrying?' },
    ],
  },
  {
    title: 'Part Two — The Recognition',
    fields: [
      { key: 'p2_q1', prompt: 'Where have you been quietly leaving yourself?' },
      { key: 'p2_q2', prompt: 'What has the pattern cost you?' },
      { key: 'p2_q3', prompt: 'What did you learn about your worth from the people who were meant to teach you?' },
    ],
  },
  {
    title: 'Part Three — the First Agreement™',
    fields: [
      { key: 'p3_q1', prompt: 'Write your First Agreement in your own words.' },
      { key: 'p3_q2', prompt: 'What is the first place in your daily life where this agreement will require you to choose differently?' },
    ],
  },
  {
    title: 'Part Four — The Evidence',
    fields: [
      { key: 'p4_q1', prompt: 'What do you now know about yourself that you were not fully trusting before?' },
      { key: 'p4_q2', prompt: 'Name three things you have already moved through that once felt impossible.' },
      { key: 'p4_q3', prompt: 'Where do you see her most clearly now?' },
    ],
  },
  {
    title: 'Part Five — the Declaration™',
    fields: [
      { key: 'p5_q1', prompt: 'I now have a name for what has been happening. In my own words:' },
      { key: 'p5_q2', prompt: 'The pattern I inherited was not my fault. Continuing it is my responsibility. In my own words:' },
      { key: 'p5_q3', prompt: 'I will no longer abandon myself in the name of love, loyalty, duty, or survival. In my own words:' },
      { key: 'p5_q4', prompt: 'I do not need to be chosen by anyone else. I choose me. In my own words:' },
      { key: 'p5_q5', prompt: 'The self I have been searching for was never absent. She has been here the whole time. In my own words:' },
    ],
  },
];

const ALL_WRITING_KEYS: WritingFieldKey[] = WRITING_PARTS.flatMap((part) =>
  part.fields.map((f) => f.key)
);

function DeclarationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [record, setRecord] = useState<DeclarationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Writing experience state
  const [writing, setWriting] = useState<DeclarationWriting | null>(null);
  const [writingLoading, setWritingLoading] = useState(true);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [sealing, setSealing] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadDeclaration() {
      if (!sessionId) {
        if (!isActive) return;
        setError(
          'A valid session is required to view your Declaration.'
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/declaration?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await response.json();

        if (!isActive) return;

        if (!data.ok || !data.record) {
          setError(
            'Your Declaration could not be found. Return to the beginning and complete the pathway first.'
          );
          setLoading(false);
          return;
        }

        setRecord(data.record);
        setLoading(false);
      } catch (err) {
        console.error('Declaration load error:', err);
        if (!isActive) return;
        setError(
          'Something prevented your Declaration from loading. Please try again.'
        );
        setLoading(false);
      }
    }

    loadDeclaration();

    return () => {
      isActive = false;
    };
  }, [sessionId]);

  // Load, or create, the writing record once the session is known
  useEffect(() => {
    let isActive = true;

    async function loadOrCreateWriting() {
      if (!sessionId) {
        setWritingLoading(false);
        return;
      }

      try {
        const getResponse = await fetch(
          `/api/declaration-writing?session_id=${encodeURIComponent(sessionId)}`
        );
        const getData = await getResponse.json();

        if (!isActive) return;

        if (getData.declaration) {
          setWriting(getData.declaration);
          setWritingLoading(false);
          return;
        }

        const postResponse = await fetch('/api/declaration-writing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const postData = await postResponse.json();

        if (!isActive) return;

        setWriting(postData.declaration ?? null);
        setWritingLoading(false);
      } catch (err) {
        console.error('Declaration writing load error:', err);
        if (!isActive) return;
        setWritingLoading(false);
      }
    }

    loadOrCreateWriting();

    return () => {
      isActive = false;
    };
  }, [sessionId]);

  function handleFieldChange(key: WritingFieldKey, value: string) {
    if (!writing || writing.status === 'sealed') return;

    setWriting({ ...writing, [key]: value });
    setSaveState('idle');

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      autosaveField(key, value);
    }, 1200);
  }

  async function autosaveField(key: WritingFieldKey, value: string) {
    if (!sessionId) return;

    setSaveState('saving');
    try {
      const response = await fetch('/api/declaration-writing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, [key]: value }),
      });
      const data = await response.json();

      if (data.declaration) {
        setWriting(data.declaration);
      }
      setSaveState('saved');
    } catch (err) {
      console.error('Autosave error:', err);
      setSaveState('idle');
    }
  }

  const allFieldsFilled =
    writing !== null &&
    ALL_WRITING_KEYS.every((key) => (writing[key] ?? '').trim().length > 0);

  async function handleSeal() {
    if (!sessionId || !writing || sealing) return;

    setSealing(true);
    try {
      const response = await fetch('/api/declaration-writing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, seal: true }),
      });
      const data = await response.json();

      if (data.declaration) {
        setWriting(data.declaration);
      }
    } catch (err) {
      console.error('Seal error:', err);
    } finally {
      setSealing(false);
    }
  }

  async function handleDownload() {
    if (!sessionId || downloading) return;

    setDownloading(true);
    try {
      const response = await fetch('/api/declaration/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        console.error('PDF download failed');
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'the-declaration.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setDownloading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-6 py-24 text-white md:px-10">
        <div className="mx-auto w-full max-w-2xl pt-16">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-6 py-24 text-white md:px-10">
        <div className="mx-auto w-full max-w-2xl pt-16 space-y-8">
          <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">
            the codeXverse™
          </p>
          <p className="text-lg font-light leading-8 text-white/75">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const isSealed = writing?.status === 'sealed';

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-24 text-white md:px-10 print:bg-white print:text-black">
      <header className="fixed top-0 left-0 right-0 z-10 print:hidden">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-5 md:px-10">
          <div>
            <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">
              the codeXverse™
            </p>
            <p className="text-xs text-white/55">
              Pathway One™: Return to Self
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl pt-16 space-y-16">

        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
            the Declaration™
          </p>
          <p className="text-xl font-light leading-9 text-white/85 print:text-black">
            These are your first words.
          </p>
          <p className="text-lg font-light leading-8 text-white/60 print:text-black/70">
            They are not a draft. They are evidence of what became
            visible at the moment you crossed.
          </p>
        </div>

        <div className="space-y-12">
          {FIELD_LABELS.map(({ key, label }) => (
            <div key={key} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d] print:text-black">
                {label}
              </p>
              <p className="border-l border-[#d7ba7d]/30 pl-5 text-lg italic leading-8 text-[#d7ba7d] print:text-black print:border-black/30">
                {record?.[key]?.trim()
                  ? `\u201C${record[key]!.trim()}\u201D`
                  : 'Not named yet.'}
              </p>
            </div>
          ))}
        </div>

        {/* --- the Declaration™ writing experience --- */}
        {!writingLoading && writing && (
          <div className="space-y-20 border-t border-white/10 pt-16 print:border-black/20">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
                I Choose Me
              </p>
              <p className="text-lg font-light leading-8 text-white/70 print:text-black/80">
                {isSealed
                  ? 'What you wrote here is sealed. These are your words, standing as evidence.'
                  : 'Write what is true. There is nothing here to get right.'}
              </p>
              {!isSealed && (
                <p className="text-xs tracking-[0.15em] text-white/30 print:hidden">
                  {saveState === 'saving' && 'saving...'}
                  {saveState === 'saved' && 'saved'}
                </p>
              )}
            </div>

            {WRITING_PARTS.map((part) => (
              <div key={part.title} className="space-y-10">
                <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d] print:text-black">
                  {part.title}
                </p>

                <div className="space-y-10">
                  {part.fields.map(({ key, prompt }) => {
                    const value = writing[key] ?? '';

                    return (
                      <div key={key} className="space-y-3">
                        <p className="text-base font-light leading-7 text-white/75 print:text-black">
                          {prompt}
                        </p>

                        {isSealed ? (
                          <p className="border-l border-[#d7ba7d]/30 pl-5 text-lg italic leading-8 text-[#d7ba7d] print:text-black print:border-black/30">
                            {value.trim()
                              ? `\u201C${value.trim()}\u201D`
                              : 'Not answered.'}
                          </p>
                        ) : (
                          <textarea
                            value={value}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            rows={3}
                            className="w-full resize-none border-l border-[#d7ba7d]/30 bg-transparent pl-5 text-lg leading-8 text-white/90 outline-none placeholder:text-white/20 focus:border-[#d7ba7d]/70"
                            placeholder="Write here."
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {!isSealed && (
              <div className="space-y-4 print:hidden">
                <p className="text-sm font-light leading-7 text-white/50">
                  Sealing your Declaration™ completes it. What you have
                  written becomes fixed evidence. You can return to
                  finish later. The door does not close.
                </p>
                <button
                  onClick={handleSeal}
                  disabled={!allFieldsFilled || sealing}
                  className="border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sealing ? 'sealing...' : 'seal my Declaration'}
                </button>
                {!allFieldsFilled && (
                  <p className="text-xs tracking-[0.1em] text-white/30">
                    Complete all 15 fields to seal your Declaration™.
                  </p>
                )}
              </div>
            )}

            {isSealed && (
              <div className="space-y-4 print:hidden">
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Carry this with you
                </p>
                <div className="flex gap-6">
                  <button
                    onClick={handlePrint}
                    className="border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
                  >
                    print
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {downloading ? 'preparing...' : 'download'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="pt-10 text-sm italic text-white/40 print:hidden">
          The door does not close. It waits.
        </p>

      </div>
    </main>
  );
}

export default function DeclarationPage() {
  return (
    <Suspense fallback={null}>
      <DeclarationContent />
    </Suspense>
  );
}