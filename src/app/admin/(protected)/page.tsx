import Link from "next/link";

import { loadDemoListings, removeDemoListings, seedSuburbs } from "@/app/admin/actions";
import { DEMO_SLUGS } from "@/lib/demo-data";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();

  const [homes, live, verified, suburbs, enquiries, owners, demoCount] = await Promise.all([
    db.home.count(),
    db.home.count({ where: { status: "LIVE" } }),
    db.home.count({ where: { tier: "VERIFIED" } }),
    db.suburb.count(),
    db.enquiry.count(),
    db.owner.count(),
    db.home.count({ where: { slug: { in: [...DEMO_SLUGS] } } }),
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

      <div
        className={`border rounded-xl p-5 space-y-3 ${
          demoCount > 0 ? "bg-red-50 border-red-300" : "bg-white border-stone-200"
        }`}
      >
        <div>
          <h2 className="font-semibold">
            {demoCount > 0 ? `${demoCount} demo listings are live` : "Demo listings"}
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-prose">
            {demoCount > 0 ? (
              <>
                These are <b>fictional homes with invented phone numbers</b>, showing on
                the public site right now. Remove them before carehomes.lk goes live —
                a family ringing a made-up number looking for care for their parent is
                exactly what this must never do.
              </>
            ) : (
              <>
                Loads the 14 sample homes from the original prototype so you can see the
                site working before real listings are collected. They are fictional, with
                fake phone numbers, and can be removed in one click.
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <form action={loadDemoListings}>
            <button
              type="submit"
              className="rounded-full bg-stone-900 text-white text-sm font-semibold px-4 py-2"
            >
              {demoCount > 0 ? "Reload demo listings" : "Load 14 demo listings"}
            </button>
          </form>
          {demoCount > 0 ? (
            <form action={removeDemoListings}>
              <button
                type="submit"
                className="rounded-full border border-red-300 bg-white text-red-700 text-sm font-semibold px-4 py-2"
              >
                Remove all demo listings
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
