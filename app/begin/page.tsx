'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

type Screen = {
  id: string;
  content: string;
  screen_order: number;
  is_final_screen: boolean;
};

export default function BeginPage() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [flowNumber, setFlowNumber] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = crypto.randomUUID();
    setSessionId(id);

    async function loadFlow() {
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
      setTimeout(() => setVisible(true), 100);
    }

    loadFlow();
  }, []);

  function advance() {
    if (locked || !visible) return;
    setLocked(true);

    if (currentIndex < screens.length - 1) {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setVisible(true);
        setLocked(false);
      }, 700);
    } else {
supabase.from('participant_flows').insert({
  session_id: sessionId,
  flow_number: flowNumber,
}).then(async () => {
  await supabase.from('returns').insert({
    session_id: sessionId,
    door: 'return_to_self',
    pathway: 'return_to_self',
    response_category: 'general',
    next_instruction: null,
    status: 'active',
  });
  window.location.href = `/pathway/return-to-self?session_id=${encodeURIComponent(sessionId)}`;
});
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-black" />;
  }

  const current = screens[currentIndex];
  const isFinal = current?.is_final_screen ?? false;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-8">
      <div className="max-w-xl w-full">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            pointerEvents: locked ? 'none' : 'auto',
          }}
        >
          <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-16">
            the codeXverse™
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
        </div>
      </div>
    </main>
  );
}