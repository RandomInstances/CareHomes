// Loads the demo listings at container start when SEED_DEMO is set.
//
// Runs from the npm `start` script, inside Railway, where DATABASE_URL resolves
// to the private Postgres address. Idempotent: it upserts by slug, so restarts
// and redeploys do not duplicate anything.
//
// Unset SEED_DEMO in Railway when real listings replace these. While it is set,
// removing the demo homes from the admin panel is undone by the next deploy —
// which is the intended behaviour while the site is a demo, and a trap
// afterwards.

import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

if (!process.env.SEED_DEMO) {
  console.log("[seed-demo] SEED_DEMO not set — skipping.");
  process.exit(0);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("[seed-demo] DATABASE_URL is not set — skipping.");
  process.exit(0);
}

const homes = JSON.parse(readFileSync(new URL("../prisma/demo-homes.json", import.meta.url), "utf8"));
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

try {
  let created = 0;
  for (const home of homes) {
    const suburb =
      (await db.suburb.findUnique({ where: { slug: home.suburbSlug } })) ??
      (await db.suburb.create({
        data: { name: home.suburbName, slug: home.suburbSlug, sortOrder: 99 },
      }));

    const data = {
      name: home.name,
      description: home.description,
      suburbId: suburb.id,
      lat: home.lat,
      lng: home.lng,
      feeFrom: home.feeFrom,
      feeTo: home.feeTo,
      feeExcludes: home.feeExcludes,
      bedsTotal: home.bedsTotal,
      bedsAvailable: home.bedsAvailable,
      roomTypes: home.roomTypes,
      careTypes: home.careTypes,
      features: home.features,
      languages: home.languages,
      nightNurses: home.nightNurses,
      doctorArrangement: home.doctorArrangement,
      transferHospital: home.transferHospital,
      visitingHours: home.visitingHours,
      phone: home.phone,
      whatsapp: home.whatsapp,
      isBlanketHome: home.isBlanketHome,
      status: "LIVE",
      tier: home.verified ? "VERIFIED" : "UNVERIFIED",
      verifiedAt: home.verified ? new Date(home.ownerUpdatedAt) : null,
      ownerUpdatedAt: new Date(home.ownerUpdatedAt),
    };

    await db.home.upsert({
      where: { slug: home.slug },
      create: { slug: home.slug, ...data },
      update: data,
    });
    created++;
  }
  console.log(`[seed-demo] ${created} demo listings loaded.`);
} catch (error) {
  // Never block the server from starting over demo data.
  console.error("[seed-demo] failed:", error instanceof Error ? error.message : error);
} finally {
  await db.$disconnect();
}
