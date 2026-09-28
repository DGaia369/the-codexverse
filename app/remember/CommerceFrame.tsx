// Shared frame for the Founding Access purchase and confirmation pages
// (Launch Sprint 2). Matches the Door's header treatment. Structure only;
// each page supplies its own copy.
export default function CommerceFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <header className="fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-5 md:px-10">
          <div>
            <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">the codeXverse™</p>
            <p className="text-xs text-white/55">Pathway Two™: ReMEMBER™</p>
          </div>
        </div>
      </header>

      <div className="max-w-xl w-full">{children}</div>
    </main>
  );
}

export const commerceButtonClass =
  'inline-block rounded-full border border-[#d7ba7d]/35 bg-[#d7ba7d]/10 px-7 py-3 text-sm font-medium text-[#f3dfaa] transition hover:border-[#d7ba7d]/70 disabled:opacity-50';
