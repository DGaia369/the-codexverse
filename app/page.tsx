'use client';

import ThresholdAtmosphere from '@/components/threshold/ThresholdAtmosphere';

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
      <section className="relative overflow-hidden bg-[#0a0a0f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(178,149,91,0.16),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.86)_0%,rgba(10,10,15,1)_92%)]" />

        {/* Header — brand label only. No Begin button. The atmosphere is the beginning. */}
        <header className="relative z-10 border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-5 md:px-10">
            <div>
              <p className="text-sm tracking-[0.25em] text-[#d7ba7d]">
                the codeXverse™
              </p>
              <p className="text-xs text-white/55">
                Return to Self
              </p>
            </div>
          </div>
        </header>

        <div className="relative z-10 threshold-descent">

         {/* Atmosphere — before words, before ask. The descent begins here. */}
          <div className="threshold-layer">
            <ThresholdAtmosphere />
          </div>

          {/* Layer 1 — Interruption */}
          <div
            id="layer-1"
            className="threshold-layer flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10">
            <div className="w-full max-w-3xl">
              <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#d7ba7d]">
                Layer 1 · Interruption
              </p>

              <div className="space-y-6 text-base leading-8 text-white/84 md:text-xl md:leading-[1.65]">
                <p>
                  There comes a point where you become so good at carrying
                  everything that nobody realizes how heavy it's gotten.
                </p>

                <p className="text-white/72">
                  You answer the messages. Go to work. Handle what needs
                  handling.
                </p>

                <p>You keep moving.</p>

                <p className="text-white/72">
                  Meanwhile, something quieter starts happening underneath all
                  of it.
                </p>

                <p>You stop checking in with yourself.</p>

                <p className="text-white/72">
                  Not because you wanted to.
                </p>

                <p>
                  Because survival became faster than reflection.
                </p>

                <p className="text-white/72">
                  Most people do not notice the moment they disappear into
                  routine.
                </p>

                <p className="text-white/72">
                  They only notice the exhaustion later.
                </p>

                <p>
                  And by then, the pattern feels normal.
                </p>
              </div>

              <a
                href="#mirror"
                className="mt-12 inline-flex rounded-full border border-[#d7ba7d]/35 bg-[#d7ba7d]/10 px-6 py-3 text-sm font-medium text-[#f3dfaa] transition hover:border-[#d7ba7d]/80 hover:bg-[#d7ba7d]/18"
              >
                Continue to Mirror →
              </a>
            </div>
          </div>

{/* Layer 2 — Mirror */}
<div
  id="mirror"
  className="flex min-h-screen flex-col items-center justify-center px-6 py-20 md:px-10">
  <div className="w-full max-w-3xl">
    <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#d7ba7d]">
      Layer 2 · Mirror
    </p>

    <div className="space-y-6 text-base leading-8 text-white/84 md:text-xl md:leading-[1.65]">
      <p>You tell yourself you'll slow down eventually.</p>

      <p className="text-white/72">
        After things calm down. After the pressure eases. After you
        figure everything out.
      </p>

      <p>But eventually keeps moving.</p>

      <p className="text-white/72">
        So you adapt.
      </p>

      <p>
        You become dependable. Productive. Available. Functional.
      </p>

      <p className="text-white/72">
        Even when you feel disconnected from your own life.
      </p>

      <p>
        Most people around you will call that strength.
      </p>

      <p className="text-white/72">
        Even while something inside you quietly keeps asking:
      </p>

      <p>
        "When do I come back to me?"
      </p>

      <p className="text-white/72">
        …or maybe even more honestly:
      </p>

      <p>
        "When do I get to see me?"
      </p>
    </div>

    
    <a
    href="#reframe"
      className="mt-12 inline-flex rounded-full border border-[#d7ba7d]/35 bg-[#d7ba7d]/10 px-6 py-3 text-sm font-medium text-[#f3dfaa] transition hover:border-[#d7ba7d]/80 hover:bg-[#d7ba7d]/18"
    >
      Continue to Reframe →
    </a>
  </div>
</div>

          {/* Layer 3 — Reframe */}
          <div
            id="reframe"
            className="threshold-layer flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10">
            <div className="w-full max-w-3xl">
              <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#d7ba7d]">
                Layer 3 · Reframe
              </p>

              <div className="space-y-6 text-base leading-8 text-white/84 md:text-xl md:leading-[1.65]">
                <p>Maybe the problem is not that you failed.</p>

                <p className="text-white/72">
                  Maybe you adapted to environments that required you to abandon
                  parts of yourself just to keep functioning inside them.
                </p>

                <p>At first, adaptation protects you.</p>

                <p className="text-white/72">
                  Then it becomes automatic.
                </p>

                <p>Then one day you realize:</p>

                <p className="text-white/72">
                  You cannot remember the last time you made decisions from
                  clarity instead of survival.
                </p>

                <p>That does not mean you are broken.</p>

                <p>
                  It means the pattern has been repeating itself for too long.
                </p>
              </div>

              <a
                href="#orientation"
                className="mt-12 inline-flex rounded-full border border-[#d7ba7d]/35 bg-[#d7ba7d]/10 px-6 py-3 text-sm font-medium text-[#f3dfaa] transition hover:border-[#d7ba7d]/80 hover:bg-[#d7ba7d]/18"
              >
                Continue to Orientation →
              </a>
            </div>
          </div>

          {/* Layer 4 — Orientation */}
          <div
            id="orientation"
            className="threshold-layer flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10">
            <div className="w-full max-w-3xl">
              <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#d7ba7d]">
                Layer 4 · Orientation
              </p>

              <div className="space-y-6 text-base leading-8 text-white/84 md:text-xl md:leading-[1.65]">
                <p>
                  the codeXverse™ was not created to tell people who they are.
                </p>

                <p className="text-white/72">
                  It was created to help them see clearly enough to decide that
                  for themselves again.
                </p>

                <p>This is not therapy.</p>

                <p className="text-white/72">
                  Not motivation.
                </p>

                <p>Not performance.</p>

                <p className="text-white/72">
                  This is a guided pathway of reflection, recognition, and
                  conscious action.
                </p>

                <p>A place where patterns become visible.</p>

                <p className="text-white/72">
                  Choices become intentional.
                </p>

                <p>And movement becomes possible again.</p>

                <p className="text-white/72">
                  Not overnight. Not artificially.
                </p>

                <p>Honestly.</p>
              </div>

              <a
                href="#loop"
                className="mt-12 inline-flex rounded-full border border-[#d7ba7d]/35 bg-[#d7ba7d]/10 px-6 py-3 text-sm font-medium text-[#f3dfaa] transition hover:border-[#d7ba7d]/80 hover:bg-[#d7ba7d]/18"
              >
                Continue to the eXverse Loop™ →
              </a>
            </div>
          </div>

          {/* Layer 5 — The eXverse Loop™ */}
          <div
            id="loop"
            className="threshold-layer flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10">
            <div className="w-full max-w-3xl">
              <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#d7ba7d]">
                Layer 5 · The eXverse Loop™
              </p>

              <div className="space-y-6 text-base leading-8 text-white/84 md:text-xl md:leading-[1.65]">
                <p>Everything begins with a return.</p>

                <p className="text-white/72">
                  Not to who you used to be.
                </p>

                <p>To awareness.</p>

                <p className="text-white/72">
                  From there, the system responds to how you move.
                </p>

                <p>
                  Every moment of honesty opens a different door.
                </p>

                <div className="space-y-3 rounded-[2rem] border border-[#d7ba7d]/20 bg-white/[0.03] p-7 text-xl text-white/82 md:text-2xl">
                  <p>Return.</p>
                  <p>Door.</p>
                  <p>Pathway.</p>
                  <p>Action.</p>
                </div>

                <p className="text-white/72">
                  Each decision reveals something.
                </p>

                <p>
                  Each pathway asks something different of you.
                </p>

                <p className="text-white/72">
                  Each action changes what becomes available next.
                </p>

                <p>You do not move through the experience passively.</p>

                <p>
                  The experience moves with you.
                </p>
              </div>

              <a
                href="#return-to-self"
                className="mt-12 inline-flex rounded-full border border-[#d7ba7d]/35 bg-[#d7ba7d]/10 px-6 py-3 text-sm font-medium text-[#f3dfaa] transition hover:border-[#d7ba7d]/80 hover:bg-[#d7ba7d]/18"
              >
                Continue to Return to Self →
              </a>
            </div>
          </div>

          {/* Layer 6 — Return to Self */}
          <div
            id="return-to-self"
            className="threshold-layer flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10">
            <div className="w-full max-w-3xl">
              <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#d7ba7d]">
                Layer 6 · Return to Self
              </p>

              <div className="space-y-6 text-base leading-8 text-white/84 md:text-xl md:leading-[1.65]">
                <p>
                  Most people spend years waiting for clarity before they
                  change.
                </p>

                <p className="text-white/72">
                  But clarity rarely arrives first.
                </p>

                <p>
                  Usually, the first thing that happens is simpler than that.
                </p>

                <p className="text-white/72">
                  You finally stop avoiding what you already know.
                </p>

                <p>
                  And once you see it clearly, you cannot unsee it.
                </p>

                <p className="text-white/72">
                  Maybe this is the moment you stop leaving yourself behind.
                </p>

                <a
                  href="#pathway-one"
                  className="mt-8 inline-flex rounded-full border border-[#d7ba7d]/45 bg-[#d7ba7d]/10 px-7 py-3 text-base font-medium text-[#f3dfaa] transition hover:border-[#d7ba7d]/80 hover:bg-[#d7ba7d]/18"
                >
                  Return
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Below the threshold — these sections do not change ── */}

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
                    Place one hand on your chest and ask: "What have I needed
                    from myself that I have not been giving?"
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