export default function ThresholdAtmosphere() {
  return (
    <section className="relative flex min-h-screen items-center bg-[#0a0a0f] px-6 py-24 text-white md:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mt-10 max-w-3xl space-y-8">
          <h1 className="font-serif text-4xl leading-tight md:text-6xl">
            Something in you already knows.
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
            Not everything. Not the full answer. But enough to feel where
            something has been off.
          </p>

          <div className="pt-8">
            
              <a
              href="/enter"
              className="text-sm tracking-[0.2em] text-[#f3dfaa] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300"
            >
              Shall we begin
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}