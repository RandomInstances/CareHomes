import Link from "next/link";

import { seedSuburbs } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();

  const [homes, live, verified, suburbs, enquiries, owners] = await Promise.all([
    db.home.count(),
    db.home.count({ where: { status: "LIVE" } }),
    db.home.count({ where: { tier: "VERIFIED" } }),
    db.suburb.count(),
    db.enquiry.count(),
    db.owner.count(),
  ]);

  const stats = [
    { label: "Homes", value: homes },
    { label: "Live", value: live },
    { label: "Verified", value: verified },
    { label: "Suburbs", value: suburbs },
    { label: "Enquiries", value: enquiries },
    { label: "Owner accounts", value: owners },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          href="/admin/homes/new"
          className="rounded-full bg-teal-800 text-white text-sm font-semibold px-4 py-2"
        >
          Add a home
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl px-4 py-3">
            <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
            <div className="text-sm text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      {suburbs === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
          <div>
            <h2 className="font-semibold">Add the Colombo suburbs first</h2>
            <p className="text-sm text-stone-600 mt-1 max-w-prose">
              Every home belongs to a suburb, and the suburb list drives both the filters
              and the search-engine landing pages. Adding them takes one click and is safe
              to run more than once.
            </p>
          </div>
          <form action={seedSuburbs}>
            <button
              type="submit"
              className="rounded-full bg-stone-900 text-white text-sm font-semibold px-4 py-2"
            >
              Add 18 Colombo suburbs
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
