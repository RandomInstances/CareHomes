"use client";

import Link from "next/link";
import { useState } from "react";

import { CompareTable, type DirectoryHome } from "@/app/directory";
import { FeatureRow } from "@/app/feature-icon";
import { HomeScene } from "@/app/home-scene";

function money(n: number) {
  return `LKR ${n.toLocaleString("en-LK")}`;
}

function fee(from: number | null, to: number | null) {
  if (!from && !to) return null;
  if (from && to && to > from) return `${money(from)} – ${to.toLocaleString("en-LK")}`;
  return money((from ?? to) as number);
}

export function SavedHomes({ homes }: { homes: DirectoryHome[] }) {
  const [comparing, setComparing] = useState(false);
  const [removing, setRemoving] = useState<string[]>([]);

  const visible = homes.filter((h) => !removing.includes(h.id));

  const remove = async (id: string) => {
    setRemoving((r) => [...r, id]);
    await fetch("/api/favourites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeId: id }),
    }).catch(() => undefined);
  };

  if (!visible.length) {
    return (
      <div className="bg-surface border border-line rounded-2xl p-10 text-center">
        <p className="font-semibold">Nothing saved yet.</p>
        <p className="text-sm text-ink-2 mt-1.5">
          Tap the heart on any home and it will be here when you come back.
        </p>
        <Link href="/" className="inline-block mt-4 text-sm font-semibold text-teal">
          Browse care homes
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="text-sm text-ink-2">
          {visible.length} home{visible.length === 1 ? "" : "s"} saved
        </p>
        {visible.length > 1 ? (
          <button
            type="button"
            onClick={() => setComparing(true)}
            className="inline-flex items-center gap-2 rounded-full bg-turmeric text-white font-bold px-5 py-2.5 shadow-[0_2px_10px_rgba(180,120,15,0.35)] hover:bg-[#9d6a0d] transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 6h7v12H3zM14 6h7v12h-7z" />
              <path d="M10 12h4" />
            </svg>
            Compare these homes
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-7">
        {visible.map((home) => (
          <div key={home.id} className="group">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-2.5">
              <Link href={`/${home.suburb.slug}/${home.slug}`} target="_blank" rel="noopener" className="block absolute inset-0">
                <HomeScene slug={home.slug} suburbName={home.suburb.name} className="absolute inset-0 w-full h-full" />
              </Link>
              <button
                type="button"
                onClick={() => remove(home.id)}
                aria-label={`Remove ${home.name} from your saved homes`}
                className="absolute right-2.5 top-2.5 w-8 h-8 rounded-full grid place-items-center bg-white/85 backdrop-blur-sm shadow-[0_1px_4px_rgba(23,48,45,0.18)] hover:bg-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="19" height="19" fill="#b4780f" stroke="#b4780f" strokeWidth="1.4">
                  <path d="M12 21s-7.5-4.7-7.5-10A4.4 4.4 0 0 1 12 7.6 4.4 4.4 0 0 1 19.5 11c0 5.3-7.5 10-7.5 10z" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <Link href={`/${home.suburb.slug}/${home.slug}`} target="_blank" rel="noopener">
                <h3 className="font-semibold text-[15px] sm:text-[16px] leading-snug">{home.name}</h3>
              </Link>
              <p className="inline-flex items-center gap-1.5 text-[13.5px] font-medium whitespace-nowrap shrink-0">
                <span aria-hidden className={`w-2 h-2 rounded-full ${home.bedsAvailable ? "bg-[#12b76a]" : "bg-turmeric"}`} />
                {home.bedsAvailable ? (
                  <span className="font-semibold text-[#07794f]">
                    {home.bedsTotal ? `${home.bedsAvailable}/${home.bedsTotal}` : home.bedsAvailable} beds free
                  </span>
                ) : (
                  <span className="text-turmeric">Waiting list</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mt-0.5">
              <p className="text-[13.5px] sm:text-[14.5px] text-ink-2 truncate">{home.suburb.name}</p>
              <FeatureRow features={home.features} max={3} />
            </div>

            {fee(home.feeFrom, home.feeTo) ? (
              <p className="mt-1.5 text-[13.5px] sm:text-[14.5px]">
                <span className="text-ink-2">from </span>
                <span className="font-bold tabular-nums whitespace-nowrap">{fee(home.feeFrom, home.feeTo)}</span>
                <span className="text-ink-2"> / month</span>
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {comparing ? <CompareTable homes={visible} onClose={() => setComparing(false)} /> : null}
    </>
  );
}
