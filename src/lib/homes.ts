import "server-only";

import { db } from "@/lib/db";

// Verified homes rank ahead of unverified ones, then most recently updated by
// their owner. Enum order is UNVERIFIED, VERIFIED — so descending puts verified
// first without a second query.
const LISTING_ORDER = [
  { tier: "desc" as const },
  { ownerUpdatedAt: "desc" as const },
  { name: "asc" as const },
];

export type ListedHome = Awaited<ReturnType<typeof listHomes>>[number];

// Icon paths carried over from the prototype's category bar, unchanged.
export const CARE_TYPES = [
  {
    value: "ASSISTED_LIVING",
    label: "Assisted living",
    icon: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M7 10V7h6v3"/>',
  },
  {
    value: "NURSING",
    label: "Nursing care",
    icon: '<path d="M12 4v6m-3-3h6"/><path d="M5 21v-8a7 7 0 0 1 14 0v8"/>',
  },
  {
    value: "DEMENTIA",
    label: "Dementia care",
    icon: '<path d="M12 4a6 6 0 0 0-6 6c0 2 .8 3 .8 4.6L6 20h9v-3h2a1 1 0 0 0 1-1v-2.4l1.4-.9-1.7-2.5A6 6 0 0 0 12 4z"/>',
  },
  {
    value: "RESPITE",
    label: "Respite",
    icon: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  },
  {
    value: "PALLIATIVE",
    label: "Palliative care",
    icon: '<path d="M12 20s-7-4.4-7-9.5A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.5C19 15.6 12 20 12 20z"/>',
  },
  {
    value: "REHAB",
    label: "Rehab",
    icon: '<path d="M4 20h16"/><path d="M6 20V9l6-4 6 4v11"/><path d="M9 20v-6h6v6"/>',
  },
] as const;

export const ALL_HOMES_ICON =
  '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>';

export type CareTypeValue = (typeof CARE_TYPES)[number]["value"];

export function isCareType(value: string | undefined): value is CareTypeValue {
  return !!value && CARE_TYPES.some((c) => c.value === value);
}

export async function listHomes(
  options: { suburbSlug?: string; query?: string; careType?: CareTypeValue } = {}
) {
  const { suburbSlug, query, careType } = options;

  return db.home.findMany({
    where: {
      status: "LIVE",
      ...(careType ? { careTypes: { has: careType } } : {}),
      ...(suburbSlug ? { suburb: { slug: suburbSlug } } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" as const } },
              { suburb: { name: { contains: query, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    },
    orderBy: LISTING_ORDER,
    include: { suburb: true },
  });
}

export async function getHome(suburbSlug: string, homeSlug: string) {
  const home = await db.home.findUnique({
    where: { slug: homeSlug },
    include: { suburb: true, visits: { orderBy: { visitedOn: "desc" }, take: 1 } },
  });

  // The suburb is part of the URL, so a home reached under the wrong suburb is
  // a 404 rather than a redirect — two URLs for one page splits search ranking.
  if (!home || home.status !== "LIVE" || home.suburb.slug !== suburbSlug) return null;
  return home;
}

export async function listSuburbsWithCounts() {
  const suburbs = await db.suburb.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { homes: { where: { status: "LIVE" } } } } },
  });
  return suburbs.filter((s) => s._count.homes > 0);
}

export function formatFee(from: number | null, to: number | null) {
  if (!from && !to) return null;
  const fmt = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;
  if (from && to && to > from) return `${fmt(from)} – ${to.toLocaleString("en-LK")}`;
  return fmt((from ?? to) as number);
}

/// Pre-fills the message so the home receives a readable enquiry rather than a
/// bare "hi". The number belongs to the home, not to us.
export function whatsappLink(number: string, homeName: string) {
  const digits = number.replace(/\D/g, "");
  const text = `Hi, I found ${homeName} on carehomes.lk and would like to ask about a place for my relative.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
