import { createServerSupabaseClient } from "@/utils/supabase/server";

type FoundationPageProps = {
  searchParams?: Promise<{
    door?: string;
    pathway?: string;
    session_id?: string;
  }>;
};

type ReturnRow = {
  activation_unlock_at?: string | null;
  activation_completed?: boolean | null;
  session_id: string | null;
  door: string | null;
  pathway: string | null;
};

function AccessBlocked({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#d7ba7d]">
          the CodeXverse™
        </p>

        <p className="text-xs uppercase tracking-[0.22em] text-[#8a7a63]">
          Access blocked
        </p>

        <h1 className="mt-6 font-serif text-5xl leading-tight">
          This page cannot be entered from here.
        </h1>

        <p className="mt-8 text-lg leading-8 text-white/75">
          {message}
        </p>

        <a
          href="/return"
          className="mt-10 inline-block rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10"
        >
          Return to the beginning
        </a>
      </div>
    </main>
  );
}

export default async function FoundationPage({ searchParams }: FoundationPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const door = params?.door ?? "";
  const pathway = params?.pathway ?? "";
  const sessionId = params?.session_id ?? "";

  if (!sessionId) {
    return (
      <AccessBlocked message="A valid session is required. Return to the beginning and enter through the codeXverse™ properly." />
    );
  }

  const supabase = await createServerSupabaseClient();

  const { data: rows, error } = await supabase
    .from("returns")
    .select("session_id, door, pathway, activation_completed, activation_unlock_at")
    .eq("session_id", sessionId);

  if (error) {
    return (
      <AccessBlocked message="Unable to validate this session. Return to the beginning and try again." />
    );
  }

  const row: ReturnRow | null = rows && rows.length > 0 ? rows[0] : null;

  if (!row) {
    return (
      <AccessBlocked message="This session does not exist. Return to the beginning and re-enter the CodeXverse™." />
    );
  }

  if (!row.session_id || !row.door || !row.pathway) {
    return (
      <AccessBlocked message="This session is missing required pathway data. Return to the Door and choose again." />
    );
  }

  if (door && row.door !== door) {
    return (
      <AccessBlocked message="This foundation path does not match your session. Return to the Door and continue through the correct route." />
    );
  }

  if (pathway && row.pathway !== pathway) {
    return (
      <AccessBlocked message="This foundation path does not match your session. Return to the Door and continue through the correct route." />
    );
  }

  const unlockAt = row.activation_unlock_at;
  const isCompleted = row.activation_completed === true;

  if (unlockAt && !isCompleted) {
    const unlockTime = new Date(unlockAt).getTime();
    const now = Date.now();

    if (!Number.isNaN(unlockTime) && now < unlockTime) {
      return (
        <AccessBlocked message="This foundation pathway is locked for now. Go live the commitment first, then return when the lock has lifted." />
      );
    }
  }

  const safeDoor = door || row.door;
  const safePathway = pathway || row.pathway;

  const returnHref = sessionId
    ? `/return?door=${encodeURIComponent(safeDoor)}&pathway=${encodeURIComponent(
        safePathway
      )}&session_id=${encodeURIComponent(sessionId)}`
    : "/return";

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#d7ba7d]">
          the CodeXverse™
        </p>

        <p className="text-xs uppercase tracking-[0.22em] text-[#8a7a63]">
          Rebuild the Foundation
        </p>

        <h1 className="mt-6 font-serif text-5xl leading-tight">
          Stop building on what cannot hold.
        </h1>

        <p className="mt-8 text-lg leading-8 text-white/75">
          Clarity is not enough if the ground beneath it is unstable.
          This is where you stop rushing forward and choose what can actually
          support the next version of you.
        </p>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-[#d7ba7d] text-lg">Your foundation check:</p>

          <div className="mt-6 space-y-5 leading-8 text-white/80">
            <p>What is one thing you keep trying to build on that no longer supports you?</p>
            <p>What must become simpler before it can become stronger?</p>
            <p>What one action today would create more stability, not more pressure?</p>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7a63]">
            Your only move right now
          </p>

          <p className="leading-8 text-white/80">
            Choose one stabilizing action. Complete it before adding anything new.
            The foundation is rebuilt through evidence, not intention.
          </p>
        </div>

        <a
          href={returnHref}
          className="mt-10 inline-block rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10"
        >
          Return again
        </a>
      </div>
    </main>
  );
}