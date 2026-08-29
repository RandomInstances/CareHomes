"use client";

import { useEffect, useState } from "react";

import { SearchPanel } from "@/app/search-overlay";
import { FEE_MAX } from "@/lib/catalog";

type Suburb = { name: string; slug: string; count: number };

export type SearchDraft = {
  places: string[];
  age: string;
  budget: number;
  needs: string[];
  requires: string[];
  language: string;
};

const EMPTY: SearchDraft = {
  places: [],
  age: "",
  budget: FEE_MAX,
  needs: [],
  requires: [],
  language: "",
};

function money(n: number) {
  return `LKR ${n.toLocaleString("en-LK")}`;
}

/// The collapsed control shows the three things a family already knows — where,
/// how old, what they can spend — so opening it is never a surprise. Anything
/// requiring more thought sits inside the panel.
function Segment({
  label,
  value,
  muted,
  className = "",
}: {
  label: string;
  value: string;
  muted: boolean;
  className?: string;
}) {
  return (
    <span className={`flex flex-col justify-center px-5 py-2.5 min-w-0 ${className}`}>
      <span className="text-[11.5px] font-bold text-ink leading-none">{label}</span>
      <span className={`text-[14px] truncate leading-tight mt-1 ${muted ? "text-muted" : "text-ink"}`}>
        {value}
      </span>
    </span>
  );
}

export function SearchTrigger({ query }: { query?: string }) {
  const [open, setOpen] = useState(false);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [draft, setDraft] = useState<SearchDraft>(EMPTY);

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
        // The panel still works without suburb chips.
      });
    return () => {
      cancelled = true;
    };
  }, [open, suburbs.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const placeLabel =
    draft.places.length === 0
      ? "Anywhere in Colombo"
      : draft.places.length === 1
        ? (suburbs.find((s) => s.slug === draft.places[0])?.name ?? "1 suburb")
        : `${draft.places.length} suburbs`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="w-full max-w-3xl flex items-center border border-line-2 rounded-full bg-surface text-left shadow-[0_2px_10px_rgba(23,48,45,0.10)] hover:shadow-[0_4px_18px_rgba(23,48,45,0.16)] transition-shadow"
      >
        <Segment label="Where" value={query ?? placeLabel} muted={!query && !draft.places.length} className="flex-1" />
        <span className="w-px h-8 bg-line-2 shrink-0" aria-hidden />
        <Segment label="Age" value={draft.age || "Any"} muted={!draft.age} className="w-[86px] shrink-0" />
        <span className="hidden sm:block w-px h-8 bg-line-2 shrink-0" aria-hidden />
        <Segment
          label="Budget"
          value={draft.budget < FEE_MAX ? money(draft.budget) : "Any"}
          muted={draft.budget >= FEE_MAX}
          className="hidden sm:flex w-[150px] shrink-0"
        />
        <span className="grid place-items-center w-11 h-11 rounded-full bg-teal text-white shrink-0 mr-1.5 ml-1">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/25"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          {/* Full screen on a phone; a wide panel under the header on desktop. */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Find a care home"
            className="fixed z-[61] bg-surface overflow-y-auto inset-0 sm:absolute sm:inset-auto sm:top-full sm:-mt-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-[940px] sm:max-w-[94vw] sm:max-h-[88vh] sm:rounded-3xl sm:shadow-[0_16px_48px_rgba(23,48,45,0.24)] sm:border sm:border-line"
          >
            <SearchPanel
              suburbs={suburbs}
              draft={draft}
              setDraft={setDraft}
              onClose={() => setOpen(false)}
              reset={() => setDraft(EMPTY)}
            />
          </div>
        </>
      ) : null}
    </>
  );
}
