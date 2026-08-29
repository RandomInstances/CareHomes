"use client";

import { useEffect, useState } from "react";

import { SearchOverlay } from "@/app/search-overlay";

type Suburb = { name: string; slug: string; count: number };

/// The header's search control. Rather than a text box that only matches names,
/// it opens the full screening flow — which is the thing families actually need
/// and the thing a plain directory search cannot do.
export function SearchTrigger({ query }: { query?: string }) {
  const [open, setOpen] = useState(false);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);

  // Fetched on first open rather than rendered into every page, so the static
  // pages stay static and no page pays for a query it does not use.
  useEffect(() => {
    if (!open || suburbs.length) return;
    let cancelled = false;
    fetch("/api/suburbs")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setSuburbs(data);
      })
      .catch(() => {
        // The overlay still works without suburb chips.
      });
    return () => {
      cancelled = true;
    };
  }, [open, suburbs.length]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex-1 min-w-0 max-w-md flex items-center gap-2 border border-line-2 rounded-full px-3 sm:px-4 py-2 bg-bg text-left hover:border-teal transition-colors"
      >
        <span className="hidden sm:block text-sm text-muted shrink-0">Colombo</span>
        <span className="hidden sm:block w-px h-4 bg-line-2" aria-hidden />
        <span className={`flex-1 truncate text-sm ${query ? "text-ink" : "text-muted"}`}>
          {query ?? "Who are you looking for?"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="text-teal shrink-0"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      <SearchOverlay open={open} onClose={() => setOpen(false)} suburbs={suburbs} />
    </>
  );
}
