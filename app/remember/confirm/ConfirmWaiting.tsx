'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { commerceButtonClass } from '../CommerceFrame';

// Bounded wait for the verified webhook (Launch Sprint 2). Polls
// /api/remember/access, which answers only { authorized }. When access is
// confirmed, the browser goes to /remember, where authorization runs again.
// After MAX_ATTEMPTS the polling stops and a manual check remains. Nothing
// here grants or assumes access. Copy is Founder-approved V1 (2026-09-28).

const INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 10;

export default function ConfirmWaiting() {
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);
  const inFlight = useRef(false);

  const check = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setChecking(true);

    try {
      const response = await fetch('/api/remember/access', { cache: 'no-store' });
      const result = (await response.json().catch(() => null)) as
        | { authorized?: boolean }
        | null;
      if (result?.authorized === true) {
        window.location.href = '/remember';
        return;
      }
    } catch {
      // Treated as "not yet". The next attempt or a manual check retries.
    } finally {
      inFlight.current = false;
      setChecking(false);
      setAttempts((n) => n + 1);
    }
  }, []);

  const waiting = attempts < MAX_ATTEMPTS;

  useEffect(() => {
    if (!waiting) return;
    const timer = window.setTimeout(check, INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [attempts, waiting, check]);

  return (
    <div role="status" aria-live="polite">
      <div className="space-y-5 text-lg leading-9 text-white/85">
        <p>Your payment is complete.</p>
        <p className="text-white/60">
          {waiting
            ? 'ReMEMBER™ is being opened for you. This usually takes a few seconds.'
            : 'This is taking a little longer than usual. Check again in a moment.'}
        </p>
      </div>

      {!waiting && (
        <div className="mt-12">
          <button
            type="button"
            onClick={check}
            disabled={checking}
            className={commerceButtonClass}
          >
            check again
          </button>
        </div>
      )}
    </div>
  );
}
