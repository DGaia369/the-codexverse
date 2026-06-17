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

export default function Tier2Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ExperienceHeader label="The Agreement" />

      <p
        style={{
          color: "#ffffff",
          fontFamily: "serif",
          opacity: 0.4,
          fontSize: "1rem",
          letterSpacing: "0.15em",
        }}
      >
        this space is not yet open
      </p>
    </main>
  );
}