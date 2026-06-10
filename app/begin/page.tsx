'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Screen = {
  id: string;
  content: string;
  screen_order: number;
  is_final_screen: boolean;
};

const arrivalScreens = [
  "You found this place.\n\nThat was not an accident.",
  "There is nothing you need to do right now.\n\nJust arrive.\n\nYou belong here.",
];

export default function BeginPage() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [flowNumber, setFlowNumber] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [arrivalIndex, setArrivalIndex] = useState<number | null>(0);
  const [showSigil, setShowSigil] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        window.history.replaceState({}, '', '/begin');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/enter';
        return;
      }

      setSessionId(user.id);

      const { data: existingLoop } = await supabase
        .from('loops')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (existingLoop) {
        window.location.href = `/pathway/return-to-self?session_id=${encodeURIComponent(user.id)}`;
        return;
      }

      const { data: allFlows } = await supabase
        .from('participant_flows')
        .select('flow_number');

      const usedFlows = allFlows?.map((r) => r.flow_number) ?? [];
      const allNumbers = [1, 2, 3];
      const unused = allNumbers.filter((n) => !usedFlows.includes(n));
      const pool = unused.length > 0 ? unused : allNumbers;
      const selected = pool[Math.floor(Math.random() * pool.length)];

      setFlowNumber(selected);

      const { data: flowScreens } = await supabase
        .from('welcome_flows')
        .select('id, content, screen_order, is_final_screen')
        .eq('flow_number', selected)
        .order('screen_order', { ascending: true });

      if (flowScreens) {
        setScreens(flowScreens);
      }

      setLoading(false);
      setTimeout(() => setVisible(true), 300);
    }

    init();
  }, []);

  async function advance() {
    if (locked || !visible) return;
    setLocked(true);

    if (arrivalIndex !== null) {
      setVisible(false);
      setTimeout(() => {
        if (arrivalIndex < arrivalScreens.length - 1) {
          setArrivalIndex(arrivalIndex + 1);
          setVisible(true);
          setLocked(false);
        } else {
          setArrivalIndex(null);
          setShowSigil(true);
          setVisible(true);
          setLocked(false);
        }
      }, 700);
      return;
    }

    if (showSigil) {
      setVisible(false);
      setTimeout(() => {
        setShowSigil(false);
        setVisible(true);
        setLocked(false);
      }, 700);
      return;
    }

    if (screens.length === 0) {
  window.location.reload();
  return;
}

if (currentIndex < screens.length - 1) {
  setVisible(false);
  setTimeout(() => {
    setCurrentIndex((i) => i + 1);
    setVisible(true);
    setLocked(false);
  }, 700);
} else {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('loops').insert({
    user_id: user.id,
    pathway: 'return_to_self',
    status: 'active',
    session_id: user.id,
  });

  await supabase.from('participant_flows').insert({
    session_id: user.id,
    user_id: user.id,
    flow_number: flowNumber,
  });

  await supabase.from('returns').insert({
    session_id: user.id,
    user_id: user.id,
    door: 'return_to_self',
    pathway: 'return_to_self',
    response_category: 'general',
    next_instruction: null,
    status: 'active',
  });

  window.location.href = `/pathway/return-to-self?session_id=${encodeURIComponent(user.id)}`;
}
  }

  if (loading) {
    return <main className="min-h-screen bg-black" />;
  }

  const isInArrival = arrivalIndex !== null;
  const current = isInArrival
    ? { content: arrivalScreens[arrivalIndex!] }
    : screens[currentIndex];
  const isFinal = isInArrival ? false : (screens[currentIndex]?.is_final_screen ?? false);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-8">

      <p className="fixed bottom-6 left-0 right-0 text-center text-xs text-white/20 leading-5 px-6 z-50">
        This is not therapy. It is not a substitute for professional support.
        If you are in crisis, please reach out to a qualified professional.
      </p>

      <div className="max-w-xl w-full">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            pointerEvents: locked ? 'none' : 'auto',
          }}
        >
          {showSigil ? (
            <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
              <img
                src="/Sigil.png"
                alt=""
                onClick={advance}
                style={{
                  width: '420px',
                  mixBlendMode: 'lighten',
                  filter: 'drop-shadow(0 0 40px rgba(215, 186, 125, 0.5))',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease',
                }}
                className="hover:opacity-75"
              />
            </div>
          ) : (
            <>
              <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-16">
                the codeXverse
              </p>

              <div className="space-y-5 text-xl leading-10 text-white/88 whitespace-pre-line font-light">
                {current?.content}
              </div>

              <button
                onClick={advance}
                className="mt-16 text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent"
              >
                {isFinal ? 'I am ready' : 'continue'}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}