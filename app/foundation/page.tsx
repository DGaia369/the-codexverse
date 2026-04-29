export default function FoundationPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#d7ba7d]">
          THE CODEXVERSE™
        </p>

        <p className="text-xs uppercase tracking-[0.22em] text-[#8a7a63]">
          Rebuild the Foundation
        </p>

        <h1 className="mt-6 font-serif text-5xl leading-tight">
          Start with what can hold.
        </h1>

        <p className="mt-8 text-lg leading-8 text-white/75">
          This is where you stop building on pressure, panic, or old agreements.
          The next layer requires ground.
        </p>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-[#d7ba7d]">Your only task right now:</p>

          <p className="mt-6 leading-8 text-white/80">
            Choose one thing you can stabilize today. Not everything. One thing.
            Make it simple enough to complete and honest enough to matter.
          </p>
        </div>

        <a
          href="/return"
          className="mt-10 inline-block rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10"
        >
          Return again
        </a>
      </div>
    </main>
  );
}