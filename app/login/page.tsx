"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("demo@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-zinc-400 mt-2">
            Sign in to continue to PulseChat
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Email</label>
          <input
            type="email"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
            placeholder="demo@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Password</label>
          <input
            type="password"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white text-black py-3 font-semibold hover:bg-zinc-200 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-white hover:underline"
          >
            Create one
          </Link>
        </div>

        <div className="rounded-xl bg-zinc-800/50 p-4 text-sm">
          <p className="font-medium mb-2">Demo account</p>
          <p className="text-zinc-400">Email: demo@test.com</p>
          <p className="text-zinc-400">Password: 123456</p>
        </div>
      </form>
    </main>
  );
}