'use client';

import { Suspense, useEffect, useState } from 'react';
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

function DeclarationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [record, setRecord] = useState<DeclarationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

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

        <div className="pt-4 space-y-4 print:hidden">
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