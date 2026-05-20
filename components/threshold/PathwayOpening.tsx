'use client';

import { useEffect, useRef, useState } from 'react';

interface PathwayOpeningProps {
  onComplete: () => void;
  isReturn?: boolean;
}

const LETTERS = ['B', 'R', 'E', 'A', 'T', 'H', 'E'];

export default function PathwayOpening({ onComplete, isReturn = false }: PathwayOpeningProps) {
  const [phase, setPhase] = useState<
    'dark' | 'lotus' | 'letters' | 'hold' | 'fadeout' | 'done'
  >('dark');

  const [visibleLetters, setVisibleLetters] = useState<boolean[]>(
    new Array(LETTERS.length).fill(false)
  );
  const [opacity, setOpacity] = useState(1);

  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timerRefs.current.push(t);
    return t;
  };

  useEffect(() => {
    const fast = isReturn ? 0.6 : 1;

    // Darkness holds longer — the participant arrives into stillness
    schedule(() => setPhase('lotus'), 1800 * fast);

    // Letters begin after the lotus has fully breathed in
    const lettersStart = isReturn ? 2000 : 4000;
    schedule(() => setPhase('letters'), lettersStart * fast);

    // Each letter arrives slowly, with real space between
    LETTERS.forEach((_, i) => {
      const letterDelay = lettersStart + (isReturn ? 420 : 1200) * (i + 1);
      schedule(() => {
        setVisibleLetters((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, letterDelay * fast);
    });

    // Hold after last letter — let the word sit
    const holdStart = lettersStart + (isReturn ? 420 : 800) * (LETTERS.length + 1) + 1200;
    schedule(() => setPhase('hold'), holdStart * fast);

    // Long stillness before fade — the participant breathes here
    const fadeStart = holdStart + (isReturn ? 2400 : 5000);
    schedule(() => {
      setPhase('fadeout');
      setOpacity(0);
    }, fadeStart * fast);

    // Done — reveal pathway content
    const doneStart = fadeStart + 1800;
    schedule(() => {
      setPhase('done');
      onComplete();
    }, doneStart * fast);

    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, [isReturn, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: '#080808',
        opacity,
        transition: phase === 'fadeout' ? 'opacity 1.2s ease-in-out' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Lotus background */}
<div
  style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/lotus-breathe.png)',
    backgroundSize: 'auto 80%',
    backgroundPosition: 'center 60%',
    backgroundRepeat: 'no-repeat',
    opacity: phase === 'dark' ? 0 : 1,
    transition: 'opacity 3.2s cubic-bezier(0.23, 1, 0.32, 1)',
    mixBlendMode: 'screen' as const,
  }}
/>

      {/* Radial glow over lotus center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 40% at 50% 58%, rgba(212,178,79,0.08) 0%, transparent 70%)',
          opacity: phase === 'dark' || phase === 'lotus' ? 0 : 1,
          transition: 'opacity 2s ease-in-out',
          pointerEvents: 'none',
        }}
      />

      {/* BREATHE — letters assembling */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: '0.18em',
          fontFamily: "'Garamond', 'EB Garamond', 'Georgia', serif",
          fontSize: 'clamp(1.4rem, 5vw, 2.6rem)',
          letterSpacing: '0.38em',
          color: '#d6b24f',
          textShadow: '0 0 28px rgba(214,178,79,0.55), 0 0 8px rgba(214,178,79,0.3)',
          userSelect: 'none',
        }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: visibleLetters[i] ? 1 : 0,
              transform: visibleLetters[i]
                ? 'translateY(0) translateX(0) scale(1)'
                : `translateY(${[-22, 18, -14, 20, -18, 15, -20][i]}px) translateX(${[-30, 25, -20, 35, -28, 22, -32][i]}px) scale(0.6)`,
              transition:
                'opacity 1.4s cubic-bezier(0.23,1,0.32,1), transform 1.4s cubic-bezier(0.23,1,0.32,1)',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Enter — fades in after lotus is visible, first visit only */}
      {!isReturn && (
        <button
          onClick={() => {
            timerRefs.current.forEach(clearTimeout);
            setOpacity(0);
            setTimeout(onComplete, 800);
          }}
          style={{
            position: 'absolute',
            bottom: '4%',
            right: '6%',
            background: 'none',
            border: 'none',
            color: 'rgba(214,178,79,0.35)',
            fontFamily: 'inherit',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            cursor: 'pointer',
            padding: '8px 12px',
            opacity: phase === 'dark' || phase === 'lotus' ? 0 : 0.7,
            transition: 'opacity 1s ease',
            textTransform: 'uppercase',
          }}
          aria-label="Skip opening"
        >
          enter
        </button>
      )}
    </div>
  );
}