"use client";

import { useEffect } from "react";

export default function ReturnToSelf() {
  useEffect(() => {
    console.log("Pathway viewed: return-to-self");
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-4">
          the codeXverse™
        </p>

        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          Pathway One — Return to Self
        </h1>

        <p className="mt-6 text-white/70 leading-8 text-lg">
          The first breakthrough is not complexity.
          <br />
          The first breakthrough is follow-through.
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <p className="text-[#d7ba7d] text-sm tracking-[0.25em] uppercase">
              Encounter
            </p>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-2xl leading-9">
                Where have you been abandoning yourself?
              </p>
            </div>
          </section>

          <section>
            <p className="text-[#d7ba7d] text-sm tracking-[0.25em] uppercase">
              Activation
            </p>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 leading-8">
                Tonight, create a quiet return space.
              </p>

              <ol className="mt-4 list-decimal pl-6 space-y-3 text-white/70 leading-7">
                <li>Put your phone away.</li>
                <li>Sit in silence or take a warm bath for 10 minutes.</li>
                <li>
                  Place one hand on your chest and ask:
                  <br />
                  <span className="text-white">
                    “What have I needed from myself that I have not been giving?”
                  </span>
                </li>
                <li>Write one truth you have been avoiding.</li>
                <li>
                  End by writing one commitment you are willing to keep for the
                  next 24 hours.
                </li>
              </ol>
            </div>
          </section>

          <section>
            <p className="text-[#d7ba7d] text-sm tracking-[0.25em] uppercase">
              Return
            </p>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/70 leading-8">
                After you complete the ritual, return and report what happened.
                This is where self-trust begins to rebuild.
              </p>

              <a
                href="/return"
                className="inline-block mt-8 rounded-full bg-white text-black px-6 py-3 font-semibold hover:opacity-90"
              >
                Complete the Return
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}