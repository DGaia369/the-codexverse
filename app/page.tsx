export default function Home() {
  const loopSteps = [
    {
      title: "Encounter",
      text: "You meet a truth that interrupts autopilot and asks for your honesty.",
    },
    {
      title: "Activation",
      text: "You receive a real-world action to complete, not more content to scroll through.",
    },
    {
      title: "Departure",
      text: "You leave the screen and carry the work into your actual life through ritual, reflection, boundary, or brave action.",
    },
    {
      title: "Return",
      text: "You come back and report what happened, what resisted you, and what shifted.",
    },
    {
      title: "Integration",
      text: "Meaning is extracted. Self-trust is restored. Coherence begins to form.",
    },
  ];

  const proofMarkers = [
    "I did the thing I said I would do.",
    "I noticed my resistance instead of obeying it.",
    "I saw a truth I had been avoiding.",
    "I returned and named what changed.",
    "I now trust myself a little more than before.",
  ];

  const returnQuestions = [
    "What did you complete?",
    "What resistance came up before you did it?",
    "What changed during or after the ritual?",
    "What truth did this reveal?",
    "What now feels non-negotiable?",
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(178,149,91,0.20),transparent_42%)]" />

        <header className="relative z-10 border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
            <div>
              <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">
                the codeXverse™
              </p>
              <p className="text-xs text-white/55">
                Participatory transformation through action and return
              </p>
            </div>

            <a
              href="#pathway-one"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Enter Pathway One
            </a>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 py-20 md:px-10">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#d7ba7d]">
              Human vision. AI leverage. Accelerated reality.
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              This is not something you consume.
              <br />
              It is something you participate in.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/78 md:text-xl">
              the codeXverse™ is a living identity reconstruction environment
              where truth meets action, action meets return, and return becomes
              evidence. Here, transformation is not performed. It is lived.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pathway-one"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                Start Return to Self
              </a>
              <a
                href="#what-this-is"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                What this is
              </a>
            </div>

            <p className="mt-6 text-sm leading-7 text-white/58">
              Not entertainment. Not passive education. Not empty inspiration.
              This is participatory transformation structured through pathways,
              not levels.
            </p>
          </div>
        </div>
      </section>

      <section id="what-this-is" className="bg-[#0d0d14] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#d7ba7d]">
              What the codeXverse™ is
            </p>
            <h2 className="text-3xl font-semibold md:text-5xl">
              A structured environment for people ready to stop abandoning
              themselves.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
              <h3 className="text-xl font-semibold">What it is</h3>
              <p className="mt-4 leading-8 text-white/72">
                A participatory transformation environment where scattered
                pieces become coherence through action, return, and reflection.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
              <h3 className="text-xl font-semibold">What it solves</h3>
              <p className="mt-4 leading-8 text-white/72">
                Self-abandonment, broken self-trust, inconsistency, and the
                painful gap between what you know and what you actually do.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
              <h3 className="text-xl font-semibold">Why it matters</h3>
              <p className="mt-4 leading-8 text-white/72">
                Most people do not need more content. They need a living
                structure that helps them return to themselves and follow
                through.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0f] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#d7ba7d]">
              The eXverse Loop™
            </p>
            <h2 className="text-3xl font-semibold md:text-5xl">
              Encounter. Act. Return. Integrate.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/74">
              This is the core protocol. A participant receives a truth, leaves
              with a commitment, returns with lived evidence, and rebuilds
              self-trust through the act of honest re-entry.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[#d7ba7d]/25 bg-[#14141d] p-7">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d7ba7d]">
                What counts as progress here
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-white/76">
                {proofMarkers.map((marker) => (
                  <li key={marker}>• {marker}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4">
            {loopSteps.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.7rem] border border-white/10 bg-white/5 p-6"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-white/72">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pathway-one"
        className="bg-[linear-gradient(180deg,#0d0d14_0%,#11111a_100%)] px-6 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#d7ba7d]">
              Pathway One
            </p>
            <h2 className="text-3xl font-semibold md:text-5xl">
              Return to Self
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/74">
              The first live pathway in the codeXverse™ is simple on purpose.
              The first breakthrough is not complexity. The first breakthrough
              is follow-through.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
                Step 1
              </p>
              <h3 className="mt-3 text-2xl font-semibold">Encounter</h3>
              <p className="mt-5 leading-7 text-white/72">
                Read this slowly:
              </p>
              <blockquote className="mt-5 rounded-[1.5rem] border border-[#d7ba7d]/20 bg-black/25 p-5 text-xl leading-9 text-white">
                Where have you been abandoning yourself?
              </blockquote>
              <p className="mt-5 leading-7 text-white/68">
                Do not answer quickly. Sit with the question until something
                true surfaces.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
                Step 2
              </p>
              <h3 className="mt-3 text-2xl font-semibold">Activation</h3>
              <p className="mt-5 leading-7 text-white/72">
                Complete this real-world ritual tonight:
              </p>

              <div className="mt-5 rounded-[1.5rem] border border-[#d7ba7d]/20 bg-black/25 p-5">
                <p className="font-medium text-white">Return Ritual</p>
                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-white/72">
                  <li>Create a quiet return space.</li>
                  <li>
                    Take a warm bath or sit in silence for 10 minutes with no
                    phone and no noise.
                  </li>
                  <li>
                    Place one hand on your chest and ask: “What have I needed
                    from myself that I have not been giving?”
                  </li>
                  <li>Write one truth you have been avoiding.</li>
                  <li>
                    End by writing one commitment you are willing to keep for
                    the next 24 hours.
                  </li>
                </ol>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/58">
                This is not about perfection. It is about contact.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
                Step 3
              </p>
              <h3 className="mt-3 text-2xl font-semibold">Return</h3>
              <p className="mt-5 leading-7 text-white/72">
                Come back after you complete the ritual. Answer the return
                questions honestly. This is where self-trust begins to rebuild.
              </p>
              <a
                href="/return"
                className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                Complete the Return
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0f] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#d7ba7d]/20 bg-[#12121a] p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
                Why this pathway matters
              </p>
              <h3 className="mt-3 text-2xl font-semibold md:text-3xl">
                The most common pain point is self-abandonment.
              </h3>
              <p className="mt-5 leading-8 text-white/72">
                Most people do not need more advice. They need a structure that
                helps them stop leaving themselves behind. Pathway One is
                designed to interrupt that pattern with one honest question, one
                lived action, and one required return.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#d7ba7d]">
                Expected outcomes
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-white/72">
                <li>• You name something true.</li>
                <li>• You complete one act of self-return.</li>
                <li>• You see where your resistance lives.</li>
                <li>• You keep one commitment to yourself.</li>
                <li>
                  • You create the first piece of evidence that change is
                  possible.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

<footer className="border-t border-white/10 bg-[#0a0a0f]">
  <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-white/55 md:px-10 md:flex-row md:items-center md:justify-between">
    <p>D. Claire — the codeXverse™</p>
    <p>Reclaim. Rebuild. Reveal.</p>
  </div>
</footer>
</main>
);
}