type ReturnCompletePageProps = {
  searchParams?: Promise<{
    door?: string;
    pathway?: string;
    session_id?: string;
  }>;
};

export default async function ReturnCompletePage({
  searchParams,
}: ReturnCompletePageProps) {
  const params = searchParams ? await searchParams : undefined;

  const door = params?.door ?? "";
  const pathway = params?.pathway ?? "";
  const sessionId = params?.session_id ?? "";

  const href = sessionId
    ? `/door?door=${encodeURIComponent(door)}&pathway=${encodeURIComponent(
        pathway
      )}&session_id=${encodeURIComponent(sessionId)}`
    : "/door";

  return (
    <main className="min-h-screen bg-black text-white flex items-center">
      <div className="mx-auto max-w-2xl px-6">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-4">
          the codeXverse™
        </p>

        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          Return complete.
          <br />
          Evidence has been recorded.
        </h1>

        <p className="mt-6 text-white/70 leading-8">
          You did not just answer questions.
          <br />
          You created proof that something shifted.
        </p>

        <a
          href={href}
          className="inline-block mt-10 rounded-full bg-white text-black px-6 py-3 font-semibold hover:opacity-90"
        >
          Continue to the Door
        </a>
      </div>
    </main>
  );
}