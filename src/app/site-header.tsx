import Link from "next/link";

import { SearchTrigger } from "@/app/search-trigger";
import { ALL_HOMES_COLOR, ALL_HOMES_ICON, CARE_TYPES } from "@/lib/catalog";

function CategoryTab({
  href,
  label,
  icon,
  color,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  color: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2 px-3 h-full whitespace-nowrap text-[13px] font-semibold border-b-[2.5px] transition-colors ${
        active ? "text-ink border-ink" : "text-muted border-transparent hover:text-ink"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        // Colour stays on the icon whether or not the tab is selected: it is
        // what makes the row scannable rather than four grey shapes.
        style={{ color }}
        className="shrink-0"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      {label}
    </Link>
  );
}

/// Two rows: identity and categories on top, search beneath it with room to
/// breathe. Categories are navigation, so they belong at the top of every page
/// rather than only on the directory.
export function SiteHeader({ query, activeCare }: { query?: string; activeCare?: string }) {
  return (
    <header className="relative bg-surface border-b border-line sticky top-0 z-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 sm:relative">
        <div className="h-14 sm:h-[72px] flex sm:grid sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className="shrink-0 sm:absolute sm:left-6 lg:left-10 sm:top-1/2 sm:-translate-y-1/2 sm:z-10">
            <span className="block font-display font-bold text-[17px] sm:text-[26px] leading-none">
              carehomes<span className="text-teal">.lk</span>
            </span>
          </Link>

          <nav
            className="flex-1 sm:flex-none sm:col-start-2 min-w-0 h-full flex items-stretch gap-1 sm:gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Type of care"
          >
            <CategoryTab href="/" label="All homes" icon={ALL_HOMES_ICON} color={ALL_HOMES_COLOR} active={!activeCare} />
            {CARE_TYPES.map((c) => (
              <CategoryTab
                key={c.value}
                href={`/?care=${c.value}`}
                label={c.label}
                icon={c.icon}
                color={c.color}
                active={activeCare === c.value}
              />
            ))}
          </nav>
          {/* Sits in the third track, which also balances the wordmark so the
              nav stays on the container centre. */}
          <Link
            href="/list-your-home"
            className="hidden sm:inline-flex items-center sm:absolute sm:right-6 lg:right-10 sm:top-1/2 sm:-translate-y-1/2 sm:z-10 rounded-full border border-line-2 px-5 py-2.5 text-[15px] font-semibold whitespace-nowrap hover:border-teal hover:text-teal transition-colors"
          >
            List your care home
          </Link>
        </div>

        <div className="pb-5 pt-2.5 sm:pb-7 sm:pt-0 flex justify-center">
          <SearchTrigger query={query} />
        </div>
      </div>
    </header>
  );
}
