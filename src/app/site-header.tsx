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
      className={`flex items-center gap-2 px-3 py-2.5 whitespace-nowrap text-[13px] font-semibold border-b-[2.5px] transition-colors ${
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
        // Colour stays on whether or not the tab is selected: it is what makes
        // the row scannable rather than four grey shapes.
        style={{ color }}
        className="shrink-0"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      {label}
    </Link>
  );
}

/// Desktop follows the Airbnb arrangement: wordmark, search and the owner link
/// on one line, categories underneath. Everything on the first line shares a
/// baseline, so nothing has to be nudged into place.
///
/// The phone layout is deliberately different and unchanged — wordmark beside
/// the scrolling categories, search on its own line beneath — because a search
/// bar squeezed between a wordmark and a link has no room at that width.
export function SiteHeader({ query, activeCare }: { query?: string; activeCare?: string }) {
  return (
    <header className="relative bg-surface border-b border-line sticky top-0 z-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-6">
        <Link
          href="/"
          className="row-start-1 col-start-1 shrink-0 h-14 sm:h-[76px] flex items-center"
        >
          <span className="block font-display font-bold text-[17px] sm:text-[26px] leading-none">
            carehomes<span className="text-teal">.lk</span>
          </span>
        </Link>

        <div className="row-start-2 col-start-1 col-span-2 pb-4 sm:pb-0 sm:row-start-1 sm:col-start-2 sm:col-span-1 flex justify-center">
          <SearchTrigger query={query} />
        </div>

        <Link
          href="/list-your-home"
          className="hidden sm:flex row-start-1 col-start-3 justify-self-end items-center text-[14px] font-medium text-ink-2 whitespace-nowrap hover:text-teal hover:underline underline-offset-4 transition-colors"
        >
          List your care home
        </Link>

        <nav
          className="row-start-1 col-start-2 sm:row-start-2 sm:col-start-1 sm:col-span-3 sm:justify-self-center min-w-0 flex items-stretch gap-1 sm:gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
      </div>
    </header>
  );
}
