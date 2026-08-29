import "server-only";

import { db } from "@/lib/db";
import type { CareType, Language, Prisma } from "@/generated/prisma";
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
  suburbSlugs?: string[];
  query?: string;
  careType?: CareTypeValue;
  careTypes?: string[];
  /// The home must accept every one of these, and must not list any of them as
  /// something it cannot take.
  accepts?: string[];
  /// Matched against each home's accepted age range.
  age?: number;
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
  const {
    suburbSlug, suburbSlugs, query, careType, careTypes, accepts,
    age, maxFee, languages, features, vacantOnly, sort,
  } = options;

  // Built imperatively rather than with conditional spreads: the spreads
  // produced a union type Prisma's generated input would not accept.
  const where: Prisma.HomeWhereInput = { status: "LIVE" };

  // Several needs widen the search rather than narrowing it — a home offering
  // any of them is worth showing.
  if (careTypes?.length) where.careTypes = { hasSome: careTypes as CareType[] };
  else if (careType) where.careTypes = { has: careType as CareType };

  // The home must accept everything asked for, and must not list any of it as
  // something it cannot take.
  if (accepts?.length) {
    where.accepts = { hasEvery: accepts };
    where.NOT = { notAccepted: { hasSome: accepts } };
  }

  // A home with no stated limit is not excluded — most have not filled it in.
  if (age && Number.isFinite(age)) {
    where.AND = [
      { OR: [{ minAge: null }, { minAge: { lte: age } }] },
      { OR: [{ maxAge: null }, { maxAge: { gte: age } }] },
    ];
  }

  if (suburbSlugs?.length) where.suburb = { slug: { in: suburbSlugs } };
  else if (suburbSlug) where.suburb = { slug: suburbSlug };

  if (maxFee && maxFee < FEE_MAX) where.feeFrom = { lte: maxFee };
  if (languages?.length) where.languages = { hasEvery: languages as Language[] };
  if (features?.length) where.features = { hasEvery: features };
  if (vacantOnly) where.bedsAvailable = { gt: 0 };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { suburb: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  return db.home.findMany({ where, orderBy: orderFor(sort), include: { suburb: true } });
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
  return suburbs
    .filter((s) => s._count.homes > 0)
    .sort((a, b) => b._count.homes - a._count.homes || a.name.localeCompare(b.name));
}

/// Pre-fills the message so the home receives a readable enquiry rather than a
/// bare "hi". The number belongs to the home, not to us.
export function whatsappLink(number: string, homeName: string) {
  const digits = number.replace(/\D/g, "");
  const text = `Hi, I found ${homeName} on carehomes.lk and would like to ask about a place for my relative.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

