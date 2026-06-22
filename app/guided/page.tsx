'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

type ReturnRow = {
  activation_unlock_at?: string | null;
  activation_completed?: boolean | null;
  session_id: string | null;
  door: string | null;
  pathway: string | null;
};

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
}

function AccessBlocked({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white sm:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[#d7ba7d]">
          the codeXverse™
        </p>

        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">
            Access blocked
          </p>

          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            This guidance cannot be entered from here.
          </h1>

          <p className="text-lg leading-8 text-white/75">{message}</p>
        </div>

        <Link
          href="/return"
          className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white/10"
        >
          Return to the beginning
        </Link>
      </div>
    </main>
  );
}

function GuidedContent() {
  const searchParams = useSearchParams();

  const door = searchParams.get('door');
  const pathway = searchParams.get('pathway');
  const sessionId = searchParams.get('session_id');

  const [row, setRow] = useState<ReturnRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function validateSession() {
      if (!sessionId) {
        if (!isActive) return;
        setError(
          'A valid session is required. Return to the beginning and enter through the codeXverse™ properly.'
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const supabase = getSupabaseClient();

      const { data: rows, error: fetchError } = await supabase
        .from('returns')
        .select('session_id, door, pathway, activation_completed, activation_unlock_at')
        .eq('session_id', sessionId);

      if (!isActive) return;

      if (fetchError) {
        setError('Unable to validate this session. Return to the beginning and try again.');
        setLoading(false);
        return;
      }

      const returnRow: ReturnRow | null = rows && rows.length > 0 ? rows[0] : null;

      if (!returnRow) {
        setError('This session does not exist. Return to the beginning and re-enter the codeXverse™.');
        setLoading(false);
        return;
      }

      if (!returnRow.session_id || !returnRow.door || !returnRow.pathway) {
        setError('This session is missing required pathway data. Return to the Door and choose again.');
        setLoading(false);
        return;
      }

      if (door && returnRow.door !== door) {
        setError('This guidance path does not match your session. Return to the Door and continue through the correct route.');
        setLoading(false);
        return;
      }

      if (pathway && returnRow.pathway !== pathway) {
        setError('This guidance path does not match your session. Return to the Door and continue through the correct route.');
        setLoading(false);
        return;
      }

      const unlockAt = returnRow.activation_unlock_at;
      const isCompleted = returnRow.activation_completed === true;

      if (unlockAt && !isCompleted) {
        const unlockTime = new Date(unlockAt).getTime();
        const now = Date.now();

        if (!Number.isNaN(unlockTime) && now < unlockTime) {
          setError(
            'This guidance path is locked for now. Go live the commitment first, then return when the lock has lifted.'
          );
          setLoading(false);
          return;
        }
      }

      setRow(returnRow);
      setLoading(false);
    }

    validateSession();

    return () => {
      isActive = false;
    };
  }, [door, pathway, sessionId]);

  const safeDoor = door || row?.door || '';
  const safePathway = pathway || row?.pathway || '';

  const returnHref =
    sessionId && safeDoor && safePathway
      ? `/pathway?door=${encodeURIComponent(safeDoor)}&pathway=${encodeURIComponent(
          safePathway
        )}&session_id=${encodeURIComponent(sessionId)}`
      : '/pathway';

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/20" />
          <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
        </div>
      </main>
    );
  }

  if (error) {
    return <AccessBlocked message={error} />;
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white sm:px-8">
      <div className="mx-auto max-w-2xl space-y-14">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#d7ba7d]">
            the codeXverse™
          </p>

          <div className="mt-16 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">
              Guided Support
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              You are not meant to hold this alone.
            </h1>

            <p className="max-w-xl text-lg leading-8 text-white/75">
              For the next 24 hours, do less forcing and more listening.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-xl leading-9 text-[#d7ba7d]">
            Stay with what surfaced.
          </p>

          <div className="mt-5 space-y-4 text-base leading-8 text-white/80">
            <p>Do not rush to solve it.</p>
            <p>Do not talk yourself out of what you now know.</p>
            <p>
              Do not reduce this moment just because it asks something real of
              you.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">
            Your only job right now
          </p>

          <ul className="space-y-3 text-base leading-8 text-white/80">
            <li>Slow your pace.</li>
            <li>Honor what became clear.</li>
            <li>Take one gentle next step.</li>
          </ul>
        </div>

        <div>
          <Link
            href={returnHref}
            className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white/10"
          >
            Recalibrate
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function GuidedPage() {
  return (
    <Suspense fallback={null}>
      <GuidedContent />
    </Suspense>
  );
}