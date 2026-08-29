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

export async function listHomes(options: { suburbSlug?: string; query?: string } = {}) {
  const { suburbSlug, query } = options;

  return db.home.findMany({
    where: {
      status: "LIVE",
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
