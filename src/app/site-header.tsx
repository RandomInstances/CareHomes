import Link from "next/link";

export function SiteHeader({ query }: { query?: string }) {
  return (
    <header className="bg-surface border-b border-line sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center gap-5">
        <Link href="/" className="shrink-0">
          <span className="block font-display font-bold text-xl leading-none">
            carehomes<span className="text-teal">.lk</span>
          </span>        </Link>

        <form action="/" className="flex-1 max-w-md">
          <label htmlFor="q" className="sr-only">
            Search a suburb or home
          </label>
          <div className="flex items-center gap-2 border border-line-2 rounded-full px-4 py-2 bg-bg focus-within:border-teal">
            <span className="text-sm text-muted shrink-0">Colombo</span>
            <span className="w-px h-4 bg-line-2" aria-hidden />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={query ?? ""}
              placeholder="Search a suburb or home"
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
            />
            <button type="submit" aria-label="Search" className="text-teal shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}

