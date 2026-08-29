import Link from "next/link";

import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

// This layout check is optimistic — layouts do not re-render on every
// navigation, so it is a convenience, not the security boundary. Every page and
// every Server Action calls requireAdmin() for itself.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="bg-white border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between gap-6">
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/admin" className="font-semibold">
              carehomes.lk <span className="text-stone-400 font-normal">admin</span>
            </Link>
            <Link href="/admin/homes" className="text-stone-600 hover:text-stone-900">
              Homes
            </Link>
            <Link href="/" className="text-stone-600 hover:text-stone-900">
              View site
            </Link>
          </nav>
          <form action={logout}>
            <button type="submit" className="text-sm text-stone-500 hover:text-stone-900">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
