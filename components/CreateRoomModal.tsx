"use client";

import { useState } from "react";

export default function CreateRoomModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const createRoom = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type: "PUBLIC",
        }),
      });

      if (res.ok) {
        setName("");
        onCreated();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-xl p-6 w-96 border border-zinc-800">
        <h2 className="text-xl font-bold mb-4">Create Room</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Room name"
          className="w-full bg-zinc-800 rounded-lg px-3 py-2 mb-4 outline-none"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={createRoom}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-white text-black"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}