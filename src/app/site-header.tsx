import Link from "next/link";

import { SearchTrigger } from "@/app/search-trigger";
import { ALL_HOMES_ICON, CARE_TYPES } from "@/lib/catalog";

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
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="h-14 flex items-center gap-4 sm:gap-8">
          <Link href="/" className="shrink-0">
            <span className="block font-display font-bold text-[17px] sm:text-xl leading-none">
              carehomes<span className="text-teal">.lk</span>
            </span>
          </Link>

          <nav
            className="flex-1 min-w-0 h-full flex items-stretch gap-1 sm:gap-2 sm:justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Type of care"
          >
            <CategoryTab href="/" label="All homes" icon={ALL_HOMES_ICON} active={!activeCare} />
            {CARE_TYPES.map((c) => (
              <CategoryTab
                key={c.value}
                href={`/?care=${c.value}`}
                label={c.label}
                icon={c.icon}
                active={activeCare === c.value}
              />
            ))}
          </nav>
        </div>

        <div className="pb-5 pt-2.5 flex justify-center">
          <SearchTrigger query={query} />
        </div>
      </div>
    </header>
  );
}
