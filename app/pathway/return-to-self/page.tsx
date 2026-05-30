import { createServerSupabaseClient } from "@/utils/supabase/server";
import CountdownTimer from '@/components/threshold/CountdownTimer';

type ReturnToSelfPageProps = {
  searchParams?: Promise<{
    door?: string;
    pathway?: string;
    session_id?: string;
  }>;
};

type ReturnRow = {
  activation_unlock_at?: string | null;
  activation_completed?: boolean | null;
  session_id: string | null;
  door: string | null;
  pathway: string | null;
};

const encounters = [
  "Where have you been abandoning yourself?",
  "What have you been pretending not to know?",
  "Where are you still performing instead of living?",
  "What part of yourself have you been leaving behind?",
  "Where have you been shrinking to keep the peace?",
  "What truth have you been too afraid to say out loud?",
  "Where have you stopped showing up for yourself?",
];

const activations = [
  {
    opening: "Tonight, create a quiet return space.",
    steps: [
      "Put your phone away.",
      "Sit in silence or take a warm bath for 10 minutes.",
      `Place one hand on your chest and ask: "What have I needed from myself that I have not been giving?"`,
      "Write one truth you have been avoiding.",
      "End by writing one commitment you are willing to keep for the next 24 hours.",
    ],
  },
  {
    opening: "Before you sleep tonight, do this one thing.",
    steps: [
      "Find a quiet space. Even 5 minutes counts.",
      "Write the name of one person you have been putting before yourself.",
      "Below that name, write what you have given up to do so.",
      "Then write: what would it look like to choose myself today?",
      "Close the journal. Do not explain it to anyone.",
    ],
  },
  {
    opening: "This is your activation for today.",
    steps: [
      "Set a timer for 10 minutes.",
      "Write without stopping: where in my life am I living on autopilot?",
      "Do not edit. Do not cross out. Let it come.",
      "When the timer ends, read back what you wrote.",
      "Circle one sentence that surprises you. That is where the work begins.",
    ],
  },
  {
    opening: "Tonight you are not fixing anything. You are only witnessing.",
    steps: [
      "Sit somewhere you feel safe.",
      "Place both hands on your knees. Feel the weight of your own body.",
      `Ask yourself quietly: "What emotion have I been carrying that I have not named?"`,
      "Name it. Write it down if you need to.",
      "Say out loud or in silence: I see you. I am not running from you anymore.",
    ],
  },
  {
    opening: "Your activation today is about reclamation.",
    steps: [
      "Think of one thing you used to love that you quietly stopped doing.",
      "Write down why you stopped.",
      "Now write: what would it mean to return to that?",
      "You do not have to return today. You only have to acknowledge it exists.",
      "End with one small act, however small, that belongs only to you.",
    ],
  },
];

function pickFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function AccessBlocked({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 flex items-center">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-8">
          the codeXverse™
        </p>
        <h1 className="text-3xl font-serif leading-snug">
          This pathway cannot be entered from here.
        </h1>
        <p className="mt-6 text-white/60 leading-8">{message}</p>
        
          <a
          href="/"
          className="mt-10 inline-block text-sm text-[#d7ba7d] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1"
        >
          return to the beginning
        </a>
      </div>
    </main>
  );
}

export default async function ReturnToSelfPage({
  searchParams,
}: ReturnToSelfPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const sessionId = params?.session_id ?? "";
  const door = params?.door ?? "";
  const pathway = params?.pathway ?? "";

  if (!sessionId) {
    return (
      <AccessBlocked message="A valid session is required. Return to the beginning and enter through the codeXverse™ properly." />
    );
  }

  const supabase = await createServerSupabaseClient();

  const { data: rows, error } = await supabase
    .from("returns")
    .select("session_id, door, pathway, activation_completed, activation_unlock_at")
    .eq("session_id", sessionId);

  if (error) {
    return <AccessBlocked message="Unable to validate this session." />;
  }

  const row: ReturnRow | null = rows && rows.length > 0 ? rows[0] : null;

  if (!row) {
    return <AccessBlocked message="This session does not exist." />;
  }

  if (!row.session_id || !row.door || !row.pathway) {
    return <AccessBlocked message="This session is missing required pathway data." />;
  }

  if (door && row.door !== door) {
    return <AccessBlocked message="Pathway access mismatch." />;
  }

  if (pathway && row.pathway !== pathway) {
    return <AccessBlocked message="Pathway access mismatch." />;
  }

  let unlockAt = row.activation_unlock_at;
const isCompleted = row.activation_completed === true;

if (!unlockAt && !isCompleted) {
  const newUnlockAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  await supabase
    .from('returns')
    .update({ activation_unlock_at: newUnlockAt })
    .eq('session_id', sessionId);
  unlockAt = newUnlockAt;
}

if (unlockAt && !isCompleted) {
  const unlockTime = new Date(unlockAt).getTime();
  const now = Date.now();

  if (!Number.isNaN(unlockTime) && now < unlockTime) {
    // do not block — let them see the page with the countdown
  }
}

  const encounter = pickFrom(encounters);
  const activation = pickFrom(activations);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-16">
          the codeXverse™
        </p>

        <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-10">
          Pathway One — Return to Self
        </p>

        <p className="text-white/50 text-base leading-8 mb-16">
          The first breakthrough is not complexity.
          <br />
          The first breakthrough is follow-through.
        </p>

        {/* Encounter */}
        <div className="mb-20">
          <p className="text-xs tracking-[0.3em] text-[#d7ba7d]/60 uppercase mb-6">
            Encounter
          </p>
          <p className="text-2xl font-serif leading-10 text-white/90">
            {encounter}
          </p>
          <p className="mt-6 text-white/40 text-base leading-8">
            Sit with this before you move forward.
            <br />
            Do not answer quickly. Let it land.
          </p>
        </div>

        {/* Activation */}
        <div className="mb-20">
          <p className="text-xs tracking-[0.3em] text-[#d7ba7d]/60 uppercase mb-6">
            Activation
          </p>
          <p className="text-white/70 text-base leading-9 mb-8">
            {activation.opening}
          </p>
          <div className="space-y-5">
            {activation.steps.map((step, i) => (
              <div key={i} className="flex gap-5">
                <span className="text-[#d7ba7d]/40 text-sm mt-1 shrink-0">
                  {i + 1}
                </span>
                <p className="text-white/70 text-base leading-8">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return */}
<div className="mb-10">
  <p className="text-xs tracking-[0.3em] text-[#d7ba7d]/60 uppercase mb-6">
    Return
  </p>
  <p className="text-white/50 text-base leading-8 mb-10">
    After you complete the activation, come back and report what happened.
    <br />
    This is where self-trust begins to rebuild.
  </p>

     {isCompleted || (unlockAt && Date.now() >= new Date(unlockAt).getTime()) ? (
    
      <a
      href={`/return?session_id=${encodeURIComponent(sessionId)}`}
      className="text-sm text-[#f3dfaa] tracking-[0.2em] border-b border-[#d7ba7d]/30 pb-1 hover:border-[#d7ba7d]/80 transition-all duration-300"
    >
      complete the return
    </a>
  ) : (
    <div className="space-y-6">
  <p className="text-white/50 text-base leading-9 italic">
    Notice what just happened in you reading that question.
    <br />
    That is not nothing.
    <br />
    That is the work beginning.
   </p>
   <p className="text-white/30 text-sm leading-8">
   Go live the commitment first.
   <br />
   This space will hold everything you just encountered.
   </p>
   {unlockAt && (
  <CountdownTimer unlockAt={unlockAt} />
)}
  <p className="text-white/20 text-xs leading-7 italic">
    The door does not close. It waits.
  </p>
</div>
  )}
</div>
      </div>
    </main>
  );
}