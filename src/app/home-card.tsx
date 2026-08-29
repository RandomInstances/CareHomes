import Link from "next/link";

import { HomeScene } from "@/app/home-scene";
import { formatFee } from "@/lib/homes";

type CardHome = {
  name: string;
  slug: string;
  tier: string;
  feeFrom: number | null;
  feeTo: number | null;
  bedsAvailable: number | null;
  suburb: { name: string; slug: string };
};

export function HomeCard({ home }: { home: CardHome }) {
  const fee = formatFee(home.feeFrom, home.feeTo);

  return (
    <Link
      href={`/${home.suburb.slug}/${home.slug}`}
      // New tab, so a family can keep several homes open side by side while
      // they compare — the way people actually shop for this.
      target="_blank"
      rel="noopener"
      className="group block"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-2.5 transition-shadow group-hover:shadow-[0_10px_26px_rgba(23,48,45,0.16)]">
        <HomeScene
          slug={home.slug}
          suburbName={home.suburb.name}
          className="absolute inset-0 w-full h-full"
        />

        {home.tier === "VERIFIED" ? (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1.5 text-[12.5px] font-bold text-ink">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-teal">
              <path d="m4 12 5 5L20 6" />
            </svg>
            Visited by our team
          </span>
        ) : null}
      </div>

      <h3 className="font-semibold text-[16px] leading-snug">{home.name}</h3>
      <p className="text-[14.5px] text-ink-2">{home.suburb.name}</p>
      <p className="text-[14.5px]">
        {home.bedsAvailable ? (
          <span className="text-[#2b6a4e]">
            {home.bedsAvailable} bed{home.bedsAvailable > 1 ? "s" : ""} available
          </span>
        ) : (
          <span className="text-turmeric">Waiting list</span>
        )}
      </p>
      {fee ? (
        <p className="mt-0.5 text-[15px]">
          <span className="font-bold tabular-nums">from {fee}</span>
          <span className="text-ink-2"> / month</span>
        </p>
      ) : null}
    </Link>
  );
}
