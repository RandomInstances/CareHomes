import { NextResponse } from "next/server";

import { listSuburbsWithCounts } from "@/lib/homes";

// The search overlay needs suburbs, but the header is on every page including
// the static ones. Querying the database from the header made those pages
// un-prerenderable; fetching here when the overlay actually opens keeps them
// static and saves a query on every page load.
export const dynamic = "force-dynamic";

export async function GET() {
  const suburbs = await listSuburbsWithCounts();
  return NextResponse.json(
    suburbs.map((s) => ({ name: s.name, slug: s.slug, count: s._count.homes }))
  );
}
