'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer({ unlockAt }: { unlockAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    function calculate() {
      const now = Date.now();
      const unlock = new Date(unlockAt).getTime();
      const diff = unlock - now;

      if (diff <= 0) {
        setUnlocked(true);
        setTimeLeft('');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [unlockAt]);

  if (unlocked) {
    return (
      <p className="text-[#d7ba7d]/60 text-sm leading-8">
        This space is open. You may complete your return.
      </p>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      <p className="text-white/20 text-xs tracking-[0.2em] uppercase">
        This space opens in
      </p>
      <p className="text-[#d7ba7d]/50 text-2xl font-light tracking-widest">
        {timeLeft}
      </p>
    </div>
  );
}