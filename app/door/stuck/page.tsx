type StuckPageProps = {
  searchParams?: Promise<{
    door?: string;
    pathway?: string;
    session_id?: string;
  }>;
};

export default async function Stuck({ searchParams }: StuckPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const door = params?.door ?? "";
  const pathway = params?.pathway ?? "";
  const sessionId = params?.session_id ?? "";

  const href = sessionId
    ? `/guided?door=${encodeURIComponent(door)}&pathway=${encodeURIComponent(
        pathway
      )}&session_id=${encodeURIComponent(sessionId)}`
    : "/guided";

  return (
    <main className="min-h-screen bg-black text-white flex items-center">
      <div className="mx-auto max-w-2xl px-6">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-4">
          the codeXverse™
        </p>

        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          You’re not stuck.
          <br />
          You’re circling.
        </h1>

        <p className="mt-6 text-white/70 leading-8">
          Repeating the thought is not movement.
          <br />
          Choose one action. Then follow it through.
        </p>

        <a
          href={href}
          className="inline-block mt-10 rounded-full bg-white text-black px-6 py-3 font-semibold hover:opacity-90"
        >
          Continue with Guidance
        </a>
      </div>
    </main>
  );
}