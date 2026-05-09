import { createServerSupabaseClient } from "@/utils/supabase/server";

type ReturnToSelfPageProps = {
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
        <p className="text-xs uppercase tracking-[0.3em] text-[#d7ba7d]">
          the codeXverse™
        </p>

        <h1 className="mt-6 text-4xl font-semibold">
          This pathway cannot be entered from here.
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

export default async function ReturnToSelfPage({
  searchParams,
}: ReturnToSelfPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const sessionId = params?.session_id ?? "";
  const door = params?.door ?? "";
  const pathway = params?.pathway ?? "";

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
    return <AccessBlocked message="Unable to validate this session." />;
  }

  const row: ReturnRow | null = rows && rows.length > 0 ? rows[0] : null;

  if (!row) {
    return <AccessBlocked message="This session does not exist." />;
  }

  if (!row.session_id || !row.door || !row.pathway) {
    return <AccessBlocked message="This session is missing required pathway data." />;
  }

  if (door && row.door !== door) {
    return <AccessBlocked message="Pathway access mismatch." />;
  }

  if (pathway && row.pathway !== pathway) {
    return <AccessBlocked message="Pathway access mismatch." />;
  }

  const unlockAt = row.activation_unlock_at;
  const isCompleted = row.activation_completed === true;

  if (unlockAt && !isCompleted) {
    const unlockTime = new Date(unlockAt).getTime();
    const now = Date.now();

    if (!Number.isNaN(unlockTime) && now < unlockTime) {
      return <AccessBlocked message="This pathway is locked for now." />;
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-4">
          the codeXverse™
        </p>

        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          Pathway One — Return to Self
        </h1>

        <p className="mt-6 text-white/70 text-lg leading-8">
          The first breakthrough is not complexity.
          <br />
          The first breakthrough is follow-through.
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <p className="text-[#d7ba7d] text-sm uppercase tracking-[0.25em]">
              Encounter
            </p>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xl leading-9">
                Where have you been abandoning yourself?
              </p>
            </div>
          </section>

          <section>
            <p className="text-[#d7ba7d] text-sm uppercase tracking-[0.25em]">
              Activation
            </p>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 leading-8">
                Tonight, create a quiet return space.
              </p>

              <ol className="mt-4 list-decimal pl-6 space-y-3 text-white/70 leading-7">
                <li>Put your phone away.</li>
                <li>Sit in silence or take a warm bath for 10 minutes.</li>
                <li>
                  Place one hand on your chest and ask:
                  <br />
                  <span className="text-white">
                    “What have I needed from myself that I have not been giving?”
                  </span>
                </li>
                <li>Write one truth you have been avoiding.</li>
                <li>
                  End by writing one commitment you are willing to keep for the
                  next 24 hours.
                </li>
              </ol>
            </div>
          </section>

          <section>
            <p className="text-[#d7ba7d] text-sm uppercase tracking-[0.25em]">
              Return
            </p>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/70 leading-8">
                After you complete the ritual, return and report what happened.
                This is where self-trust begins to rebuild.
              </p>

              <a
                href={`/return?session_id=${encodeURIComponent(sessionId)}`}
                className="inline-block mt-6 rounded-full bg-white text-black px-6 py-3 font-semibold hover:opacity-90"
              >
                Complete the Return
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}