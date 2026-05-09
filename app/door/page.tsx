import { createServerSupabaseClient } from "@/utils/supabase/server";
const supabase = await createServerSupabaseClient();

type DoorPageProps = {
  searchParams?: Promise<{
    door?: string | null;
    pathway?: string | null;
    session_id?: string | null;
  }>;
};

type ReturnRow = {
  session_id: string | null;
  door: string | null;
  pathway: string | null;
};

export default async function DoorPage({ searchParams }: DoorPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const urlDoor = params?.door ?? null;
  const urlPathway = params?.pathway ?? null;
  const session_id = params?.session_id ?? null;

  let resolvedDoor = urlDoor;
  let resolvedPathway = urlPathway;

  if (session_id) {
  const supabase = await createServerSupabaseClient();

    const { data: rows } = await supabase
      .from("returns")
      .select("session_id, door, pathway")
      .eq("session_id", session_id);

    const row: ReturnRow | null = rows && rows.length > 0 ? rows[0] : null;

    if (row) {
      if (!resolvedDoor) resolvedDoor = row.door;
      if (!resolvedPathway) resolvedPathway = row.pathway;

      if (urlDoor && row.door && urlDoor !== row.door) {
        resolvedDoor = null;
      }

      if (urlPathway && row.pathway && urlPathway !== row.pathway) {
        resolvedPathway = null;
      }
    }
  }

  if (!resolvedDoor || !resolvedPathway || !session_id) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-4">
            the codeXverse™
          </p>

          <h1 className="text-3xl font-semibold mb-6">
            We couldn’t open the door.
          </h1>

          <p className="text-white/70 mb-8">
            This return is missing its pathway context.
          </p>

          <a
            href="/return"
            className="inline-block rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10 transition"
          >
            Go back to Return
          </a>
        </div>
      </main>
    );
  }

  const doorContent = {
    rebuilding: {
      title: "You made it through the door.",
      message: "You said you wanted change.\nNow something has to become different.",
    },
    stuck: {
      title: "You are no longer standing still.",
      message: "What felt frozen can move.\nMovement begins with one honest step.",
    },
    lost: {
      title: "You are not lost now.",
      message: "Naming where you are is the first return.\nDirection follows truth.",
    },
    inconsistent: {
      title: "You are returning to yourself again.",
      message: "Consistency is not perfection.\nIt is a decision made again and again.",
    },
    unknown: {
      title: "You made it through the door.",
      message: "You made it through the door.\nBut something still isn’t aligned.",
    },
  } as const;

  const currentDoor =
    doorContent[resolvedDoor as keyof typeof doorContent] ?? doorContent.unknown;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-4">
          the codeXverse™
        </p>

        <h1 className="text-3xl font-semibold mb-6">
          {currentDoor.title}
        </h1>

        <p className="text-white/70 mb-3 whitespace-pre-line">
          {currentDoor.message}
        </p>

        <p className="text-sm text-white/50 mb-8">
          Door: {resolvedDoor} · Pathway: {resolvedPathway}
        </p>

        <a
          href={`/pathway?door=${encodeURIComponent(
            resolvedDoor
          )}&pathway=${encodeURIComponent(
            resolvedPathway
          )}&session_id=${encodeURIComponent(session_id)}`}
          className="inline-block rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10 transition"
        >
          Choose Your Path
        </a>
      </div>
    </main>
  );
}