type DoorPageProps = {
  searchParams?: Promise<{
    door?: string;
    pathway?: string;
    session_id?: string;
  }>;
};

export default async function DoorPage({ searchParams }: DoorPageProps) {
  const params = searchParams ? await searchParams : undefined;

  let routing = {
  door: params?.door ?? null,
  pathway: params?.pathway ?? null,
  session_id: params?.session_id ?? null,
};

const door = routing.door ?? "unknown";
const pathway = routing.pathway ?? "unknown";
const session_id = routing.session_id ?? "unknown";

  const doorContent = {
    rebuilding: {
      title: "You made it through the door.",
      message: "This is where intention becomes structure.\nStructure becomes identity.",
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
      message: "This is where intention becomes structure.\nStructure becomes identity.",
    },
  } as const;

  const currentDoor =
    doorContent[door as keyof typeof doorContent] ?? doorContent.unknown;

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
          Door: {door} · Pathway: {pathway}
        </p>

        <a
          href={`/pathway?door=${encodeURIComponent(door)}&pathway=${encodeURIComponent(pathway)}&session_id=${encodeURIComponent(session_id)}`}
          className="inline-block rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10 transition"
        >
          Choose Your Path
        </a>
      </div>
    </main>
  );
}