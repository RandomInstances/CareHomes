import Link from "next/link";

import { HomeCard } from "@/app/home-card";
import { SiteFooter, SiteHeader } from "@/app/site-header";
import { listHomes, listSuburbsWithCounts } from "@/lib/homes";

export const dynamic = "force-dynamic";

export default async function DirectoryPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : undefined;

  const [homes, suburbs] = await Promise.all([
    listHomes({ query }),
    listSuburbsWithCounts(),
  ]);

  return (
    <>
      <SiteHeader query={query} />

      <main className="mx-auto max-w-6xl px-5 py-8 flex-1 w-full">
        {suburbs.length > 0 ? (
          <nav className="flex flex-wrap gap-2 mb-7" aria-label="Suburbs">
            {suburbs.map((s) => (
              <Link
                key={s.id}
                href={`/${s.slug}`}
                className="rounded-full border border-line-2 px-3.5 py-1.5 text-sm hover:border-teal hover:text-teal"
              >
                {s.name}
                <span className="text-muted ml-1.5 tabular-nums">{s._count.homes}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mb-5">
          <h1 className="text-2xl font-semibold">
            {query ? `Results for “${query}”` : "Care homes in Colombo"}
          </h1>
          <p className="text-sm text-ink-2 mt-1">
            {homes.length} home{homes.length === 1 ? "" : "s"}
            {homes.length ? " · homes our team has visited appear first" : ""}
          </p>
        </div>

        {homes.length === 0 ? (
          <div className="bg-surface border border-line rounded-2xl p-10 text-center">
            <p className="font-semibold">
              {query ? "No homes match that search." : "No homes listed yet."}
            </p>
            <p className="text-sm text-ink-2 mt-1.5 max-w-prose mx-auto">
              {query
                ? "Try a suburb name such as Nugegoda or Malabe."
                : "Listings are added as our team visits homes across Colombo. Check back shortly."}
            </p>
            {query ? (
              <Link href="/" className="inline-block mt-4 text-sm font-semibold text-teal">
                See all homes
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
