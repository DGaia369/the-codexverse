'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BODY_COLOR, CREAM, GOLD_SOFT, ctaStyle } from '@/components/public/PublicProse';

// Waitlist interaction for the public Pathway Two™: ReMEMBER™ card only
// (Launch Sprint 2, Part A). Founder-approved V1 copy, reproduced exactly.
// The two error lines are existing /enter copy, reused rather than invented.
//
// The form posts only { email, placement }. Interest and source are decided
// by the server (utils/waitlist.ts). Joining the waitlist grants nothing.

type Stage = 'collapsed' | 'expanded' | 'done';

const ERROR_COPY = {
  invalid_email: 'That does not look like a complete address.',
  generic: 'Something did not go through. Try once more.',
} as const;

const lineStyle: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: 1.8,
  color: BODY_COLOR,
  margin: 0,
};

export default function RememberWaitlist() {
  const [stage, setStage] = useState<Stage>('collapsed');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Guards against a second request before React re-renders the disabled
  // button (fast double-click, Enter held down).
  const inFlight = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === 'expanded') inputRef.current?.focus();
    if (stage === 'done') doneRef.current?.focus();
  }, [stage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    if (!email.trim()) {
      setError(ERROR_COPY.invalid_email);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, placement: 'pathways-remember-card' }),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok: boolean; error?: string }
        | null;

      if (response.ok && result?.ok) {
        setStage('done');
        return;
      }

      setError(
        result?.error === 'invalid_email' ? ERROR_COPY.invalid_email : ERROR_COPY.generic
      );
    } catch {
      setError(ERROR_COPY.generic);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (stage === 'done') {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        style={{ marginTop: '28px', outline: 'none' }}
      >
        <p style={{ ...lineStyle, color: CREAM }}>You’re on the list.</p>
        <p style={lineStyle}>When this passage opens, I’ll let you know.</p>
      </div>
    );
  }

  if (stage === 'collapsed') {
    return (
      <div style={{ marginTop: '28px' }}>
        <button
          type="button"
          aria-expanded="false"
          aria-controls="remember-waitlist-form"
          onClick={() => setStage('expanded')}
          style={{ ...ctaStyle, background: 'transparent', cursor: 'pointer' }}
        >
          LET ME KNOW WHEN IT OPENS
        </button>
      </div>
    );
  }

  return (
    <form
      id="remember-waitlist-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={submitting}
      style={{ marginTop: '28px' }}
    >
      <p style={lineStyle}>ReMEMBER™ isn’t open yet.</p>
      <p style={{ ...lineStyle, margin: '0 0 20px' }}>
        Leave your email and I’ll let you know when this passage opens.
      </p>

      <label
        htmlFor="remember-waitlist-email"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        your email
      </label>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          ref={inputRef}
          id="remember-waitlist-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={320}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="your email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'remember-waitlist-error' : undefined}
          style={{
            flex: '1 1 220px',
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(215,186,125,0.3)',
            padding: '10px 0',
            fontSize: '16px',
            color: CREAM,
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            ...ctaStyle,
            background: 'transparent',
            cursor: submitting ? 'default' : 'pointer',
            opacity: submitting ? 0.5 : 1,
          }}
        >
          let me know
        </button>
      </div>

      <p
        id="remember-waitlist-error"
        role="alert"
        style={{
          fontSize: '14px',
          fontStyle: 'italic',
          color: GOLD_SOFT,
          margin: error ? '14px 0 0' : 0,
          minHeight: 0,
        }}
      >
        {error}
      </p>
    </form>
  );
}
