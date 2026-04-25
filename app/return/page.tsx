"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/utils/supabase/client";

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

const pathway = routing?.pathway ?? "unknown";

const [submitted, setSubmitted] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

if (!emailIsValid) {
  setErrorMessage("Please enter a valid email address.");
  setIsSubmitting(false);
  return;
}
  console.log("handleSubmit fired");
  console.log("Submitting return form");
  setIsSubmitting(true);
  setErrorMessage("");

  try {
    console.log("before fetch");
   
    const res = await fetch("/api/return", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
  setRouting(result.routing);
}
  
    console.log("API result:", result);
    console.log("res.ok:", res.ok);

    if (!res.ok || !result.ok) {
      console.error("Return API error:", result);
      setErrorMessage(result.error || "Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    setIsSubmitting(false);
  } catch (err) {
    console.error("Fetch error:", err);
   setErrorMessage("Something went wrong. Please try again.");
    setIsSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4 text-xs tracking-[0.3em] text-[#d7ba7d]">
          the codeXverse™
        </p>

        <h1 className="text-3xl font-semibold">Return</h1>

        {!submitted ? (
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
  onClick={() => console.log("button clicked")}
  className="w-full rounded-lg bg-white py-3 font-semibold text-black disabled:opacity-60"
>
           {isSubmitting ? "Submitting..." : "Submit My Return"}
            </button>
          </form>
        ) : (
          <div className="mt-10 space-y-4 text-[#d7ba7d]">
            <p className="text-lg">You came back to it.</p>

           <p className="text-white/70 mt-4">
  {pathway === "guided-support" && (
    <>
      What surfaced here matters.
      <br />
      Do not rush past it.
    </>
  )}

  {pathway === "self-directed" && (
    <>
      You have more clarity than you’re giving yourself credit for.
      <br />
      Move with it.
    </>
  )}

  {pathway === "unknown" && (
    <>
      The work is not what you wrote.
      <br />
      The work is what you continue.
    </>
  )}
</p>

            <p className="text-sm text-white/60">
              Stay with the commitment you made for the next 24 hours.
              <br />
              Do not negotiate with it.
            </p>

            <a
  href={
    routing
      ? `/door?door=${encodeURIComponent(routing.door ?? "")}&pathway=${encodeURIComponent(routing.pathway ?? "")}&session_id=${encodeURIComponent(routing.session_id ?? "")}`
      : "/door"
  }
  className="mt-4 inline-block rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
>
  Return to the codeXverse™
</a>
          </div>
        )}
      </div>
    </main>
  );
}