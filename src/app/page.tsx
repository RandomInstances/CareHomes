import Link from "next/link";

import { HomeCard } from "@/app/home-card";
import { SiteFooter, SiteHeader } from "@/app/site-header";
import { ALL_HOMES_ICON, CARE_TYPES, isCareType, listHomes, listSuburbsWithCounts } from "@/lib/homes";

export const dynamic = "force-dynamic";

function CategoryTab({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center gap-1.5 px-3.5 pt-1 pb-2.5 text-xs font-semibold whitespace-nowrap border-b-[2.5px] ${
        active ? "text-ink border-ink" : "text-muted border-transparent hover:text-ink"
      }`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      {label}
    </Link>
  );
}

export default async function DirectoryPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() || undefined : undefined;
  const careParam = typeof params.care === "string" ? params.care : undefined;
  const careType = isCareType(careParam) ? careParam : undefined;

  const [homes, suburbs] = await Promise.all([
    listHomes({ query, careType }),
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
      <SiteHeader query={query} />

      {/* Care-type category bar, icons and all, as in the prototype. */}
      <div className="bg-surface border-b border-line">
        <div className="mx-auto max-w-6xl px-5 overflow-x-auto">
          <nav className="flex gap-1 min-w-max" aria-label="Type of care">
            <CategoryTab
              href={query ? `/?q=${encodeURIComponent(query)}` : "/"}
              label="All homes"
              icon={ALL_HOMES_ICON}
              active={!careType}
            />
            {CARE_TYPES.map((c) => (
              <CategoryTab
                key={c.value}
                href={`/?care=${c.value}${keep}`}
                label={c.label}
                icon={c.icon}
                active={careType === c.value}
              />
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-7 flex-1 w-full">
        {suburbs.length > 0 ? (
          <nav className="flex flex-wrap gap-2 mb-7" aria-label="Suburbs">
            {suburbs.map((s) => (
              <Link
                key={s.id}
                href={`/${s.slug}`}
                className="rounded-full border border-line-2 bg-surface px-3.5 py-1.5 text-sm hover:border-teal hover:text-teal"
              >
                {s.name}
                <span className="text-muted ml-1.5 tabular-nums">{s._count.homes}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mb-5">
          <h1 className="text-[22px] font-semibold">{heading}</h1>
          <p className="text-sm text-ink-2 mt-1">
            {homes.length} home{homes.length === 1 ? "" : "s"}
            {homes.length ? " · visited homes are checked by our team" : ""}
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
          <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
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
