import Link from "next/link";

import { SearchTrigger } from "@/app/search-trigger";

export function SiteHeader({ query }: { query?: string }) {
  return (
    <header className="bg-surface border-b border-line sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 h-14 sm:h-16 flex items-center gap-3 sm:gap-5">
        <Link href="/" className="shrink-0">
          <span className="block font-display font-bold text-[17px] sm:text-xl leading-none">
            carehomes<span className="text-teal">.lk</span>
          </span>
        </Link>

        <SearchTrigger query={query} />
      </div>
    </header>
  );
}
