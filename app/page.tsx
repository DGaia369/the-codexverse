'use client';

import Link from 'next/link';
import ThresholdAtmosphere from '@/components/threshold/ThresholdAtmosphere';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-5 md:px-10">
          <div>
            <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">
              the codeXverse™
            </p>
            <p className="text-xs text-white/55">
              Threshold
            </p>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-3xl space-y-10 text-center">
            <div className="space-y-1">
              <p
                className="text-2xl font-light leading-snug tracking-wide md:text-3xl"
                style={{ color: '#F4EDE0' }}
              >
                What part of your life still looks functional,
              </p>
              <p
                className="text-2xl font-light leading-snug tracking-wide md:text-3xl"
                style={{ color: '#F4EDE0' }}
              >
                but no longer feels like yours?
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-white/50">
                You do not have to explain the whole story.
              </p>
              <p className="text-sm leading-relaxed text-white/50">
                Start with the part that has become impossible to ignore.
              </p>
            </div>

            <Link
              href="/begin"
              className="inline-block text-sm tracking-[0.2em] text-[#d7ba7d] transition-opacity duration-300 hover:opacity-60"
            >
              Enter the Threshold™
            </Link>
          </div>
        </div>
      </section>

      <ThresholdAtmosphere />
    </main>
  );
}