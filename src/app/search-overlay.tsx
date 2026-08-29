"use client";

import { useRouter } from "next/navigation";

import type { SearchDraft } from "@/app/search-trigger";
import { FEE_MAX } from "@/lib/catalog";

// The search panel. Where, age and budget come first because they are what a
// family already knows and what the collapsed control shows — opening this
// should never feel like a different question to the one you clicked on.
//
// NOTHING HERE IS STORED. Every answer becomes a URL parameter that filters the
// directory, which also makes a search shareable. There is deliberately no
// free-text field for medical conditions: it would make this site a holder of
// health data about a named person, and we hold care types and admission
// criteria, not diagnoses, so it could not filter anything either.

type Suburb = { name: string; slug: string; count: number };

/// Plain language on the left, the category it implies on the right.
const NEEDS: { label: string; hint: string; care: string }[] = [
  { label: "Help with day-to-day living", hint: "Washing, dressing, meals, company", care: "ELDER_HOME" },
  { label: "Nursing care", hint: "Wounds, tubes, dementia, close monitoring", care: "NURSING_HOME" },
  { label: "Recovering from surgery", hint: "Physiotherapy and rehabilitation", care: "REHAB" },
];

const BUDGETS = [
  { label: "Under 75,000", value: 75000 },
  { label: "Up to 150,000", value: 150000 },
  { label: "Up to 250,000", value: 250000 },
  { label: "Any budget", value: FEE_MAX },
];

export function SearchPanel({
  suburbs,
  draft,
  setDraft,
  onClose,
  reset,
}: {
  suburbs: Suburb[];
  draft: SearchDraft;
  setDraft: (d: SearchDraft) => void;
  onClose: () => void;
  reset: () => void;
}) {
  const router = useRouter();

  const toggle = (key: "places" | "needs", value: string) => {
    const list = draft[key];
    setDraft({
      ...draft,
      [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

  const submit = () => {
    const params = new URLSearchParams();
    draft.places.forEach((p) => params.append("suburb", p));
    draft.needs.forEach((n) => params.append("care", n));
    draft.requires.forEach((r) => params.append("accepts", r));
    if (draft.age) params.set("age", draft.age);
    if (draft.budget < FEE_MAX) params.set("fee", String(draft.budget));
    if (draft.language) params.append("lang", draft.language);
    const qs = params.toString();
    onClose();
    router.push(qs ? `/?${qs}` : "/");
  };

  const pill = (active: boolean) =>
    `rounded-full border px-3.5 py-2 text-sm transition-colors ${
      active
        ? "border-teal bg-teal-soft text-teal font-semibold"
        : "border-line-2 bg-surface hover:border-teal"
    }`;

  const card = (active: boolean) =>
    `rounded-2xl border px-4 py-3 text-left transition-colors ${
      active
        ? "border-teal bg-teal-soft text-teal font-semibold"
        : "border-line-2 bg-surface hover:border-teal"
    }`;

  return (
    <>
      {/* Phone-only header; on desktop the panel hangs under the site header. */}
      <div className="sm:hidden sticky top-0 bg-surface border-b border-line px-4 h-14 flex items-center justify-between">
        <span className="font-display font-bold text-[17px]">
          carehomes<span className="text-teal">.lk</span>
        </span>
        <button type="button" onClick={onClose} className="rounded-full border border-line-2 px-4 py-1.5 text-sm font-semibold">
          Close
        </button>
      </div>

      <div className="px-4 sm:px-7 py-6 sm:py-7 pb-28 sm:pb-7 space-y-7">
        <div className="grid gap-6 sm:grid-cols-[1fr_auto_auto] sm:gap-7 sm:items-start">
          <section>
            <h2 className="font-semibold mb-2.5">Where would suit?</h2>
            {suburbs.length ? (
              <div className="flex flex-wrap gap-2">
                {suburbs.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => toggle("places", s.slug)}
                    aria-pressed={draft.places.includes(s.slug)}
                    className={pill(draft.places.includes(s.slug))}
                  >
                    {s.name}
                    <span className="text-muted ml-1.5 tabular-nums">{s.count}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Loading suburbs…</p>
            )}
            <p className="text-[13px] text-muted mt-2.5">
              Pick a few — widening beyond one suburb is usually what finds a bed.
            </p>
          </section>

          <section className="sm:w-[190px]">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h2 className="font-semibold">Their age</h2>
              {draft.age ? (
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, age: "" })}
                  className="text-[13px] text-muted hover:text-ink"
                >
                  Any age
                </button>
              ) : null}
            </div>
            <output className="block text-[19px] font-bold tabular-nums mb-1">
              {draft.age || "Any age"}
            </output>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={draft.age || 78}
              onChange={(e) => setDraft({ ...draft, age: e.target.value })}
              aria-label="Age of the person needing care"
              className="w-full accent-teal"
            />
          </section>

          <section className="sm:w-[210px]">
            <h2 className="font-semibold mb-2.5">Monthly budget</h2>
            <div className="flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setDraft({ ...draft, budget: b.value })}
                  aria-pressed={draft.budget === b.value}
                  className={pill(draft.budget === b.value)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <hr className="border-line" />

        <section>
          <h2 className="font-semibold mb-2.5">What kind of help do they need?</h2>
          <div className="grid sm:grid-cols-3 gap-2.5">
            {NEEDS.map((n) => (
              <button
                key={n.care}
                type="button"
                onClick={() => toggle("needs", n.care)}
                aria-pressed={draft.needs.includes(n.care)}
                className={card(draft.needs.includes(n.care))}
              >
                <span className="block text-[15px]">{n.label}</span>
                <span className={`block text-[13px] mt-0.5 ${draft.needs.includes(n.care) ? "text-teal/80" : "text-muted"}`}>
                  {n.hint}
                </span>
              </button>
            ))}
          </div>
        </section>

      </div>

      <div className="fixed bottom-0 inset-x-0 sm:static bg-surface border-t border-line">
        <div className="px-4 sm:px-7 py-3.5 flex items-center justify-between gap-4">
          <button type="button" onClick={reset} className="text-sm text-muted hover:text-ink">
            Clear all
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-full bg-teal text-white font-semibold px-6 py-3"
          >
            Show homes
          </button>
        </div>
      </div>
    </>
  );
}
