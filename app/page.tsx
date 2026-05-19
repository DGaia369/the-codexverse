'use client';

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
              Return to Self
            </p>
          </div>
        </div>
      </header>

      <ThresholdAtmosphere />
    </main>
  );
}