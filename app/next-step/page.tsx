type NextStepPageProps = {
  searchParams?: Promise<{
    door?: string;
    pathway?: string;
    session_id?: string;
  }>;
};

export default async function NextStepPage({ searchParams }: NextStepPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const door = params?.door ?? "";
  const pathway = params?.pathway ?? "";
  const sessionId = params?.session_id ?? "";

  const backHref = sessionId
    ? `/pathway?door=${encodeURIComponent(door)}&pathway=${encodeURIComponent(
        pathway
      )}&session_id=${encodeURIComponent(sessionId)}`
    : "/pathway";

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-white/50">
          CodeXverse Next Step
        </p>

        <h1 className="mt-4 text-4xl font-semibold">Take Your Next Step</h1>

        <p className="mt-6 text-white/70">
          Clarity is only useful if you move with it.
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