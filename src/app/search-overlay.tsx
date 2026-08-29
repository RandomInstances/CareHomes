"use client";

import { useRouter } from "next/navigation";

import type { SearchDraft } from "@/app/search-trigger";
import { CARE_TYPES, FEE_MAX } from "@/lib/catalog";

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

/// Plain language, mapped to the category it implies — and carrying that
/// category's icon and colour, so the panel and the tabs read as one system.
const NEEDS = [
  { care: "ELDER_HOME", label: "Help day to day", hint: "Washing, dressing, meals, company" },
  { care: "NURSING_HOME", label: "Nursing care", hint: "Wounds, tubes, dementia, monitoring" },
  { care: "REHAB", label: "Recovering", hint: "Physiotherapy and rehabilitation" },
].map((n) => {
  const cat = CARE_TYPES.find((c) => c.value === n.care)!;
  return { ...n, icon: cat.icon, color: cat.color };
});

const SECTION_ICONS = {
  where: { color: "#0E5C55", path: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>' },
  age: { color: "#31456E", path: '<circle cx="12" cy="7" r="3.2"/><path d="M5.5 20v-1.5A5.5 5.5 0 0 1 11 13h2a5.5 5.5 0 0 1 5.5 5.5V20"/>' },
  budget: { color: "#B4780F", path: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.4"/>' },
};

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

  const Heading = ({ k, children }: { k: keyof typeof SECTION_ICONS; children: React.ReactNode }) => (
    <h2 className="flex items-center gap-2 font-semibold mb-2">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: SECTION_ICONS[k].color }}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: SECTION_ICONS[k].path }}
      />
      {children}
    </h2>
  );

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-[13.5px] transition-colors ${
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

      <div className="px-4 sm:px-7 py-6 sm:py-5 pb-28 sm:pb-5 space-y-6 sm:space-y-5">
        <section>
          <Heading k="where">Where would suit?</Heading>
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
          <p className="text-[12.5px] text-muted mt-2">
            Pick a few — widening beyond one suburb is usually what finds a bed.
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-7">
          <section>
            <div className="flex items-baseline justify-between gap-3">
              <Heading k="age">Their age</Heading>
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
            <output className="block text-[24px] font-bold tabular-nums leading-none mb-2" style={{ color: SECTION_ICONS.age.color }}>
              {draft.age || "Any"}
            </output>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={draft.age || 78}
              onChange={(e) => setDraft({ ...draft, age: e.target.value })}
              aria-label="Age of the person needing care"
              className="w-full"
              style={{ accentColor: SECTION_ICONS.age.color }}
            />
            <div className="flex justify-between text-[12px] text-muted mt-1 tabular-nums">
              <span>50</span>
              <span>100</span>
            </div>
          </section>

          <section>
            <Heading k="budget">Monthly budget</Heading>
            <div className="grid grid-cols-2 gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setDraft({ ...draft, budget: b.value })}
                  aria-pressed={draft.budget === b.value}
                  className={`rounded-xl border px-3 py-2.5 text-[14px] text-left transition-colors ${
                    draft.budget === b.value
                      ? "border-turmeric bg-turmeric-soft text-turmeric font-semibold"
                      : "border-line-2 bg-surface hover:border-turmeric"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section>
          <h2 className="font-semibold mb-2">What kind of help do they need?</h2>
          <div className="grid sm:grid-cols-3 gap-2.5">
            {NEEDS.map((n) => {
              const on = draft.needs.includes(n.care);
              return (
                <button
                  key={n.care}
                  type="button"
                  onClick={() => toggle("needs", n.care)}
                  aria-pressed={on}
                  className={`rounded-2xl border-2 p-3.5 text-left transition-colors ${
                    on ? "bg-surface" : "border-line-2 bg-surface hover:border-line"
                  }`}
                  style={on ? { borderColor: n.color } : undefined}
                >
                  <span
                    className="grid place-items-center w-10 h-10 rounded-full mb-2"
                    style={{ backgroundColor: `${n.color}1A`, color: n.color }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      dangerouslySetInnerHTML={{ __html: n.icon }}
                    />
                  </span>
                  <span className="block text-[15px] font-semibold" style={on ? { color: n.color } : undefined}>
                    {n.label}
                  </span>
                  <span className="block text-[13px] text-muted mt-0.5">{n.hint}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 inset-x-0 sm:static bg-surface border-t border-line">
        <div className="px-4 sm:px-7 py-3 flex items-center justify-between gap-4">
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
