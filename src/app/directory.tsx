"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { FilterBar } from "@/app/filters";
import { FeatureRow } from "@/app/feature-icon";
import { HomeScene } from "@/app/home-scene";

// Leaflet touches window on import, so it must not run during SSR.
const MapView = dynamic(() => import("@/app/map-view").then((m) => m.MapView), {
  ssr: false,
});

// Shortlist lives in the browser only: no account, nothing stored server-side,
// and it survives a reload. Same behaviour as the prototype.
const STORE_KEY = "carehomes-shortlist";

export type DirectoryHome = {
  id: string;
  name: string;
  slug: string;
  tier: string;
  feeFrom: number | null;
  feeTo: number | null;
  bedsTotal: number | null;
  bedsAvailable: number | null;
  lat: number | null;
  lng: number | null;
  careTypes: string[];
  features: string[];
  languages: string[];
  nightNurses: number | null;
  doctorArrangement: string | null;
  transferHospital: string | null;
  roomTypes: string[];
  feeExcludes: string[];
  suburb: { name: string; slug: string };
};

const CARE_LABEL: Record<string, string> = {
  ASSISTED_LIVING: "Assisted living",
  NURSING: "Nursing care",
  DEMENTIA: "Dementia care",
  RESPITE: "Respite",
  PALLIATIVE: "Palliative care",
  REHAB: "Rehab",
};

const LANG_LABEL: Record<string, string> = {
  SINHALA: "Sinhala",
  TAMIL: "Tamil",
  ENGLISH: "English",
};

function money(n: number) {
  return `LKR ${n.toLocaleString("en-LK")}`;
}

function feeText(from: number | null, to: number | null) {
  if (!from && !to) return null;
  if (from && to && to > from) return `${money(from)} – ${to.toLocaleString("en-LK")}`;
  return money((from ?? to) as number);
}

function useShortlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // Private browsing, or storage disabled. Shortlist just will not persist.
    }
    setReady(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        // Ignore: the in-memory shortlist still works for this visit.
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  return { ids, toggle, clear, ready };
}

function Card({
  home,
  saved,
  onToggle,
}: {
  home: DirectoryHome;
  saved: boolean;
  onToggle: (id: string) => void;
}) {
  const fee = feeText(home.feeFrom, home.feeTo);

  return (
    <div className="group">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-2.5 transition-shadow group-hover:shadow-[0_10px_26px_rgba(23,48,45,0.16)]">
        <Link href={`/${home.suburb.slug}/${home.slug}`} target="_blank" rel="noopener" className="block absolute inset-0">
          <HomeScene slug={home.slug} suburbName={home.suburb.name} className="absolute inset-0 w-full h-full" />
        </Link>

        {home.tier === "VERIFIED" ? (
          <span className="pointer-events-none absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1.5 text-[12.5px] font-bold text-ink">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-teal">
              <path d="m4 12 5 5L20 6" />
            </svg>
            Visited and verified
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => onToggle(home.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${home.name} from your shortlist` : `Add ${home.name} to your shortlist`}
          className="absolute right-2.5 top-2.5 w-8 h-8 rounded-full grid place-items-center"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill={saved ? "#b4780f" : "rgba(0,0,0,.35)"} stroke="#fff" strokeWidth="1.6">
            <path d="M12 21s-7.5-4.7-7.5-10A4.4 4.4 0 0 1 12 7.6 4.4 4.4 0 0 1 19.5 11c0 5.3-7.5 10-7.5 10z" />
          </svg>
        </button>
      </div>

      {/* Two balanced rows: name against availability, suburb against
          facilities. Everything left-aligned stacked left a dead strip down the
          right of the card, and facilities on their own row made a line taller
          than the ones around it, which read as a gap. */}
      <div className="flex items-baseline justify-between gap-3">
        <Link href={`/${home.suburb.slug}/${home.slug}`} target="_blank" rel="noopener">
          <h3 className="font-semibold text-[16px] leading-snug">{home.name}</h3>
        </Link>

        <p className="inline-flex items-center gap-1.5 text-[13.5px] font-medium whitespace-nowrap shrink-0">
          <span
            aria-hidden
            className={`w-1.5 h-1.5 rounded-full ${home.bedsAvailable ? "bg-[#2b6a4e]" : "bg-turmeric"}`}
          />
          {home.bedsAvailable ? (
            <span className="text-[#2b6a4e]">
              {home.bedsTotal ? `${home.bedsAvailable}/${home.bedsTotal}` : home.bedsAvailable} beds free
            </span>
          ) : (
            <span className="text-turmeric">
              Waiting list{home.bedsTotal ? ` · ${home.bedsTotal} beds` : ""}
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 mt-0.5">
        <p className="text-[14.5px] text-ink-2 truncate">{home.suburb.name}</p>

        <FeatureRow features={home.features} />
      </div>

      {fee ? (
        <p className="mt-1.5 text-[15.5px]">
          <span className="text-ink-2">from </span>
          <span className="font-bold tabular-nums">{fee}</span>
          <span className="text-ink-2"> / month</span>
        </p>
      ) : null}

    </div>
  );
}

function CompareTable({ homes, onClose }: { homes: DirectoryHome[]; onClose: () => void }) {
  const row = (label: string, render: (h: DirectoryHome) => React.ReactNode) => (
    <tr className="border-t border-line align-top">
      <th className="text-left font-semibold text-[13px] text-ink-2 py-3 pr-4 whitespace-nowrap">{label}</th>
      {homes.map((h) => (
        <td key={h.id} className="py-3 pr-6 text-[14px] min-w-[190px]">
          {render(h)}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-auto" onClick={onClose}>
      <div
        className="mx-auto max-w-5xl bg-surface rounded-2xl p-6 mt-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Compare shortlisted homes"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="text-xl font-semibold">Compare your shortlist</h2>
            <p className="text-sm text-ink-2 mt-0.5">Side by side, so you can ask each one the same questions.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-muted hover:text-ink">
            ×
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <th />
                {homes.map((h) => (
                  <td key={h.id} className="pb-2 pr-6 min-w-[190px]">
                    <Link href={`/${h.suburb.slug}/${h.slug}`} target="_blank" rel="noopener" className="font-semibold">
                      {h.name}
                    </Link>
                    <div className="text-xs text-muted">{h.suburb.name}</div>
                  </td>
                ))}
              </tr>
              {row("Fee / month", (h) => <span className="tabular-nums">{feeText(h.feeFrom, h.feeTo) ?? "—"}</span>)}
              {row("Not included", (h) => (h.feeExcludes.length ? h.feeExcludes.join(", ") : "—"))}
              {row("Beds available", (h) => (h.bedsAvailable ? `${h.bedsAvailable} of ${h.bedsTotal ?? "?"} free` : "Waiting list"))}
              {row("Rooms", (h) => (h.roomTypes.length ? h.roomTypes.join(", ") : "—"))}
              {row("Type of care", (h) => h.careTypes.map((c) => CARE_LABEL[c] ?? c).join(", ") || "—")}
              {row("Night nurses", (h) => h.nightNurses ?? "—")}
              {row("Doctor", (h) => h.doctorArrangement ?? "—")}
              {row("Hospital", (h) => h.transferHospital ?? "—")}
              {row("Languages", (h) => h.languages.map((l) => LANG_LABEL[l] ?? l).join(", ") || "—")}
              {row("Visited and verified", (h) => (h.tier === "VERIFIED" ? "Yes" : "Not yet"))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Directory({
  homes,
  basePath,
}: {
  homes: DirectoryHome[];
  basePath: string;
}) {
  const { ids, toggle, clear, ready } = useShortlist();
  const [comparing, setComparing] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const saved = homes.filter((h) => ids.includes(h.id));
  const rest = homes.filter((h) => !ids.includes(h.id));
  const mappable = homes.some((h) => typeof h.lat === "number" && typeof h.lng === "number");

  const grid = (list: DirectoryHome[]) => (
    <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((home) => (
        <Card key={home.id} home={home} saved={ids.includes(home.id)} onToggle={toggle} />
      ))}
    </div>
  );

  const toolbar = (
    <FilterBar
      basePath={basePath}
      extra={
        mappable ? (
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface px-4 py-2 text-sm font-semibold hover:border-teal"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" />
              <path d="M9 4v14M15 6v14" />
            </svg>
            Map
          </button>
        ) : null
      }
    />
  );

  // Render everything ungrouped until localStorage has been read, so the server
  // markup and the first client render agree.
  if (!ready) {
    return (
      <>
        {toolbar}
        <div className="mt-5">{grid(homes)}</div>
      </>
    );
  }

  return (
    <>
      {toolbar}
      <div className="mt-5" />
      {saved.length > 0 ? (
        <section className="mb-9">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">
              Your shortlist{" "}
              <span className="font-normal text-sm text-muted">
                {saved.length} home{saved.length > 1 ? "s" : ""}
              </span>
            </h2>
            <div className="flex gap-3 text-sm">
              {saved.length > 1 ? (
                <button type="button" onClick={() => setComparing(true)} className="font-semibold text-teal">
                  Compare
                </button>
              ) : null}
              <button type="button" onClick={clear} className="text-muted hover:text-ink">
                Clear
              </button>
            </div>
          </div>
          {grid(saved)}
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section>
          {saved.length > 0 ? <h2 className="text-lg font-semibold mb-3">All homes</h2> : null}
          {grid(rest)}
        </section>
      ) : null}

      {comparing ? <CompareTable homes={saved} onClose={() => setComparing(false)} /> : null}
      {mapOpen ? <MapView homes={homes} onClose={() => setMapOpen(false)} /> : null}
    </>
  );
}
