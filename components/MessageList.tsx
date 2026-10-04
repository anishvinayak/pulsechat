"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { socket } from "@/lib/socket";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
};

export default function MessageList({
  roomId,
}: {
  roomId: string;
}) {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/rooms/${roomId}`);

      if (!res.ok) return;

      const room = await res.json();

      setMessages(room.messages);
    };

    load();
  }, [roomId]);

  useEffect(() => {
    if (!session?.user?.id) return;

    socket.auth = {
      userId: session.user.id,
      userName: session.user.name,
    };

    socket.connect();

    socket.emit("join-room", roomId);

    const receive = (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) {
          return prev;
        }

        return [...prev, msg];
      });
    };

    socket.on("receive-message", receive);

    return () => {
      socket.off("receive-message", receive);
    };
  }, [roomId, session]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {messages.map((m) => (
        <div key={m.id}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">
              {m.sender.name}
            </span>

            <span className="text-zinc-500">
              {new Date(m.createdAt).toLocaleTimeString()}
            </span>
          </div>

          <div className="bg-zinc-800 rounded-xl p-3 inline-block max-w-xl">
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}