import Link from "next/link";

import { createHome } from "@/app/admin/actions";
import { HomeForm } from "@/app/admin/home-form";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewHomePage() {
  await requireAdmin();
  const suburbs = await db.suburb.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/homes" className="text-sm text-stone-500 hover:text-stone-900">
          ← Homes
        </Link>
        <h1 className="text-2xl font-semibold mt-1">Add a home</h1>
      </div>

      {suburbs.length === 0 ? (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          There are no suburbs yet. Add the Colombo suburbs from the dashboard first —
          a home cannot be saved without one.
        </p>
      ) : null}

      <HomeForm action={createHome} suburbs={suburbs} submitLabel="Create home" />
    </div>
  );
}
