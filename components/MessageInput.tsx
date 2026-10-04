"use client";

import { useRef, useState } from "react";
import { socket } from "@/lib/socket";

export default function MessageInput({
  roomId,
}: {
  roomId: string;
}) {
  const [text, setText] = useState("");

  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (value: string) => {
    setText(value);

    socket.emit("typing-start", { roomId });

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      socket.emit("typing-stop", { roomId });
    }, 1000);
  };

  const send = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      roomId,
      message: text,
    });

    socket.emit("typing-stop", { roomId });

    setText("");
  };

  return (
    <div className="border-t border-zinc-800 p-4 flex gap-3">
      <input
        className="flex-1 bg-zinc-900 rounded-xl px-4 py-3 outline-none"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />

      <button
        onClick={send}
        className="bg-white text-black px-6 rounded-xl font-medium"
      >
        Send
      </button>
    </div>
  );
}