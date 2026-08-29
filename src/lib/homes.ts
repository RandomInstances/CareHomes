import "server-only";

import { db } from "@/lib/db";
import { FEE_MAX, type CareTypeValue, type SortValue } from "@/lib/catalog";

// Verified homes rank ahead of unverified ones, then most recently updated by
// their owner. Enum order is UNVERIFIED, VERIFIED — so descending puts verified
// first without a second query.
const LISTING_ORDER = [
  { tier: "desc" as const },
  { ownerUpdatedAt: "desc" as const },
  { name: "asc" as const },
];

export type ListedHome = Awaited<ReturnType<typeof listHomes>>[number];

export type HomeFilters = {
  suburbSlug?: string;
  query?: string;
  careType?: CareTypeValue;
  maxFee?: number;
  languages?: string[];
  features?: string[];
  vacantOnly?: boolean;
  sort?: SortValue;
};

function orderFor(sort: SortValue | undefined) {
  // Verified always leads, whatever the chosen sort — it is an evidence signal,
  // not a preference the visitor is overriding.
  const verifiedFirst = { tier: "desc" as const };
  switch (sort) {
    case "fee-asc":
      return [verifiedFirst, { feeFrom: "asc" as const }, { name: "asc" as const }];
    case "fee-desc":
      return [verifiedFirst, { feeFrom: "desc" as const }, { name: "asc" as const }];
    case "beds":
      return [verifiedFirst, { bedsAvailable: "desc" as const }, { name: "asc" as const }];
    default:
      return LISTING_ORDER;
  }
}

export async function listHomes(options: HomeFilters = {}) {
  const { suburbSlug, query, careType, maxFee, languages, features, vacantOnly, sort } = options;

  return db.home.findMany({
    where: {
      status: "LIVE",
      ...(careType ? { careTypes: { has: careType } } : {}),
      ...(suburbSlug ? { suburb: { slug: suburbSlug } } : {}),
      ...(maxFee && maxFee < FEE_MAX ? { feeFrom: { lte: maxFee } } : {}),
      ...(languages?.length ? { languages: { hasEvery: languages as never } } : {}),
      ...(features?.length ? { features: { hasEvery: features } } : {}),
      ...(vacantOnly ? { bedsAvailable: { gt: 0 } } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" as const } },
              { suburb: { name: { contains: query, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    },
    orderBy: orderFor(sort),
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

/// Pre-fills the message so the home receives a readable enquiry rather than a
/// bare "hi". The number belongs to the home, not to us.
export function whatsappLink(number: string, homeName: string) {
  const digits = number.replace(/\D/g, "");
  const text = `Hi, I found ${homeName} on carehomes.lk and would like to ask about a place for my relative.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

