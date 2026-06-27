'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  findNoticingByKey,
  findRecognitionByKey,
  findCompletionByKey,
} from '@/utils/agreementVariants';

type Stage =
  | 'loading'
  | 'arrival'
  | 'noticing'
  | 'recognition'
  | 'reflection'
  | 'release'
  | 'choosing'
  | 'complete';

type AgreementRecord = {
  id: string;
  email: string | null;
  session_id: string | null;
  source: string | null;
  door: string | null;
  pathway: string | null;
  no_longer_in_agreement_with: string | null;
  chosen_agreement: string | null;
  noticing_variant: string | null;
  recognition_variant: string | null;
  completion_variant: string | null;
  status: string;
};

function AgreementContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const door = searchParams.get('door');
  const pathway = searchParams.get('pathway');
  const source = searchParams.get('source') ?? searchParams.get('from');

  const [record, setRecord] = useState<AgreementRecord | null>(null);
  const [stage, setStage] = useState<Stage>('loading');
  const [visible, setVisible] = useState(true);
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  const [noLongerAgree, setNoLongerAgree] = useState('');
  const [choosingNow, setChoosingNow] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadOrCreate() {
      if (!sessionId) {
        if (!isActive) return;
        setStage('arrival');
        return;
      }

      try {
        const getResponse = await fetch(
          `/api/agreement?session_id=${encodeURIComponent(sessionId)}`
        );
        const getData = await getResponse.json();

        if (!isActive) return;

        let activeRecord: AgreementRecord | null = getData?.record ?? null;

        if (!activeRecord) {
          const postResponse = await fetch('/api/agreement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              door,
              pathway,
              source,
            }),
          });

          const postData = await postResponse.json();

          if (!isActive) return;

          activeRecord = postData?.record ?? null;
        }

        if (!activeRecord) {
          setStage('arrival');
          return;
        }

        setRecord(activeRecord);
        setNoLongerAgree(activeRecord.no_longer_in_agreement_with ?? '');
        setChoosingNow(activeRecord.chosen_agreement ?? '');

        if (activeRecord.status === 'completed') {
          setStage('complete');
        } else {
          setStage('arrival');
        }
      } catch (err) {
        console.error('Agreement load/create error:', err);
        if (isActive) setStage('arrival');
      }
    }

    loadOrCreate();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  function advance(next: Stage) {
    if (locked) return;

    setLocked(true);
    setVisible(false);

    setTimeout(() => {
      setStage(next);
      setVisible(true);
      setLocked(false);
    }, 600);
  }

  async function saveAnswer(
    field: 'no_longer_in_agreement_with' | 'chosen_agreement',
    value: string
  ) {
    if (!sessionId) return;

    setSaving(true);

    try {
      await fetch('/api/agreement', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          [field]: value,
        }),
      });
    } catch (err) {
      console.error('Agreement save error:', err);
    } finally {
      setSaving(false);
    }
  }

  async function completeAgreement() {
    if (!sessionId) return;

    setSaving(true);

    try {
      const response = await fetch('/api/agreement', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          no_longer_in_agreement_with: noLongerAgree,
          chosen_agreement: choosingNow,
          complete: true,
        }),
      });

      const data = await response.json();

      if (data?.record) {
        setRecord(data.record);
      }
    } catch (err) {
      console.error('Agreement completion error:', err);
    } finally {
      setSaving(false);
    }
  }

  const noticing = findNoticingByKey(record?.noticing_variant);
  const recognition = findRecognitionByKey(record?.recognition_variant);
  const completion = findCompletionByKey(record?.completion_variant);

  if (stage === 'loading') {
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-6 py-24 text-white md:px-10">
        <div className="mx-auto w-full max-w-2xl pt-16">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] px-6 py-24 text-white md:px-10">
      <header className="fixed left-0 right-0 top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-5 md:px-10">
          <div>
            <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">
              the codeXverse™
            </p>
            <p className="text-xs text-white/55">
              Pathway Two™: the Agreement™
            </p>
          </div>
        </div>
      </header>

      <div
        className="mx-auto w-full max-w-2xl pt-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          pointerEvents: locked ? 'none' : 'auto',
        }}
      >
        {stage === 'arrival' && (
          <div className="space-y-10">
            <p className="text-xl font-light leading-9 text-white/85">
              You are here again.
            </p>

            <p className="text-xl font-light leading-9 text-white/85">
              Not because you failed to finish something.
            </p>

            <p className="text-xl font-light leading-9 text-white/85">
              Because something in you was ready for the next door.
            </p>

            <button
              onClick={() => advance('noticing')}
              className="mt-12 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'noticing' && (
          <div className="space-y-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              The Noticing
            </p>

            {noticing.lines.map((line, i) => (
              <p key={i} className="text-xl font-light leading-9 text-white/85">
                {line}
              </p>
            ))}

            <button
              onClick={() => advance('recognition')}
              className="mt-12 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'recognition' && (
          <div className="space-y-10">
            {recognition.lines.map((line, i) => (
              <p key={i} className="text-xl font-light leading-9 text-white/85">
                {line}
              </p>
            ))}

            <button
              onClick={() => advance('reflection')}
              className="mt-12 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'reflection' && (
          <div className="space-y-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              Before you write anything
            </p>

            <p className="text-xl font-light leading-9 text-white/85">
              Sit with this for a moment.
            </p>

            <p className="text-xl font-light leading-9 text-white/85">
              Where in your life have you been keeping an agreement you never
              actually chose?
            </p>

            <p className="text-lg font-light leading-8 text-white/55">
              Do not answer quickly. Let it surface on its own.
            </p>

            <button
              onClick={() => advance('release')}
              className="mt-12 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80"
            >
              I am ready to name it
            </button>
          </div>
        )}

        {stage === 'release' && (
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              What you are no longer in agreement with
            </p>

            <p className="text-lg font-light leading-8 text-white/75">
              Name it in your own words. Nothing here is graded or judged.
            </p>

            <textarea
              value={noLongerAgree}
              onChange={(e) => setNoLongerAgree(e.target.value)}
              onBlur={() =>
                saveAnswer('no_longer_in_agreement_with', noLongerAgree)
              }
              rows={5}
              placeholder="I am no longer in agreement with..."
              className="w-full rounded-2xl border border-white/15 bg-white/5 p-5 text-lg font-light leading-8 text-white placeholder:text-white/30 focus:border-[#d7ba7d]/50 focus:outline-none"
            />

            <button
              onClick={async () => {
                await saveAnswer('no_longer_in_agreement_with', noLongerAgree);
                advance('choosing');
              }}
              disabled={noLongerAgree.trim().length === 0 || saving}
              className="mt-6 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80 disabled:cursor-not-allowed disabled:opacity-30"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'choosing' && (
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              The agreement you are choosing now
            </p>

            <p className="text-lg font-light leading-8 text-white/75">
              Not the one you think you should write. The one that is actually
              true for you, starting now.
            </p>

            <textarea
              value={choosingNow}
              onChange={(e) => setChoosingNow(e.target.value)}
              onBlur={() => saveAnswer('chosen_agreement', choosingNow)}
              rows={5}
              placeholder="From this point forward, I agree to..."
              className="w-full rounded-2xl border border-white/15 bg-white/5 p-5 text-lg font-light leading-8 text-white placeholder:text-white/30 focus:border-[#d7ba7d]/50 focus:outline-none"
            />

            <button
              onClick={async () => {
                await completeAgreement();
                advance('complete');
              }}
              disabled={choosingNow.trim().length === 0 || saving}
              className="mt-6 border-b border-[#d7ba7d]/30 bg-transparent pb-1 text-sm tracking-[0.2em] text-[#f3dfaa] transition-all duration-300 hover:border-[#d7ba7d]/80 disabled:cursor-not-allowed disabled:opacity-30"
            >
              continue
            </button>
          </div>
        )}

        {stage === 'complete' && (
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
              the Agreement™
            </p>

            <p className="text-xl font-light leading-9 text-white/85">
              Agreement recorded.
            </p>

            <p className="text-xl font-light leading-9 text-white/85">
              You named what you are no longer carrying.
            </p>

            {noLongerAgree.trim().length > 0 && (
              <p className="border-l border-[#d7ba7d]/30 pl-5 text-lg italic leading-8 text-[#d7ba7d]">
                &quot;{noLongerAgree.trim()}&quot;
              </p>
            )}

            <p className="text-xl font-light leading-9 text-white/85">
              You named what you are choosing now.
            </p>

            {choosingNow.trim().length > 0 && (
              <p className="border-l border-[#d7ba7d]/30 pl-5 text-lg italic leading-8 text-[#d7ba7d]">
                &quot;{choosingNow.trim()}&quot;
              </p>
            )}

            {completion.lines.map((line, i) => (
              <p
                key={i}
                className="pt-2 text-xl font-light leading-9 text-white/85"
              >
                {line}
              </p>
            ))}

            <p className="pt-10 text-sm italic text-white/40">
              The door does not close. It waits.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TierTwoPage() {
  return (
    <Suspense fallback={null}>
      <AgreementContent />
    </Suspense>
  );
}