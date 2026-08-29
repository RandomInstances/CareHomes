import Link from "next/link";
import { notFound } from "next/navigation";

import { createOwnerAccount, deleteHome, updateHome } from "@/app/admin/actions";
import { HomeForm } from "@/app/admin/home-form";
import { OwnerPanel } from "@/app/admin/owner-panel";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [home, suburbs] = await Promise.all([
    db.home.findUnique({
      where: { id },
      include: { owners: { include: { owner: true } }, visits: { orderBy: { visitedOn: "desc" } } },
    }),
    db.suburb.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!home) notFound();

  const updateThisHome = updateHome.bind(null, home.id);
  const owners = home.owners.map((link) => ({
    id: link.owner.id,
    name: link.owner.name,
    phone: link.owner.phone,
    hasPassword: link.owner.passwordHash !== null,
    lastLoginAt: link.owner.lastLoginAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/homes" className="text-sm text-stone-500 hover:text-stone-900">
            ← Homes
          </Link>
          <h1 className="text-2xl font-semibold mt-1">{home.name}</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {home.verifiedAt
              ? `Verified ${home.verifiedAt.toLocaleDateString("en-GB")}`
              : "Not verified"}
            {home.visits.length ? ` · ${home.visits.length} field visit${home.visits.length > 1 ? "s" : ""} recorded` : " · no field visit recorded"}
          </p>
        </div>
        <form action={deleteHome}>
          <input type="hidden" name="id" value={home.id} />
          <button type="submit" className="text-sm text-red-700 hover:underline">
            Delete
          </button>
        </form>
      </div>

      <HomeForm
        action={updateThisHome}
        suburbs={suburbs}
        submitLabel="Save changes"
        values={{
          name: home.name,
          slug: home.slug,
          description: home.description,
          suburbId: home.suburbId,
          address: home.address,
          lat: home.lat,
          lng: home.lng,
          feeFrom: home.feeFrom,
          feeTo: home.feeTo,
          feeExcludes: home.feeExcludes,
          bedsTotal: home.bedsTotal,
          bedsAvailable: home.bedsAvailable,
          roomTypes: home.roomTypes,
          accepts: home.accepts,
          notAccepted: home.notAccepted,
          minAge: home.minAge,
          maxAge: home.maxAge,
          careTypes: home.careTypes,
          features: home.features,
          languages: home.languages,
          nightNurses: home.nightNurses,
          doctorArrangement: home.doctorArrangement,
          transferHospital: home.transferHospital,
          visitingHours: home.visitingHours,
          phone: home.phone,
          whatsapp: home.whatsapp,
          email: home.email,
          status: home.status,
          tier: home.tier,
          nseRegistered: home.nseRegistered,
          isBlanketHome: home.isBlanketHome,
        }}
      />

      <OwnerPanel homeId={home.id} owners={owners} action={createOwnerAccount} />
    </div>
  );
}
