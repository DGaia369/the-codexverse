import { createServerSupabaseClient } from "@/utils/supabase/server";

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

type DoorMessage = {
  id: string;
  message: string;
};

export default async function DoorPage({ searchParams }: DoorPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const urlDoor = params?.door ?? null;
  const urlPathway = params?.pathway ?? null;
  const session_id = params?.session_id ?? null;

  let resolvedDoor = urlDoor;
  let resolvedPathway = urlPathway;

  const supabase = await createServerSupabaseClient();

  if (session_id) {
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
            We couldn't open the door.
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

  // Fetch messages already served to this participant for this door state
  const { data: servedRows } = await supabase
    .from("participant_messages")
    .select("door_message_id")
    .eq("session_id", session_id)
    .eq("door_state", resolvedDoor);

  const servedIds = servedRows?.map((r) => r.door_message_id) ?? [];

  // Fetch all messages for this door state
  const { data: allMessages } = await supabase
    .from("door_messages")
    .select("id, message")
    .eq("door_state", resolvedDoor)
    .order("depth_level", { ascending: true })
    .order("version", { ascending: true });

  // Find first unserved message
  const available = (allMessages ?? []).filter(
    (m: DoorMessage) => !servedIds.includes(m.id)
  );

  // If all messages served, cycle from beginning
  const selected: DoorMessage | null =
    available.length > 0
      ? available[0]
      : allMessages && allMessages.length > 0
      ? allMessages[0]
      : null;

  // Record this message as served
  if (selected && session_id) {
    await supabase.from("participant_messages").insert({
      session_id,
      door_message_id: selected.id,
      door_state: resolvedDoor,
    });
  }

  const messageText = selected?.message ?? "You made it through the door.";

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <p className="text-xs tracking-[0.3em] text-[#d7ba7d] mb-12">
          the codeXverse™
        </p>

        <div className="space-y-5 text-lg leading-9 text-white/85 whitespace-pre-line">
          {messageText}
        </div>

        <div className="mt-16">
          
           <a 
            href={`/pathway?door=${encodeURIComponent(
              resolvedDoor
            )}&pathway=${encodeURIComponent(
              resolvedPathway
            )}&session_id=${encodeURIComponent(session_id)}`}
            className="inline-block rounded-full border border-[#d7ba7d]/35 bg-[#d7ba7d]/10 px-7 py-3 text-sm font-medium text-[#f3dfaa] transition hover:border-[#d7ba7d]/80 hover:bg-[#d7ba7d]/18"
          >
            I am ready to go deeper →
          </a>
        </div>
      </div>
    </main>
  );
}