"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { FEATURES, FEE_MAX, LANGUAGES, SORTS } from "@/lib/catalog";

// Filters live in the URL rather than in component state, so a filtered view can
// be shared, bookmarked and indexed. The sheet is only the way of editing them.

function money(n: number) {
  return `LKR ${n.toLocaleString("en-LK")}`;
}

export function FilterBar({ basePath, extra }: { basePath: string; extra?: React.ReactNode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const maxFee = Number(params.get("fee")) || FEE_MAX;
  const languages = params.getAll("lang");
  const features = params.getAll("feature");
  const vacant = params.get("vacant") === "1";
  const sort = params.get("sort") ?? "updated";

  const activeCount =
    (maxFee < FEE_MAX ? 1 : 0) + languages.length + features.length + (vacant ? 1 : 0);

  const apply = (next: URLSearchParams) => {
    const qs = next.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    apply(next);
  };

  const toggleMulti = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    const current = next.getAll(key);
    next.delete(key);
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updated.forEach((v) => next.append(key, v));
    apply(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams();
    const q = params.get("q");
    const care = params.get("care");
    if (q) next.set("q", q);
    if (care) next.set("care", care);
    apply(next);
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm ${
      active ? "border-teal bg-teal-soft text-teal font-semibold" : "border-line-2 bg-surface hover:border-teal"
    }`;

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface px-4 py-2 text-sm font-semibold hover:border-teal"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filters
          {activeCount > 0 ? (
            <span className="ml-0.5 rounded-full bg-ink text-white text-[11px] px-1.5 py-0.5 tabular-nums">
              {activeCount}
            </span>
          ) : null}
        </button>

        {extra}

        <label className="flex items-center gap-2 text-sm ml-auto">
          <span className="hidden sm:inline text-muted shrink-0">Sort</span>
          <span className="relative inline-flex items-center">
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value === "updated" ? null : e.target.value)}
              className="appearance-none rounded-full border border-line-2 bg-surface pl-3.5 pr-9 py-2 text-[13px] sm:text-sm leading-none text-ink cursor-pointer hover:border-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-3 text-muted"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </label>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-auto" onClick={() => setOpen(false)}>
          <div
            className="mx-auto max-w-lg bg-surface rounded-2xl mt-10"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-line">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-2xl leading-none text-muted hover:text-ink">
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              <div>
                <label htmlFor="fee" className="block text-sm font-semibold mb-2">
                  Monthly fee up to
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="fee"
                    type="range"
                    min={50000}
                    max={FEE_MAX}
                    step={10000}
                    defaultValue={maxFee}
                    onMouseUp={(e) => setParam("fee", (e.target as HTMLInputElement).value)}
                    onTouchEnd={(e) => setParam("fee", (e.target as HTMLInputElement).value)}
                    className="flex-1"
                  />
                  <output className="text-sm tabular-nums whitespace-nowrap">{money(maxFee)}</output>
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold mb-2">Language of care</span>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <button key={l.value} type="button" onClick={() => toggleMulti("lang", l.value)} className={chip(languages.includes(l.value))}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold mb-2">Must have</span>
                <div className="flex flex-wrap gap-2">
                  {FEATURES.map((f) => (
                    <button key={f} type="button" onClick={() => toggleMulti("feature", f)} className={chip(features.includes(f))}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={vacant}
                  onChange={(e) => setParam("vacant", e.target.checked ? "1" : null)}
                  className="rounded border-line-2"
                />
                Only homes with a bed available now
              </label>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-line">
              <button type="button" onClick={clearAll} className="text-sm text-muted hover:text-ink">
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-teal text-white text-sm font-semibold px-5 py-2.5"
              >
                Show homes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
