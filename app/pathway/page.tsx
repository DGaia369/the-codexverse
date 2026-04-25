'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

type ReturnRow = {
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  if (!value) return '—';
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

function formatResponse(response: string | undefined) {
  switch (response) {
    case 'general':
      return 'something is unclear, but present';
    case 'needs_clarity':
      return 'you need clarity, not more information';
    case 'resistance':
      return 'you are noticing resistance';
    default:
      return response;
  }
}

function getPathwayCTA(pathway: string | null | undefined) {
  const key = normalizePathway(pathway);

  switch (key) {
    case 'return_to_self':
      return {
        href: '/return',
        label: 'Begin Your Return',
      };
    case 'rebuild_foundation':
      return {
        href: '/foundation',
        label: 'Rebuild the Foundation',
      };
    case 'restore_rhythm':
      return {
        href: '/rhythm',
        label: 'Restore Your Rhythm',
      };
    case 'reclaim_voice':
      return {
        href: '/voice',
        label: 'Reclaim Your Voice',
      };
    case 'choose_again':
      return {
        href: '/choose-again',
        label: 'Choose Again',
      };
    case 'rise_gently':
      return {
        href: '/rise',
        label: 'Continue Gently',
      };
    case 'next_step':
      return {
        href: '/next-step',
        label: 'Take the Next Step',
      };

    case 'guided-support':
    case 'guided_support':
      return {
        href: '/guided',
        label: 'Continue with Guidance',
      };

    case 'self-directed':
    case 'self_directed':
      return {
    href: '/guided',
    label: 'Continue with Guidance',
  };  

    default:
      return {
        href: '/door',
        label: 'Return to the Door',
      };
  }
}

function PathwayContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [data, setData] = useState<ReturnRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cta = useMemo(() => getPathwayCTA(data?.pathway), [data?.pathway]);

 useEffect(() => {
  let isActive = true;

  async function loadPathway() {
    if (!sessionId) {
      if (!isActive) return;
      setError('Missing session_id in the URL.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

  const { data: rows, error: fetchError } = await supabase
  .from('returns')
  .select('*')
  .eq('session_id', sessionId);

console.log('PATHWAY sessionId:', sessionId);
console.log('PATHWAY rows raw:', rows);
console.log('PATHWAY fetchError:', fetchError);

if (!isActive) return;

if (fetchError) {
  setError(fetchError.message || 'Unable to load your pathway.');
  setLoading(false);
  return;
}

const row: ReturnRow | null = rows && rows.length > 0 ? rows[0] : null;

if (!row) {
  setError('No pathway record was found for this session.');
  setLoading(false);
  return;
}

setData(row);
setLoading(false);
  }

  loadPathway();

  return () => {
    isActive = false;
  };
}, [sessionId]);

  const doorLabel = humanize(data?.door, DOOR_LABELS);
  const pathwayLabel = humanize(data?.pathway, PATHWAY_LABELS);
  const responseLabel = humanize(data?.response_category, RESPONSE_LABELS);
  const nextInstruction =
  data?.next_instruction?.trim() ||
  `You don’t need more information.

Something is already clear.

Decide what matters now,
and take one step you will actually complete.`;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10 sm:px-8 sm:py-12">
        <div className="mb-10">
          <Link
            href={sessionId ? `/door?session_id=${encodeURIComponent(sessionId)}` : '/door'}
            className="inline-flex items-center text-sm tracking-[0.08em] text-[#6d624f] transition hover:text-[#2a2a2a]"
          >
            ← Back to Door
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center pt-0">
          {loading ? (
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

              <div className="h-12 w-52 animate-pulse rounded-full bg-[#d9c9b0]" />
            </section>
          ) : error ? (
            <section className="space-y-12">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8a7a63]">
                Pathway
              </p>

              <div className="space-y-5">
                <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
                  We couldn’t open this pathway.
                </h1>
                <p className="max-w-xl text-base leading-8 text-white/70">
                  {error}
                </p>
              </div>

              <div>
                <Link
                  href="/door"
                  className="inline-flex min-h-[48px] items-center rounded-full bg-[#b2955b] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Continue with Guidance
                </Link>
              </div>
            </section>
          ) : (
            <section className="space-y-14">
              <div className="space-y-4">
                <p className="mb-8 text-xs uppercase tracking-[0.22em] text-[#d7ba7d]">
  the codeXverse™
</p>
                <p className="text-xs uppercase tracking-[0.22em] text-[#8a7a63]">
                  Your Pathway
                </p>

                <h1 className="max-w-2xl font-serif text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
                  {pathwayLabel}
                </h1>

                <p className="max-w-xl text-lg leading-8 text-white/70">
                  This is not a dashboard. It is a direction. A gentle naming of where
                  you are, and what comes next.
                </p>
              </div>

             <div className="space-y-8">
  <div className="max-w-xl space-y-6">
    <p className="text-[1.05rem] leading-8 text-white/85">
      <span className="font-medium text-[#d7ba7d]">
        You named where you are:
      </span>{' '}
      {formatDoorLabel(doorLabel)}
    </p>

    <p className="text-[1.05rem] leading-8 text-white/85">
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
                    {nextInstruction.split('\n').filter(Boolean).map((paragraph, index) => (
                      <p
                        key={index}
                       className="max-w-xl text-[1.08rem] leading-9 text-white/85"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={sessionId ? `${cta.href}?session_id=${encodeURIComponent(sessionId)}` : cta.href}
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

export default function PathwayPage() {
  return (
    <Suspense fallback={null}>
      <PathwayContent />
    </Suspense>
  );
}