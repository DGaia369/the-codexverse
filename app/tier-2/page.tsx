'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Stage =
  | 'arrival'
  | 'noticing'
  | 'recognition'
  | 'reflection'
  | 'release'
  | 'choosing'
  | 'complete';

function AgreementContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const door = searchParams.get('door');

  const [stage, setStage] = useState<Stage>('arrival');
  const [visible, setVisible] = useState(true);
  const [locked, setLocked] = useState(false);

  const [noLongerAgree, setNoLongerAgree] = useState('');
  const [choosingNow, setChoosingNow] = useState('');

  function advance(next: Stage) {
    if (locked) return;
    setLocked(true);
    setVisible(false);

    setTimeout(() => {
      setStage(next);
      setVisible(true);
      setLocked(false);
    }, 600);
  }

  const returnHref =
    sessionId && door
      ? `/return-complete?door=${encodeURIComponent(door)}&pathway=the_agreement&session_id=${encodeURIComponent(sessionId)}`
      : '/return-complete';

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] px-6 py-24 text-white md:px-10">
      <header className="fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-5 md:px-10">
          <div>
            <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">
              the codeXverse™
            </p>
            <p className="text-xs text-white/55">
              Pathway Two™: the Agreement™
            </p>
          </div>
        </div>
      </header>

      <div
        className="mx-auto w-full max-w-2xl pt-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          pointerEvents: locked ? 'none' : 'auto',
        }}
      >
        {stage === 'arrival' && (
          <div className="space-y-10">
            <p className="text-xl font-light leading-9 text-white/85">
              You are here again.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              Not because you failed to finish something.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              Because something in you was ready for the next door.
            </p>
            <button
              onClick={() => advance('noticing')}
              className="mt-12 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'noticing' && (
          <div className="space-y-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              The Noticing
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              Every choice you make answers to an agreement.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              Most of those agreements were never spoken out loud.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              The Noticing is the moment you see which agreement is asking
              for your yes.
            </p>
            <button
              onClick={() => advance('recognition')}
              className="mt-12 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'recognition' && (
          <div className="space-y-10">
            <p className="text-xl font-light leading-9 text-white/85">
              Agreement is authorship.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              Somewhere, you agreed to carry something that was never yours
              to carry.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              You did not see it as an agreement at the time. It felt like
              love, or duty, or survival.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              It was still an agreement. And agreements can be rewritten.
            </p>
            <button
              onClick={() => advance('reflection')}
              className="mt-12 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'reflection' && (
          <div className="space-y-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              Before you write anything
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              Sit with this for a moment.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              Where in your life have you been keeping an agreement you
              never actually chose?
            </p>
            <p className="text-lg font-light leading-8 text-white/55">
              Do not answer quickly. Let it surface on its own.
            </p>
            <button
              onClick={() => advance('release')}
              className="mt-12 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              I am ready to name it
            </button>
          </div>
        )}

        {stage === 'release' && (
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              What you are no longer in agreement with
            </p>
            <p className="text-lg font-light leading-8 text-white/75">
              Name it in your own words. Nothing here is graded or judged.
            </p>
            <textarea
              value={noLongerAgree}
              onChange={(e) => setNoLongerAgree(e.target.value)}
              rows={5}
              placeholder="I am no longer in agreement with..."
              className="w-full rounded-2xl border border-white/15 bg-white/5 p-5 text-lg font-light leading-8 text-white placeholder:text-white/30 focus:border-[#d7ba7d]/50 focus:outline-none"
            />
            <button
              onClick={() => advance('choosing')}
              disabled={noLongerAgree.trim().length === 0}
              className="mt-6 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80 disabled:cursor-not-allowed disabled:opacity-30"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'choosing' && (
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              The agreement you are choosing now
            </p>
            <p className="text-lg font-light leading-8 text-white/75">
              Not the one you think you should write. The one that is
              actually true for you, starting now.
            </p>
            <textarea
              value={choosingNow}
              onChange={(e) => setChoosingNow(e.target.value)}
              rows={5}
              placeholder="From this point forward, I agree to..."
              className="w-full rounded-2xl border border-white/15 bg-white/5 p-5 text-lg font-light leading-8 text-white placeholder:text-white/30 focus:border-[#d7ba7d]/50 focus:outline-none"
            />
            <button
              onClick={() => advance('complete')}
              disabled={choosingNow.trim().length === 0}
              className="mt-6 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80 disabled:cursor-not-allowed disabled:opacity-30"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'complete' && (
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              the Agreement™
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              You named what you are no longer carrying.
            </p>
            {noLongerAgree.trim().length > 0 && (
              <p className="border-l border-[#d7ba7d]/30 pl-5 text-lg italic leading-8 text-[#d7ba7d]">
                "{noLongerAgree.trim()}"
              </p>
            )}
            <p className="text-xl font-light leading-9 text-white/85">
              And you named what you are choosing now.
            </p>
            {choosingNow.trim().length > 0 && (
              <p className="border-l border-[#d7ba7d]/30 pl-5 text-lg italic leading-8 text-[#d7ba7d]">
                "{choosingNow.trim()}"
              </p>
            )}
            <p className="pt-6 text-xl font-light leading-9 text-white/85">
              This agreement does not need to be perfect.
            </p>
            <p className="text-xl font-light leading-9 text-white/85">
              It only needs to be yours.
            </p>
            <p className="pt-10 text-sm italic text-white/40">
              The door does not close. It waits.
            </p>
            <div className="pt-8">
              <a
                href={returnHref}
                className="inline-block border-b border-[#d7ba7d]/30 pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
              >
                hold this for now
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TierTwoPage() {
  return (
    <Suspense fallback={null}>
      <AgreementContent />
    </Suspense>
  );
}