"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const returnMessages = [
  {
    headline: "You came back.",
    body: "Do you understand what that means?\nEvery version of you that gave up — you just answered them.",
  },
  {
    headline: "Something in you chose this",
    body: "even when another part of you said it wasn't worth it.\nThat voice was lying.\nIt has always been lying.",
  },
  {
    headline: "What you wrote in those five answers",
    body: "is more honest than most people allow themselves to be\nin an entire lifetime.\nSit with that.",
  },
  {
    headline: "The person you have been performing for",
    body: "does not live here.\nWhat you just did — you did for yourself.\nWhen is the last time you did something only for yourself?",
  },
  {
    headline: "You did not abandon yourself today.",
    body: "You may not know yet how significant that is.\nYou will.",
  },
  {
    headline: "Whatever you wrote as non-negotiable",
    body: "that is not a goal.\nThat is you finally telling the truth\nabout what you have always deserved.",
  },
  {
    headline: "Nobody saw what it cost you.",
    body: "But you know exactly what it cost.\n\nYou did this anyway.\n\nPayment in full.",
  },
];

export default function ReturnPage() {
  const [q1Completed, setQ1Completed] = useState("");
  const [q2Resistance, setQ2Resistance] = useState("");
  const [q3Changed, setQ3Changed] = useState("");
  const [q4TruthRevealed, setQ4TruthRevealed] = useState("");
  const [q5NonNegotiable, setQ5NonNegotiable] = useState("");
  const [email, setEmail] = useState("");
  const [routing, setRouting] = useState<{
    door?: string;
    pathway?: string;
    session_id?: string;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lockMessage, setLockMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<
    (typeof returnMessages)[0] | null
  >(null);
  const [integrateIndex, setIntegrateIndex] = useState(0);
  const [integrateVisible, setIntegrateVisible] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function checkReturnLock() {
      const params = new URLSearchParams(window.location.search);
      const savedRoutingRaw = localStorage.getItem("codexverse_routing");
      const savedRouting = savedRoutingRaw
        ? JSON.parse(savedRoutingRaw)
        : null;
      const sessionId =
        params.get("session_id") || savedRouting?.session_id || null;

      if (!sessionId) return;

      const { data, error } = await supabase
        .from("returns")
        .select("activation_unlock_at, activation_completed")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (!isActive) return;
      if (error || !data) return;
      if (data.activation_completed === true) return;

      const unlockAt = data.activation_unlock_at;
      if (!unlockAt) return;

      const unlockTime = new Date(unlockAt).getTime();
      const now = Date.now();

      if (now < unlockTime) {
        setLockMessage(
          "Your return is not open yet. Go live the commitment first."
        );
      }
    }

    checkReturnLock();
    return () => {
      isActive = false;
    };
  }, []);

  function advanceIntegrate(next: number) {
    setIntegrateVisible(false);
    setTimeout(() => {
      setIntegrateIndex(next);
      setIntegrateVisible(true);
    }, 700);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailIsValid) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q1Completed,
          q2Resistance,
          q3Changed,
          q4TruthRevealed,
          q5NonNegotiable,
          email,
        }),
      });

      const result = await res.json();

      if (result.ok && result.routing) {
        const cleanRouting = {
          door: result.routing.door || "unknown",
          pathway: result.routing.pathway || "unknown",
          session_id: result.routing.session_id || "unknown",
          activation_unlock_at:
            result.routing.activation_unlock_at || null,
        };
        setRouting(cleanRouting);
        localStorage.setItem(
          "codexverse_routing",
          JSON.stringify(cleanRouting)
        );
      }

      if (!res.ok || !result.ok) {
        setErrorMessage(
          result.error || "Something went wrong. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      const picked =
        returnMessages[Math.floor(Math.random() * returnMessages.length)];
      setSelectedMessage(picked);
      setSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (lockMessage) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16 flex items-center animate-fadeIn">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-xs tracking-[0.3em] text-[#d7ba7d]">
            the codeXverse™
          </p>
          <h1 className="text-4xl font-serif">Not yet.</h1>
          <p className="mt-6 text-lg leading-8 text-white/75">
            {lockMessage}
          </p>
          <p className="mt-6 text-white/60">
            The system is not punishing you. It is protecting the work
            from becoming another thought you abandoned.
          </p>
          
            <a
            href="/"
            className="mt-8 inline-block rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
          >
            Return to the Threshold
          </a>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16 animate-fadeIn">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-xs tracking-[0.3em] text-[#d7ba7d]">
            the codeXverse™
          </p>

          <div
            style={{
              opacity: integrateVisible ? 1 : 0,
              transform: integrateVisible
                ? "translateY(0)"
                : "translateY(12px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
            className="mt-8"
          >
            {/* Screen 1 — randomized return message */}
            {integrateIndex === 0 && selectedMessage && (
              <div className="space-y-6">
                <p className="text-2xl font-serif text-[#d7ba7d] leading-snug">
                  {selectedMessage.headline}
                </p>
                <p className="text-white/80 text-lg leading-9 whitespace-pre-line">
                  {selectedMessage.body}
                </p>
                <button
                  onClick={() => advanceIntegrate(1)}
                  className="mt-8 text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent"
                >
                  continue
                </button>
              </div>
            )}

            {/* Screen 2 — conscious return named */}
            {integrateIndex === 1 && (
              <div className="space-y-6">
                <p className="text-white/90 text-lg leading-9 whitespace-pre-line">
                  {`What you completed today has a name.\n\nIt is called a conscious return.\n\nIt is the practice of noticing you have drifted from yourself and choosing to come back.\n\nIt is the most courageous thing one can do.`}
                </p>
                <button
                  onClick={() => advanceIntegrate(2)}
                  className="mt-8 text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent"
                >
                  continue
                </button>
              </div>
            )}

            {/* Screen 3 — sentence to carry */}
            {integrateIndex === 2 && (
              <div className="space-y-10">
                <div className="border-l-2 border-[#d7ba7d]/40 pl-6">
                  <p className="text-[#d7ba7d] text-2xl font-serif leading-10 italic">
                    Do not abandon yourself just because someone else did.
                  </p>
                </div>
                <button
                  onClick={() => advanceIntegrate(3)}
                  className="text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent"
                >
                  continue
                </button>
              </div>
            )}

            {/* Screen 4 — ritual */}
            {integrateIndex === 3 && (
              <div className="space-y-8">
                <p className="text-xs tracking-[0.3em] text-[#d7ba7d]/60 uppercase">
                  A ritual to take home
                </p>
                <div className="space-y-3">
                  <p className="text-white/80 text-base leading-9 whitespace-pre-line">
                    {`Tonight, run warm water.\nAdd milk, salt, rose petals, or nothing at all.\nA few drops of lavender, rose, chamomile, or geranium if you have them.\nSit in the warmth.\nPlace one hand on your chest.\nSay out loud or in silence:`}
                  </p>
                  <p className="text-[#d7ba7d] text-lg font-serif italic leading-9 pl-4 whitespace-pre-line">
                    {`I am here.\nI came back.\nThat is enough.`}
                  </p>
                  <p className="text-white/60 text-base leading-8 italic mt-4">
                    This is not a bath.
                    <br />
                    This is you coming home to yourself.
                  </p>
                </div>
                <p className="text-white/30 text-sm tracking-[0.2em]">
                  — or —
                </p>
                <div className="space-y-3">
                  <p className="text-white/80 text-base leading-9 whitespace-pre-line">
                    {`If a bath is not your space,\nfind warm water another way.\nA long shower. A warm cloth held to your face.\nYour hands under running water, warm and slow.\n\nWherever you find it,\nplace one hand on your chest.\nFeel your own warmth meeting the water's warmth.\nSay out loud or in silence:`}
                  </p>
                  <p className="text-[#d7ba7d] text-lg font-serif italic leading-9 pl-4 whitespace-pre-line">
                    {`I am here.\nI came back.\nThat is enough.`}
                  </p>
                  <p className="text-white/60 text-base leading-8 italic mt-4">
                    This is not water.
                    <br />
                    This is you coming home to yourself.
                  </p>
                </div>
                <button
                  onClick={() => advanceIntegrate(4)}
                  className="text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300 bg-transparent"
                >
                  continue
                </button>
              </div>
            )}

            {/* Screen 5 — invitation */}
            {integrateIndex === 4 && (
              <div className="space-y-8">
                <p className="text-sm text-white/40 leading-7">
                  Stay with what you chose.
                  <br />
                  Even when the feeling changes.
                </p>
                <p className="text-white/60 text-base leading-8 italic whitespace-pre-line">
                  {`If something in you is not ready to stop here,\nthere is more.\nNot because you need fixing.\nBecause you are worth continuing.`}
                </p>
                
                  <a
                  href="/tier-2"
                  className="inline-block text-sm text-[#d7ba7d] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300"
                >
                  I want to go deeper →
                </a>
                <div className="pt-10">
                  
                <a
                href={
                      routing
                        ? `/door?door=${encodeURIComponent(routing.door ?? "")}&pathway=${encodeURIComponent(routing.pathway ?? "")}&session_id=${encodeURIComponent(routing.session_id ?? "")}`
                        : "/door"
                    }
                    className="inline-block rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
                  >
                    Return to the codeXverse™
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 animate-fadeIn">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4 text-xs tracking-[0.3em] text-[#d7ba7d]">
          the codeXverse™
        </p>
        <h1 className="text-4xl font-serif">Return</h1>
        <p className="mt-6 text-[#d7ba7d]">
          Before you answer, tell the truth.
        </p>
        <p className="mt-4 max-w-xl text-white/70 leading-7">
          This is not for appearance. Answer honestly. What happened? What
          resisted? What changed? What are you done carrying?
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm mb-2 text-white/80">
              1. What did you complete?
            </label>
            <textarea
              value={q1Completed}
              onChange={(e) => setQ1Completed(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-white/80">
              2. What resistance came up?
            </label>
            <textarea
              value={q2Resistance}
              onChange={(e) => setQ2Resistance(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-white/80">
              3. What changed?
            </label>
            <textarea
              value={q3Changed}
              onChange={(e) => setQ3Changed(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-white/80">
              4. What truth did this reveal?
            </label>
            <textarea
              value={q4TruthRevealed}
              onChange={(e) => setQ4TruthRevealed(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-white/80">
              5. What is now non-negotiable?
            </label>
            <textarea
              value={q5NonNegotiable}
              onChange={(e) => setQ5NonNegotiable(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-4"
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-4"
            required
          />
          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Lock In My Return"}
          </button>
        </form>
      </div>
    </main>
  );
}