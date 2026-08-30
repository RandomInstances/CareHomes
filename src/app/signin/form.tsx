"use client";

import { useState } from "react";

export function SignInForm({ error, returnTo }: { error?: string; returnTo: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [offers, setOffers] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [problem, setProblem] = useState<string | null>(error ?? null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setProblem(null);
    try {
      const res = await fetch("/api/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, returnTo, marketingOptIn: offers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProblem(data.error ?? "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setProblem("We could not reach the server. Please try again.");
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <div className="mt-8 border border-line rounded-2xl bg-surface p-6 text-center">
        <p className="font-semibold">Check your email</p>
        <p className="text-[14.5px] text-ink-2 mt-1.5">
          We sent a sign-in link to <b>{email}</b>. It works once and lasts 30 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {problem ? (
        <p className="text-[13.5px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {problem}
        </p>
      ) : null}

      <a
        href={`/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`}
        className="w-full flex items-center justify-center gap-2.5 rounded-full border border-line-2 bg-surface font-semibold py-3 hover:border-teal transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
          <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
          <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
        </svg>
        Continue with Google
      </a>

      <div className="flex items-center gap-3 text-[12.5px] text-muted">
        <span className="flex-1 h-px bg-line" />
        or use your email
        <span className="flex-1 h-px bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          autoComplete="name"
          className="w-full rounded-full border border-line-2 bg-surface px-4 py-2.5 text-[15px] focus:outline-none focus:border-teal"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="Your email"
          autoComplete="email"
          className="w-full rounded-full border border-line-2 bg-surface px-4 py-2.5 text-[15px] focus:outline-none focus:border-teal"
        />
        <label className="flex items-start gap-2.5 text-[13.5px] text-ink-2">
          <input
            type="checkbox"
            checked={offers}
            onChange={(e) => setOffers(e.target.checked)}
            className="mt-0.5 rounded border-line-2"
          />
          <span>
            Email me when a bed opens at a home I saved, and about new homes and services
            in Colombo. Optional, and you can stop any time.
          </span>
        </label>
        <button
          type="submit"
          disabled={state === "sending"}
          className="w-full rounded-full bg-teal text-white font-semibold py-3 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>
    </div>
  );
}
