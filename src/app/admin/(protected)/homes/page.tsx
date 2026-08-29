import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  LIVE: "bg-teal-50 text-teal-800 border-teal-200",
  PENDING_REVIEW: "bg-amber-50 text-amber-800 border-amber-200",
  DRAFT: "bg-stone-100 text-stone-600 border-stone-300",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABEL: Record<string, string> = {
  LIVE: "Live",
  PENDING_REVIEW: "Pending",
  DRAFT: "Draft",
  SUSPENDED: "Suspended",
};

export default async function HomesList() {
  await requireAdmin();

  // Same ordering the public site uses: verified first, then most recently
  // updated by their owner.
  const homes = await db.home.findMany({
    orderBy: [{ tier: "asc" }, { ownerUpdatedAt: "desc" }, { name: "asc" }],
    include: { suburb: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Homes</h1>
        <Link
          href="/admin/homes/new"
          className="rounded-full bg-teal-800 text-white text-sm font-semibold px-4 py-2"
        >
          Add a home
        </Link>
      </div>

      {homes.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
          <p className="font-medium">No homes yet.</p>
          <p className="text-sm text-stone-500 mt-1">
            Add the first one, or add the Colombo suburbs from the dashboard if you
            have not already.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-left text-stone-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Suburb</th>
                  <th className="px-4 py-2.5 font-medium">Fee / month</th>
                  <th className="px-4 py-2.5 font-medium">Beds</th>
                  <th className="px-4 py-2.5 font-medium">Tier</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {homes.map((home) => (
                  <tr key={home.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/homes/${home.id}`} className="font-medium text-teal-800 hover:underline">
                        {home.name}
                      </Link>
                      {home.isBlanketHome ? (
                        <span className="ml-2 text-xs text-stone-500">Blanket</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{home.suburb.name}</td>
                    <td className="px-4 py-3 tabular-nums text-stone-600">
                      {home.feeFrom ? `LKR ${home.feeFrom.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-stone-600">
                      {home.bedsAvailable ?? "—"} / {home.bedsTotal ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {home.tier === "VERIFIED" ? (
                        <span className="inline-block rounded-full border border-teal-200 bg-teal-50 text-teal-800 px-2 py-0.5 text-xs font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="text-stone-400 text-xs">Unverified</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
                          STATUS_STYLE[home.status] ?? ""
                        }`}
                      >
                        {STATUS_LABEL[home.status] ?? home.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
