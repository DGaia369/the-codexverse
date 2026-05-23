'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type ReturnRow = {
  activation_unlock_at?: string | null;
  activation_completed?: boolean | null;
  session_id: string | null;
  door: string | null;
  pathway: string | null;
  response_category: string | null;
  next_instruction: string | null;
  status?: string | null;
  action_type?: string | null;
  created_at?: string | null;
  id?: string | number | null;
};

const DOOR_LABELS: Record<string, string> = {
  worthiness: 'Worthiness',
  identity: 'Identity',
  clarity: 'Clarity',
  courage: 'Courage',
  grief: 'Grief',
  trust: 'Trust',
  voice: 'Voice',
  power: 'Power',
  rest: 'Rest',
  reinvention: 'Reinvention',
  lost: 'Disoriented',
  rebuilding: 'Rebuilding',
  inconsistent: 'Unsteady',
  stuck: 'Stuck',
};

const PATHWAY_LABELS: Record<string, string> = {
  return_to_self: 'Return to Self',
  rebuild_foundation: 'Rebuild the Foundation',
  restore_rhythm: 'Restore Your Rhythm',
  reclaim_voice: 'Reclaim Your Voice',
  choose_again: 'Choose Again',
  rise_gently: 'Rise Gently',
  next_step: 'Next Step',
  guided_support: 'Guided Support',
  self_directed: 'Self Directed',
};

const RESPONSE_LABELS: Record<string, string> = {
  overwhelmed: 'Overwhelmed',
  emotionally_tender: 'Emotionally Tender',
  ready_for_change: 'Ready for Change',
  seeking_clarity: 'Seeking Clarity',
  rebuilding: 'Rebuilding',
  grounded: 'Grounded',
  activated: 'Activated',
  general: 'Ready to Move',
  needs_clarity: 'Needs Clarity',
};

function toTitleCase(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function humanize(value: string | null | undefined, map?: Record<string, string>) {
  if (!value) return '';
  const key = value.trim().toLowerCase();
  return map?.[key] ?? toTitleCase(key);
}

function normalizePathway(value: string | null | undefined) {
  return (value || '').trim().toLowerCase().replace(/\s+/g, '_');
}

function formatDoorLabel(label: string) {
  switch (label) {
    case 'Disoriented':
      return 'feeling disoriented';
    case 'Rebuilding':
      return 'in a rebuild';
    case 'Unsteady':
      return 'feeling unsteady';
    case 'Stuck':
      return 'feeling stuck';
    default:
      return label.toLowerCase();
  }
}

function formatResponseLabel(label: string) {
  switch (label) {
    case 'Ready to Move':
      return 'something is present and ready to move';
    case 'Needs Clarity':
      return 'you need clarity, not more information';
    case 'Seeking Clarity':
      return 'clarity is trying to come through';
    case 'Emotionally Tender':
      return 'something tender is asking for care';
    case 'Overwhelmed':
      return 'you are carrying too much at once';
    default:
      return label.toLowerCase();
  }
}

function getPathwayCTA(pathway: string | null | undefined, door?: string | null) {
  const key = normalizePathway(pathway);

  if (door === 'rebuilding') {
    return { href: '/foundation', label: 'Rebuild the Foundation' };
  }

  switch (key) {
    case 'return_to_self':
      return { href: '/pathway/return-to-self', label: 'Begin Your Return' };
    case 'rebuild_foundation':
      return { href: '/foundation', label: 'Rebuild the Foundation' };
    case 'restore_rhythm':
      return { href: '/rhythm', label: 'Restore Your Rhythm' };
    case 'reclaim_voice':
      return { href: '/voice', label: 'Reclaim Your Voice' };
    case 'choose_again':
      return { href: '/choose-again', label: 'Choose Again' };
    case 'rise_gently':
      return { href: '/rise', label: 'Continue Gently' };
    case 'next_step':
      return { href: '/next-step', label: 'Take the Next Step' };
    case 'guided_support':
    case 'guided_support:':
    case 'self_directed':
    case 'self_directed:':
      return { href: '/guided', label: 'Continue with Guidance' };
    default:
      return { href: '/door', label: 'Return to the Door' };
  }
}

function PathwayInner() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get('session_id');
  const urlDoor = searchParams.get('door');
  const urlPathway = searchParams.get('pathway');

  const [data, setData] = useState<ReturnRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cta = useMemo(() => getPathwayCTA(data?.pathway, data?.door), [data?.pathway, data?.door]);

  useEffect(() => {
    let isActive = true;

    async function loadPathway() {
      const supabase = createClient();

      if (!sessionId) {
        if (!isActive) return;
        setError('This page cannot open without a valid session. Return to the beginning and enter through the codeXverse™ properly.');
        setLoading(false);
        setReady(true);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: rows, error: fetchError } = await supabase
        .from('returns')
        .select('*')
        .eq('session_id', sessionId);

      if (!isActive) return;

      if (fetchError) {
        setError(fetchError.message || 'Unable to load your pathway.');
        setLoading(false);
        setReady(true);
        return;
      }

      const row: ReturnRow | null = rows && rows.length > 0 ? rows[0] : null;

      if (!row) {
        setError('This session does not exist. Return to the beginning and re-enter the codeXverse™.');
        setLoading(false);
        setReady(true);
        return;
      }

      if (!row.door || !row.pathway || !row.session_id) {
        setError('This session is missing required pathway data. Return to the Door and choose again.');
        setLoading(false);
        setReady(true);
        return;
      }

      if (row.session_id !== sessionId) {
        setError('Session validation failed. Return to the beginning and re-enter the codeXverse™.');
        setLoading(false);
        setReady(true);
        return;
      }

      if (urlDoor && row.door !== urlDoor) {
        setError('Pathway access mismatch. Redirecting...');
        setLoading(false);
        setReady(true);
        return;
      }

      if (urlPathway && row.pathway !== urlPathway) {
        setError('Pathway access mismatch. Redirecting...');
        setLoading(false);
        return;
      }

      const unlockAt = row.activation_unlock_at;
      const isCompleted = row.activation_completed === true;

      if (unlockAt && !isCompleted) {
        const unlockTime = new Date(unlockAt).getTime();
        const now = Date.now();

        if (!Number.isNaN(unlockTime) && now < unlockTime) {
          setData(row);
          setError('This pathway is locked for now. Go live the commitment first, then return when the lock has lifted.');
          setLoading(false);
          setReady(true);
          return;
        }
      }

      setData(row);
      setLoading(false);
      setReady(true);
    }

    loadPathway();

    return () => {
      isActive = false;
    };
  }, [sessionId, urlDoor, urlPathway]);

  const doorLabel = humanize(data?.door, DOOR_LABELS);
  const pathwayLabel = humanize(data?.pathway, PATHWAY_LABELS);
  const responseLabel = humanize(data?.response_category, RESPONSE_LABELS);
  const nextInstruction =
    data?.next_instruction?.trim() ||
    `You don't need more information.

Something is already clear.

Decide what matters now,
and take one step you will actually complete.`;

  const doorReturnHref =
    sessionId && data?.door && data?.pathway
      ? `/door?door=${encodeURIComponent(data.door)}&pathway=${encodeURIComponent(data.pathway)}&session_id=${encodeURIComponent(sessionId)}`
      : '/door';

  const nextHref = sessionId
    ? `${cta.href}?session_id=${encodeURIComponent(sessionId)}`
    : cta.href;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10 sm:px-8 sm:py-12">
        <div className="mb-10">
          <Link
            href={doorReturnHref}
            className="inline-flex items-center text-sm tracking-[0.08em] text-[#d6b24f] transition hover:text-[#2a2a2a]"
          >
            ← Back to Door
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center pt-0">
          {loading || !ready ? (
            <section className="space-y-10">
              <div className="space-y-3">
                <div className="h-4 w-28 animate-pulse rounded-full bg-[#e8dfd0]" />
                <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-[#eee6d9]" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-[#eee6d9]" />
                <div className="h-4 w-11/12 animate-pulse rounded-full bg-[#eee6d9]" />
                <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#eee6d9]" />
              </div>
            </section>
          ) : error ? (
            <section className="space-y-8">
              <p className="text-sm uppercase tracking-[0.22em] text-[#d6b24f]">
                Access blocked
              </p>
              <div className="space-y-5">
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                  This pathway cannot be entered from here.
                </h1>
                <p className="max-w-xl text-[1.08rem] leading-9 text-white/80">
                  {error}
                </p>
              </div>
              <Link
                href="/return"
                className="inline-flex min-h-[52px] items-center rounded-full bg-[#b2955b] px-7 py-3 text-sm font-medium tracking-[0.04em] text-white transition hover:opacity-90"
              >
                Return to the beginning
              </Link>
            </section>
          ) : (
            <section className="space-y-10">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.22em] text-[#d6b24f]">
                  Your pathway
                </p>
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                  {pathwayLabel}
                </h1>
              </div>
              <div className="space-y-6">
                <p className="max-w-xl text-[1.08rem] leading-9 text-white/85">
                  You named where you are:{' '}
                  <span className="font-medium text-[#d7ba7d]">
                    {formatDoorLabel(doorLabel)}
                  </span>
                  .
                </p>
                <p className="max-w-xl text-[1.08rem] leading-9 text-white/85">
                  <span className="font-medium text-[#d7ba7d]">
                    What surfaced:
                  </span>{' '}
                  {formatResponseLabel(responseLabel)}
                </p>
              </div>
              <div className="max-w-xl space-y-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/45">
                  Your next instruction
                </p>
                <div className="space-y-5">
                  {nextInstruction
                    .split('\n')
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="max-w-xl text-[1.08rem] leading-9 text-white/85"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href={nextHref}
                  className="inline-flex min-h-[52px] items-center rounded-full bg-[#b2955b] px-7 py-3 text-sm font-medium tracking-[0.04em] text-white transition hover:opacity-90"
                >
                  {cta.label}
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default function PathwayContent() {
  return (
    <Suspense fallback={null}>
      <PathwayInner />
    </Suspense>
  );
}