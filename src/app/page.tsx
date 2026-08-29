import Link from "next/link";

import { Suspense } from "react";

import { Directory } from "@/app/directory";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { CARE_TYPES, isCareType, isSort } from "@/lib/catalog";
import { listHomes, listSuburbsWithCounts } from "@/lib/homes";

export const dynamic = "force-dynamic";


export default async function DirectoryPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() || undefined : undefined;
  const careParam = typeof params.care === "string" ? params.care : undefined;
  const careType = isCareType(careParam) ? careParam : undefined;

  const many = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v : v ? [v] : [];

  const [homes, suburbs] = await Promise.all([
    listHomes({
      query,
      careType,
      careTypes: many(params.care),
      accepts: many(params.accepts),
      suburbSlugs: many(params.suburb),
      age: Number(params.age) || undefined,
      maxFee: Number(params.fee) || undefined,
      languages: many(params.lang),
      features: many(params.feature),
      vacantOnly: params.vacant === "1",
      sort: isSort(params.sort) ? params.sort : undefined,
    }),
    listSuburbsWithCounts(),
  ]);

  const activeCare = CARE_TYPES.find((c) => c.value === careType);
  const keep = query ? `&q=${encodeURIComponent(query)}` : "";

  const heading = query
    ? `Results for “${query}”`
    : activeCare
      ? `${activeCare.label} in Colombo`
      : "Care homes in Colombo";

  return (
    <>
      <SiteHeader query={query} activeCare={careType} />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 sm:py-7 flex-1 w-full">
        {suburbs.length > 0 ? (
          <nav className="flex gap-2 mb-6 overflow-x-auto -mx-4 px-4 sm:-mx-1 sm:px-1 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Suburbs">
            {suburbs.map((s) => (
              <Link
                key={s.id}
                href={`/${s.slug}`}
                className="shrink-0 rounded-full px-2.5 py-1 text-[13.5px] text-ink-2 whitespace-nowrap hover:bg-surface hover:text-teal transition-colors"
              >
                {s.name}
                <span className="text-muted ml-1 text-[12px] tabular-nums">{s._count.homes}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mt-5 mb-5">
          <h1 className="text-[19px] sm:text-[22px] font-semibold">{heading}</h1>
          <p className="text-sm text-ink-2 mt-1">
            {homes.length} home{homes.length === 1 ? "" : "s"}
            {homes.length ? " · visited and verified homes appear first" : ""}
          </p>
        </div>

        {homes.length === 0 ? (
          <div className="bg-surface border border-line rounded-2xl p-10 text-center">
            <p className="font-semibold">
              {query || careType ? "No homes match that." : "No homes listed yet."}
            </p>
            <p className="text-sm text-ink-2 mt-1.5 max-w-prose mx-auto">
              {query || careType
                ? "Try another type of care, or a suburb such as Nugegoda or Malabe."
                : "Listings are added as our team visits homes across Colombo."}
            </p>
            {query || careType ? (
              <Link href="/" className="inline-block mt-4 text-sm font-semibold text-teal">
                Clear and see all homes
              </Link>
            ) : null}
          </div>
        ) : (
          <Suspense fallback={null}>
            <Directory homes={homes} basePath="/" />
          </Suspense>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
