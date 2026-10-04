import { Users } from "lucide-react";

export default async function ChatHeader({
  roomId,
}: {
  roomId: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/rooms/${roomId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <header className="h-16 border-b border-zinc-800 px-6 flex items-center">
        <h2 className="text-xl font-semibold">Room</h2>
      </header>
    );
  }

  const room = await res.json();

  return (
    <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold"># {room.name}</h2>

      <div className="flex items-center gap-2 text-zinc-400">
        <Users size={18} />
        <span>{room._count?.members ?? 0}</span>
      </div>
    </header>
  );
}