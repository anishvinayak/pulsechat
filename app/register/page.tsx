"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <form
        onSubmit={register}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-5"
      >
        <div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-zinc-400 mt-2">
            Join PulseChat
          </p>
        </div>

        <input
          className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-white text-black rounded-xl py-3 font-medium disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-zinc-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}