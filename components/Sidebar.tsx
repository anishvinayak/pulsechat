"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Plus, LogOut } from "lucide-react";
import RoomList from "./RoomList";
import CreateRoomModal from "./CreateRoomModal";

export default function Sidebar({
  currentRoomId,
}: {
  currentRoomId?: string;
}) {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  return (
    <>
      <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-5 border-b border-zinc-800">
          <h1 className="text-2xl font-bold">PulseChat</h1>
        </div>

        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm uppercase text-zinc-400">Rooms</h2>

            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded hover:bg-zinc-800"
            >
              <Plus size={18} />
            </button>
          </div>

          <RoomList currentRoomId={currentRoomId} refresh={refresh} />
        </div>

        {/* Logged-in User */}
        <div className="border-t border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-semibold">
              {session?.user?.name?.[0] ??
                session?.user?.email?.[0]?.toUpperCase() ??
                "A"}
            </div>

            <div>
              <p className="font-medium">
                {session?.user?.name || "Anish"}
              </p>
              <p className="text-xs text-zinc-400">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <button
           onClick={() =>
  signOut({
    callbackUrl: "/login",
    redirect: true,
  })
}
            className="p-2 rounded hover:bg-zinc-800"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <CreateRoomModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => setRefresh((prev) => prev + 1)}
      />
    </>
  );
}