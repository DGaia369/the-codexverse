type ReturnCompletePageProps = {
  searchParams?: Promise<{
    door?: string;
    pathway?: string;
    session_id?: string;
  }>;
};

function ExperienceHeader({ label }: { label: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-5 md:px-10">
        <div>
          <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">
            the codeXverse™
          </p>
          <p className="text-xs text-white/55">{label}</p>
        </div>
      </div>
    </header>
  );
}

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
      <ExperienceHeader label="Return Complete" />

      <div className="mx-auto max-w-2xl px-6">
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