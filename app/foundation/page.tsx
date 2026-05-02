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
          Stop building on what cannot hold.
        </h1>

        <p className="mt-8 text-lg leading-8 text-white/75">
          Clarity is not enough if the ground beneath it is unstable.
          This is where you stop rushing forward and choose what can actually support the next version of you.
        </p>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-[#d7ba7d] text-lg">
            Your foundation check:
          </p>

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
          href="/return"
          className="mt-10 inline-block rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10"
        >
          Return again
        </a>
      </div>
    </main>
  );
}