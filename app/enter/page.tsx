'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

type Stage = 'capture' | 'sent' | 'verify';

export default function EnterPage() {
  const [urlError, setUrlError] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<Stage>('capture');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err === 'link_expired') {
      setUrlError('That link has expired. Enter your email and we will send a fresh one.');
    }
  }, []);

  async function handleEnter() {
    const clean = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);

    if (!valid) {
      setError('That does not look like a complete address.');
      return;
    }

    setSubmitting(true);
    setError('');

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: clean,
      options: {
        shouldCreateUser: true,
      },
    });

    if (authError) {
      console.error('Supabase OTP error:', authError);
      setError(authError.message || 'Something did not go through. Try once more.');
      setSubmitting(false);
      return;
    }

    setStage('sent');
    setSubmitting(false);
  }

  async function handleVerify() {
    const clean = code.trim();

    if (clean.length < 6) {
      setError('Enter the full code from your email.');
      return;
    }

    setSubmitting(true);
    setError('');

    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: clean,
      type: 'email',
    });

    console.log('verify result:', verifyError);

    if (verifyError) {
      console.error('Supabase verify error:', verifyError);
      setError('That code did not work. Check it and try again.');
      setSubmitting(false);
      return;
    }

    window.location.href = '/begin';
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-8">
      <div className="max-w-md w-full space-y-12">

        <p className="text-xs tracking-[0.3em] text-[#d7ba7d]">
          the codeXverse™
        </p>

        {stage === 'capture' && (
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-2xl font-light leading-10 text-white/90">
                To cross this threshold,
                <br />
                leave your name in the room.
              </p>
              <p className="text-sm leading-7 text-white/40">
                A code will be sent to you.
                <br />
                Return with it and you will arrive here — as yourself.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEnter();
                }}
                placeholder="your email"
                className="w-full bg-transparent border-b border-white/20 py-3 text-base text-white/90 placeholder:text-white/25 focus:outline-none focus:border-[#d7ba7d]/60 transition-colors duration-300"
              />

              {urlError && (
                <p className="text-sm text-[#d7ba7d]/70 italic">{urlError}</p>
              )}

              {error && (
                <p className="text-sm text-[#d7ba7d]/60 italic">{error}</p>
              )}

              <button
                onClick={handleEnter}
                disabled={submitting}
                className="mt-4 text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent disabled:opacity-40"
              >
                {submitting ? 'sending...' : 'enter'}
              </button>
            </div>
          </div>
        )}

        {stage === 'sent' && (
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-2xl font-light leading-10 text-white/90">
                The door is open.
              </p>
              <p className="text-base leading-8 text-white/50">
                A code is on its way to you.
                <br /><br />
                When it arrives, bring it back here.
              </p>
              <p className="text-sm leading-7 text-white/25 italic">
                No password. No account to manage.
                <br />
                Just you, returning.
              </p>
            </div>

            <button
              onClick={() => setStage('verify')}
              className="text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent"
            >
              I have my code
            </button>
          </div>
        )}

        {stage === 'verify' && (
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-2xl font-light leading-10 text-white/90">
                You came back.
              </p>
              <p className="text-sm leading-7 text-white/40">
                Enter the code from your email.
                <br />
                You are almost inside.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify();
                }}
                placeholder="your code"
                maxLength={8}
                className="w-full bg-transparent border-b border-white/20 py-3 text-base text-white/90 placeholder:text-white/25 focus:outline-none focus:border-[#d7ba7d]/60 transition-colors duration-300 tracking-widest"
              />

              {error && (
                <p className="text-sm text-[#d7ba7d]/60 italic">{error}</p>
              )}

              <button
                onClick={handleVerify}
                disabled={submitting}
                className="mt-4 text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent disabled:opacity-40"
              >
                {submitting ? 'entering...' : 'enter'}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}