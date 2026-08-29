import Link from "next/link";

import { formatFee } from "@/lib/homes";

type CardHome = {
  name: string;
  slug: string;
  tier: string;
  feeFrom: number | null;
  feeTo: number | null;
  bedsAvailable: number | null;
  careTypes: string[];
  suburb: { name: string; slug: string };
};

const CARE_LABEL: Record<string, string> = {
  ASSISTED_LIVING: "Assisted living",
  NURSING: "Nursing",
  DEMENTIA: "Dementia",
  RESPITE: "Respite",
  PALLIATIVE: "Palliative",
  REHAB: "Rehab",
};

export function HomeCard({ home }: { home: CardHome }) {
  const fee = formatFee(home.feeFrom, home.feeTo);

  return (
    <Link
      href={`/${home.suburb.slug}/${home.slug}`}
      // Opens in a new tab so families can keep a list of homes open side by
      // side while they compare — the way people actually shop for this.
      target="_blank"
      rel="noopener"
      className="group block bg-[--ch-surface] border border-[--ch-line] rounded-2xl overflow-hidden hover:border-[--ch-teal] transition-colors"
    >
      <div className="aspect-[4/3] bg-[--ch-teal-soft] relative">
        {home.tier === "VERIFIED" ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 text-[11px] font-bold text-[--ch-ink]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="text-[--ch-teal]">
              <path d="m4 12 5 5L20 6" />
            </svg>
            Visited by our team
          </span>
        ) : null}
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-[17px] leading-snug group-hover:text-[--ch-teal]">
          {home.name}
        </h3>
        <p className="text-sm text-[--ch-ink-2]">{home.suburb.name}</p>
        <p className="text-sm text-[--ch-ink-2]">
          {home.bedsAvailable
            ? `${home.bedsAvailable} bed${home.bedsAvailable > 1 ? "s" : ""} available`
            : "Waiting list"}
        </p>
        {home.careTypes.length ? (
          <p className="text-xs text-[--ch-muted] pt-0.5">
            {home.careTypes.map((t) => CARE_LABEL[t] ?? t).join(" · ")}
          </p>
        ) : null}
        {fee ? (
          <p className="pt-1.5 font-semibold tabular-nums">
            from {fee} <span className="font-normal text-[--ch-ink-2] text-sm">/ month</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
