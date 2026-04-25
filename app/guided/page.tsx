'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function GuidedContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white sm:px-8">
      <div className="mx-auto max-w-2xl space-y-14">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#d7ba7d]">
            THE CODEXVERSE™
          </p>

          <div className="mt-16 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">
              Guided Support
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              You are not meant to hold this alone.
            </h1>

            <p className="max-w-xl text-lg leading-8 text-white/75">
              For the next 24 hours, do less forcing and more listening.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-xl leading-9 text-[#d7ba7d]">
            Stay with what surfaced.
          </p>

          <div className="mt-5 space-y-4 text-base leading-8 text-white/80">
            <p>Do not rush to solve it.</p>
            <p>Do not talk yourself out of what you now know.</p>
            <p>
              Do not reduce this moment just because it asks something real of
              you.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">
            Your only job right now
          </p>

          <ul className="space-y-3 text-base leading-8 text-white/80">
            <li>Slow your pace.</li>
            <li>Honor what became clear.</li>
            <li>Take one gentle next step.</li>
          </ul>
        </div>

        <div>
          <Link
            href={sessionId ? `/pathway?session_id=${encodeURIComponent(sessionId)}` : '/pathway'}
            className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white/10"
          >
            Recalibrate
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function GuidedPage() {
  return (
    <Suspense fallback={null}>
      <GuidedContent />
    </Suspense>
  );
}