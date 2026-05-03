type LostPageProps = {
  searchParams?: Promise<{
    door?: string;
    pathway?: string;
    session_id?: string;
  }>;
};

export default async function Lost({ searchParams }: LostPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const door = params?.door ?? "";
  const pathway = params?.pathway ?? "";
  const sessionId = params?.session_id ?? "";

  const pathwayHref = sessionId
    ? `/pathway/return-to-self?door=${encodeURIComponent(door)}&pathway=${encodeURIComponent(
        pathway
      )}&session_id=${encodeURIComponent(sessionId)}`
    : "/pathway/return-to-self";

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center">
      <div className="mx-auto max-w-2xl px-6">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-4">
          the codeXverse™
        </p>

        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          You didn’t lose yourself.
          <br />
          You stopped returning.
        </h1>

        <p className="mt-6 text-white/70 leading-8">
          This isn’t about finding who you were.
          <br />
          It’s about proving you can come back.
        </p>

        <a
          href={pathwayHref}
          className="inline-block mt-10 rounded-full bg-white text-black px-6 py-3 font-semibold hover:opacity-90"
        >
          Enter Pathway One
        </a>
      </div>
    </main>
  );
}