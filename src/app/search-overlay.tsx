"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ADMISSION, FEE_MAX, LANGUAGES } from "@/lib/catalog";

// Full-screen search. The point is to ask what a family actually knows —
// roughly what help the person needs, where, what they can afford — rather than
// making them guess at care-industry vocabulary.
//
// NOTHING HERE IS STORED. Everything becomes URL parameters that filter the
// directory. There is deliberately no free-text field for conditions: it would
// make this site a holder of health data about a named person, and we hold care
// types, not diagnoses, so it could not filter anything either.

type Suburb = { name: string; slug: string; count: number };

/// Plain language on the left, the care type it implies on the right.
const NEEDS: { label: string; hint: string; care: string }[] = [
  { label: "Help with day-to-day living", hint: "Washing, dressing, meals, company", care: "ELDER_HOME" },
  { label: "Nursing care", hint: "Wounds, tubes, injections, dementia, close monitoring", care: "NURSING_HOME" },
  { label: "Recovering from surgery", hint: "Physiotherapy and a period of rehabilitation", care: "REHAB" },
];

const BUDGETS = [
  { label: "Under 75,000", value: 75000 },
  { label: "Up to 150,000", value: 150000 },
  { label: "Up to 250,000", value: 250000 },
  { label: "Any budget", value: FEE_MAX },
];

export function SearchOverlay({
  open,
  onClose,
  suburbs,
}: {
  open: boolean;
  onClose: () => void;
  suburbs: Suburb[];
}) {
  const router = useRouter();
  const [needs, setNeeds] = useState<string[]>([]);
  const [requires, setRequires] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(FEE_MAX);
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const submit = () => {
    const params = new URLSearchParams();
    // One care type filters the directory; several are kept so the results page
    // can widen across them rather than forcing a single choice.
    needs.forEach((n) => params.append("care", n));
    requires.forEach((r) => params.append("accepts", r));
    places.forEach((p) => params.append("suburb", p));
    if (budget < FEE_MAX) params.set("fee", String(budget));
    if (language) params.append("lang", language);
    const qs = params.toString();
    onClose();
    router.push(qs ? `/?${qs}` : "/");
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2.5 text-[15px] text-left transition-colors ${
      active
        ? "border-teal bg-teal-soft text-teal font-semibold"
        : "border-line-2 bg-surface hover:border-teal"
    }`;

  return (
    <div className="fixed inset-0 z-[70] bg-bg overflow-y-auto" role="dialog" aria-modal="true" aria-label="Find a care home">
      <div className="sticky top-0 bg-surface border-b border-line">
        <div className="mx-auto max-w-2xl px-4 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-4">
          <span className="font-display font-bold text-[17px] sm:text-xl">
            carehomes<span className="text-teal">.lk</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line-2 px-4 py-1.5 text-sm font-semibold hover:border-teal"
          >
            Close
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-5 py-8 pb-28 space-y-9">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Tell us who you are looking for</h1>
          <p className="text-[15px] text-ink-2 mt-2 max-w-[58ch]">
            Answer what you can. Everything stays in your browser — none of this is
            saved, and nothing is sent to any care home.
          </p>
        </div>

        <section>
          <h2 className="font-semibold mb-1">What kind of help do they need?</h2>
          <p className="text-[14px] text-ink-2 mb-3">Choose as many as apply.</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {NEEDS.map((n) => (
              <button
                key={n.care}
                type="button"
                onClick={() => toggle(needs, setNeeds, n.care)}
                aria-pressed={needs.includes(n.care)}
                className={chip(needs.includes(n.care))}
              >
                <span className="block">{n.label}</span>
                <span className={`block text-[13px] mt-0.5 ${needs.includes(n.care) ? "text-teal/80" : "text-muted"}`}>
                  {n.hint}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-1">Does the home need to accept anything specific?</h2>
          <p className="text-[14px] text-ink-2 mb-3">
            Homes tell us what they can and cannot take. Choosing here hides the ones
            that would have said no, so you are not ringing round to find out.
          </p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {ADMISSION.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => toggle(requires, setRequires, a.value)}
                aria-pressed={requires.includes(a.value)}
                className={chip(requires.includes(a.value))}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-1">Where would suit?</h2>
          <p className="text-[14px] text-ink-2 mb-3">
            Pick a few. Widening beyond one suburb is usually what finds a bed.
          </p>
          <div className="flex flex-wrap gap-2">
            {suburbs.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => toggle(places, setPlaces, s.slug)}
                aria-pressed={places.includes(s.slug)}
                className={`rounded-full border px-3.5 py-2 text-sm ${
                  places.includes(s.slug)
                    ? "border-teal bg-teal-soft text-teal font-semibold"
                    : "border-line-2 bg-surface hover:border-teal"
                }`}
              >
                {s.name}
                <span className="text-muted ml-1.5 tabular-nums">{s.count}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-3">What can you spend each month?</h2>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setBudget(b.value)}
                aria-pressed={budget === b.value}
                className={`rounded-full border px-4 py-2 text-sm ${
                  budget === b.value
                    ? "border-teal bg-teal-soft text-teal font-semibold"
                    : "border-line-2 bg-surface hover:border-teal"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-3">Language of care</h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLanguage(language === l.value ? "" : l.value)}
                aria-pressed={language === l.value}
                className={`rounded-full border px-4 py-2 text-sm ${
                  language === l.value
                    ? "border-teal bg-teal-soft text-teal font-semibold"
                    : "border-line-2 bg-surface hover:border-teal"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-surface border-t border-line">
        <div className="mx-auto max-w-2xl px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setNeeds([]);
              setRequires([]);
              setPlaces([]);
              setBudget(FEE_MAX);
              setLanguage("");
            }}
            className="text-sm text-muted hover:text-ink"
          >
            Clear
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
    </div>
  );
}
