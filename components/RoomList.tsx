"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Room = {
  id: string;
  name: string;
};

export default function RoomList({
  currentRoomId,
  refresh,
}: {
  currentRoomId?: string;
  refresh: number;
}) {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const loadRooms = async () => {
      const res = await fetch("/api/rooms");

      if (!res.ok) return;

      const data = await res.json();
      setRooms(data);
    };

    loadRooms();
  }, [refresh]);

  return (
    <div className="space-y-1">
      {rooms.map((room) => (
        <Link
          key={room.id}
          href={`/rooms/${room.id}`}
          className={`block px-3 py-2 rounded-lg transition ${
            currentRoomId === room.id
              ? "bg-zinc-800"
              : "hover:bg-zinc-800"
          }`}
        >
          # {room.name}
        </Link>
      ))}
    </div>
  );
}