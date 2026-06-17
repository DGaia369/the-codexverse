'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Fragment = {
  id: string;
  register: string;
  fragment_text: string;
};

type Phase = 'loading' | 'fragments' | 'witness' | 'breath' | 'final';

const REGISTER_ORDER = ['flutter', 'visceral', 'ghost', 'cracking'];

const WITNESS_SEQUENCE = [
  'The feeling arrived before the words.',
  'The fact that you cannot name it does not mean it isn’t real.',
  'It has been with you longer than you realized.',
  'You are closer to it than you think.',
  'the Thing you thought you knew.',
];

const BREATH_PAUSE = 'Before you answer,\n\ntake one quiet breath\nas yourself.';

export default function ThresholdAtmosphere() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [fragmentIndex, setFragmentIndex] = useState(0);
  const [witnessIndex, setWitnessIndex] = useState(0);

  useEffect(() => {
    async function init() {
      let orderedFragments: Fragment[] = [];

      try {
        const supabase = createClient();

        const { data: rawFragments } = await supabase
          .from('recognition_fragments')
          .select('id, register, fragment_text')
          .eq('is_active', true)
          .limit(100);

        if (rawFragments && rawFragments.length > 0) {
          const byRegister: Record<string, Fragment[]> = {};

          for (const fragment of rawFragments) {
            if (!byRegister[fragment.register]) {
              byRegister[fragment.register] = [];
            }

            byRegister[fragment.register].push(fragment);
          }

          for (const register of REGISTER_ORDER) {
            const pool = byRegister[register];

            if (pool && pool.length > 0) {
              const picked = pool[Math.floor(Math.random() * pool.length)];
              orderedFragments.push(picked);
            }
          }
        }
      } catch {
        orderedFragments = [];
      }

      if (orderedFragments.length > 0) {
        setFragments(orderedFragments);
        setPhase('fragments');
      } else {
        setPhase('witness');
      }

      setTimeout(() => setVisible(true), 300);
    }

    init();
  }, []);

  function advance() {
    if (locked || !visible) return;

    setLocked(true);
    setVisible(false);

    setTimeout(() => {
      if (phase === 'fragments') {
        if (fragmentIndex < fragments.length - 1) {
          setFragmentIndex((current) => current + 1);
        } else {
          setWitnessIndex(0);
          setPhase('witness');
        }
      } else if (phase === 'witness') {
        if (witnessIndex < WITNESS_SEQUENCE.length - 1) {
          setWitnessIndex((current) => current + 1);
        } else {
          setPhase('breath');
        }
      } else if (phase === 'breath') {
        setPhase('final');
      }

      setVisible(true);
      setLocked(false);
    }, 700);
  }

  if (phase === 'loading') {
    return <section className="min-h-screen bg-black" />;
  }

  const currentContent =
    phase === 'fragments'
      ? fragments[fragmentIndex]?.fragment_text
      : phase === 'witness'
        ? WITNESS_SEQUENCE[witnessIndex]
        : phase === 'breath'
          ? BREATH_PAUSE
          : null;

  return (
    <section className="relative flex min-h-screen items-center bg-[#0a0a0f] px-6 py-24 text-white md:px-10">
      <p className="fixed bottom-6 left-0 right-0 text-center text-xs text-white/20 leading-5 px-6 z-50">
        This is not therapy. It is not a substitute for professional support.
        If you are in crisis, please reach out to a qualified professional.
      </p>

      <div
        className="mx-auto w-full max-w-5xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          pointerEvents: locked ? 'none' : 'auto',
        }}
      >
        {phase === 'final' ? (
          <div className="space-y-8">
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              Something in you already knows.
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
              Not everything. Not the full answer. But enough to feel where
              something has been off.
            </p>

            <div className="pt-8">
              <a
                href="/enter"
                className="text-sm tracking-[0.2em] text-[#f3dfaa] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300"
              >
                Shall we begin
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-5 whitespace-pre-line text-xl font-light leading-10 text-white/88">
              {currentContent}
            </div>

            <button
              onClick={advance}
              className="mt-16 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              continue
            </button>
          </>
        )}
      </div>
    </section>
  );
}