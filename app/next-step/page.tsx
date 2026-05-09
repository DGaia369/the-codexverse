import { createServerSupabaseClient } from "@/utils/supabase/server";

type NextStepPageProps = {
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
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          the codeXverse™
        </p>

        <h1 className="mt-4 text-4xl font-semibold">
          This step cannot be entered from here.
        </h1>

        <p className="mt-6 text-white/70">{message}</p>

        <a
          href="/return"
          className="mt-8 inline-block rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
        >
          Return to the beginning
        </a>
      </div>
    </main>
  );
}

export default async function NextStepPage({ searchParams }: NextStepPageProps) {
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
      <AccessBlocked message="This session does not exist. Return to the beginning and re-enter the codeXverse™." />
    );
  }

  if (!row.session_id || !row.door || !row.pathway) {
    return (
      <AccessBlocked message="This session is missing required pathway data. Return to the Door and choose again." />
    );
  }

  if (door && row.door !== door) {
    return (
      <AccessBlocked message="This next step does not match your session. Return to the Door and continue through the correct route." />
    );
  }

  if (pathway && row.pathway !== pathway) {
    return (
      <AccessBlocked message="This next step does not match your session. Return to the Door and continue through the correct route." />
    );
  }

  const unlockAt = row.activation_unlock_at;
  const isCompleted = row.activation_completed === true;

  if (unlockAt && !isCompleted) {
    const unlockTime = new Date(unlockAt).getTime();
    const now = Date.now();

    if (!Number.isNaN(unlockTime) && now < unlockTime) {
      return (
        <AccessBlocked message="This next step is locked for now. Go live the commitment first, then return when the lock has lifted." />
      );
    }
  }

  const safeDoor = door || row.door;
  const safePathway = pathway || row.pathway;

  const backHref = sessionId
    ? `/pathway?door=${encodeURIComponent(safeDoor)}&pathway=${encodeURIComponent(
        safePathway
      )}&session_id=${encodeURIComponent(sessionId)}`
    : "/pathway";

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-white/50">
          the codeXverse™ Next Step
        </p>

        <h1 className="mt-4 text-4xl font-semibold">Take Your Next Step</h1>

        <p className="mt-6 text-white/70">
          You already know what needs attention.
        </p>

        <div className="mt-10 rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
          <p className="text-lg text-green-300">You already have traction.</p>

          <p className="mt-4 text-sm text-white/70">
            This is where you convert insight into movement, one clear step at a time.
          </p>
        </div>

        <a
          href={backHref}
          className="mt-8 inline-block rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
        >
          Back to Pathway
        </a>
      </div>
    </main>
  );
}