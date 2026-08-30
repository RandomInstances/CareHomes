"use client";

import { useState } from "react";

// Shown the first time someone saves a home while signed out. It does not block
// the save — the heart already worked, and the home is kept in the browser — so
// this is an offer rather than a toll gate. Closing it costs the person nothing.

const BENEFITS = [
  {
    color: "#B4780F",
    icon: '<path d="M12 21s-7.5-4.7-7.5-10A4.4 4.4 0 0 1 12 7.6 4.4 4.4 0 0 1 19.5 11c0 5.3-7.5 10-7.5 10z"/>',
    title: "Your shortlist, on any device",
    body: "Save homes on your phone and open them later on a laptop, or share the list with a brother or sister.",
  },
  {
    color: "#0E5C55",
    icon: '<path d="M3 6h7v12H3zM14 6h7v12h-7z"/><path d="M10 12h4"/>',
    title: "Compare side by side",
    body: "Fees, beds, night nursing and what each home will not take, in one table.",
  },
  {
    color: "#31456E",
    icon: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z"/><path d="M10.5 21a2 2 0 0 0 3 0"/>',
    title: "Know when a bed opens",
    body: "A home you saved often has no space today and space next month. We can tell you when that changes.",
  },
];

export function SignUpPrompt({
  open,
  onClose,
  savedCount,
}: {
  open: boolean;
  onClose: () => void;
  savedCount: number;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [offers, setOffers] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const returnTo = typeof window === "undefined" ? "/account" : window.location.pathname;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, returnTo, marketingOptIn: offers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setError("We could not reach the server. Please try again.");
      setState("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 overflow-y-auto" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create a free account"
        onClick={(e) => e.stopPropagation()}
        className="mx-auto my-0 sm:my-10 min-h-full sm:min-h-0 sm:max-w-lg bg-surface sm:rounded-3xl sm:shadow-[0_16px_48px_rgba(23,48,45,0.28)] overflow-hidden"
      >
        <div className="px-6 pt-6 pb-5 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 w-8 h-8 rounded-full grid place-items-center text-muted hover:text-ink hover:bg-bg"
          >
            ✕
          </button>

          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-turmeric bg-turmeric-soft rounded-full px-2.5 py-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 21s-7.5-4.7-7.5-10A4.4 4.4 0 0 1 12 7.6 4.4 4.4 0 0 1 19.5 11c0 5.3-7.5 10-7.5 10z" />
            </svg>
            {savedCount === 1 ? "1 home saved" : `${savedCount} homes saved`}
          </span>

          <h2 className="text-2xl font-semibold mt-3">Keep your shortlist</h2>
          <p className="text-[15px] text-ink-2 mt-1.5">
            Saved on this device for now. A free account keeps it wherever you sign in —
            and finding care usually takes more than one sitting.
          </p>
        </div>

        <ul className="px-6 space-y-3.5">
          {BENEFITS.map((b) => (
            <li key={b.title} className="flex gap-3">
              <span
                className="shrink-0 grid place-items-center w-9 h-9 rounded-full"
                style={{ backgroundColor: `${b.color}1A`, color: b.color }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  dangerouslySetInnerHTML={{ __html: b.icon }}
                />
              </span>
              <div>
                <h3 className="font-semibold text-[15px]">{b.title}</h3>
                <p className="text-[13.5px] text-ink-2 mt-0.5">{b.body}</p>
              </div>
            </li>
          ))}
        </ul>

        {state === "sent" ? (
          <div className="px-6 py-6 mt-5 border-t border-line text-center">
            <p className="font-semibold">Check your email</p>
            <p className="text-[14.5px] text-ink-2 mt-1.5">
              We sent a sign-in link to <b>{email}</b>. It works once and lasts 30 minutes.
            </p>
            <button type="button" onClick={onClose} className="mt-4 text-sm font-semibold text-teal">
              Back to browsing
            </button>
          </div>
        ) : (
          <div className="px-6 pb-6 pt-5 mt-5 border-t border-line space-y-4">
            <a
              href={`/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`}
              className="w-full flex items-center justify-center gap-2.5 rounded-full border border-line-2 bg-surface font-semibold py-3 hover:border-teal transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
                <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.1-4 1.1-3.1 0-5.700-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
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

              {/* Marketing consent is separate from creating the account, and never
                  pre-ticked. Bundling the two is the thing that generates complaints. */}
              <label className="flex items-start gap-2.5 text-[13.5px] text-ink-2">
                <input
                  type="checkbox"
                  checked={offers}
                  onChange={(e) => setOffers(e.target.checked)}
                  className="mt-0.5 rounded border-line-2"
                />
                <span>
                  Email me when a bed opens at a home I saved, and about new homes and
                  services in Colombo. Optional, and you can stop any time.
                </span>
              </label>

              {error ? (
                <p className="text-[13.5px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full rounded-full bg-teal text-white font-semibold py-3 disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : "Email me a sign-in link"}
              </button>
            </form>

            <p className="text-[12.5px] text-muted text-center">
              Free, and always free for families. We never pass your details to a care home.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
