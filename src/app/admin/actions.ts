"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { checkAdminPassword, generatePassword, hashPassword, requireAdmin } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import { db } from "@/lib/db";
import { CareType, HomeStatus, HomeTier, Language } from "@/generated/prisma";
import { DEMO_HOMES, DEMO_SLUGS } from "@/lib/demo-data";

// Colombo suburb taxonomy. Filters and the SEO landing pages both key off this,
// so it is reference data rather than something typed per home.
const COLOMBO_SUBURBS = [
  "Colombo 3 (Kollupitiya)", "Colombo 4 (Bambalapitiya)", "Colombo 5 (Havelock Town)",
  "Colombo 6 (Wellawatte)", "Colombo 7 (Cinnamon Gardens)", "Colombo 8 (Borella)",
  "Battaramulla", "Dehiwela", "Kotte", "Maharagama", "Malabe", "Moratuwa",
  "Mount Lavinia", "Nawala", "Nugegoda", "Pannipitiya", "Rajagiriya", "Ratmalana",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function adminLogin(_prev: string | null | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    // Deliberately vague, and slow enough to make guessing tedious.
    await new Promise((r) => setTimeout(r, 600));
    return "That password is not correct.";
  }
  await createSession({ role: "admin", name: "Admin" });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Suburbs
// ---------------------------------------------------------------------------

export async function seedSuburbs() {
  await requireAdmin();
  for (const [index, name] of COLOMBO_SUBURBS.entries()) {
    const slug = slugify(name);
    const existing = await db.suburb.findUnique({ where: { slug } });
    if (existing) continue;
    await db.suburb.create({ data: { name, slug, sortOrder: index } });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/homes");
}

// ---------------------------------------------------------------------------
// Homes
// ---------------------------------------------------------------------------

function list(formData: FormData, field: string) {
  return String(formData.get(field) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function num(formData: FormData, field: string) {
  const raw = String(formData.get(field) ?? "").replace(/[^0-9.-]/g, "");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function enums<T extends string>(formData: FormData, field: string, valid: readonly T[]): T[] {
  return formData.getAll(field).map(String).filter((v): v is T => (valid as readonly string[]).includes(v));
}

function homeDataFrom(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  return {
    name,
    slug: slugify(slugInput || name),
    description: String(formData.get("description") ?? "").trim(),
    suburbId: String(formData.get("suburbId") ?? ""),
    address: String(formData.get("address") ?? "").trim() || null,
    lat: num(formData, "lat"),
    lng: num(formData, "lng"),
    feeFrom: num(formData, "feeFrom"),
    feeTo: num(formData, "feeTo"),
    feeExcludes: list(formData, "feeExcludes"),
    bedsTotal: num(formData, "bedsTotal"),
    bedsAvailable: num(formData, "bedsAvailable"),
    roomTypes: list(formData, "roomTypes"),
    careTypes: enums(formData, "careTypes", Object.values(CareType)),
    features: list(formData, "features"),
    languages: enums(formData, "languages", Object.values(Language)),
    nightNurses: num(formData, "nightNurses"),
    doctorArrangement: String(formData.get("doctorArrangement") ?? "").trim() || null,
    transferHospital: String(formData.get("transferHospital") ?? "").trim() || null,
    visitingHours: String(formData.get("visitingHours") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    status: (formData.get("status") as HomeStatus) ?? HomeStatus.PENDING_REVIEW,
    tier: (formData.get("tier") as HomeTier) ?? HomeTier.UNVERIFIED,
    nseRegistered: formData.get("nseRegistered") === "on",
    isBlanketHome: formData.get("isBlanketHome") === "on",
  };
}

export async function createHome(_prev: string | null | undefined, formData: FormData) {
  await requireAdmin();
  const data = homeDataFrom(formData);

  if (!data.name) return "The home needs a name.";
  if (!data.suburbId) return "Choose a suburb. If the list is empty, add the Colombo suburbs from the dashboard first.";

  const clash = await db.home.findUnique({ where: { slug: data.slug } });
  if (clash) return `The web address "${data.slug}" is already used by another home. Give this one a different name or slug.`;

  const home = await db.home.create({
    data: { ...data, verifiedAt: data.tier === HomeTier.VERIFIED ? new Date() : null },
  });

  revalidatePath("/admin/homes");
  redirect(`/admin/homes/${home.id}`);
}

export async function updateHome(id: string, _prev: string | null | undefined, formData: FormData) {
  await requireAdmin();
  const data = homeDataFrom(formData);

  if (!data.name) return "The home needs a name.";
  if (!data.suburbId) return "Choose a suburb.";

  const clash = await db.home.findUnique({ where: { slug: data.slug } });
  if (clash && clash.id !== id) return `The web address "${data.slug}" belongs to another home.`;

  const before = await db.home.findUnique({ where: { id } });
  if (!before) return "That home no longer exists.";

  await db.home.update({
    data: {
      ...data,
      // Stamp the verification date the first time a home becomes verified.
      verifiedAt:
        data.tier === HomeTier.VERIFIED ? before.verifiedAt ?? new Date() : null,
    },
    where: { id },
  });

  await db.auditLog.create({
    data: { actor: "admin", action: "home.update", entity: "Home", entityId: id },
  });

  revalidatePath("/admin/homes");
  revalidatePath(`/admin/homes/${id}`);
  return "Saved.";
}

export async function deleteHome(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db.home.delete({ where: { id } });
  await db.auditLog.create({
    data: { actor: "admin", action: "home.delete", entity: "Home", entityId: id },
  });
  revalidatePath("/admin/homes");
  redirect("/admin/homes");
}

// ---------------------------------------------------------------------------
// Owner accounts — created here during onboarding, never self-signup.
// ---------------------------------------------------------------------------

export async function createOwnerAccount(_prev: string | null | undefined, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("ownerName") ?? "").trim();
  const phone = String(formData.get("ownerPhone") ?? "").trim();
  const homeId = String(formData.get("homeId") ?? "");

  if (!name || !phone) return "An owner needs a name and a phone number.";

  const existing = await db.owner.findUnique({ where: { phone } });
  if (existing) return `${phone} already has an account (${existing.name}).`;

  const password = generatePassword();
  const owner = await db.owner.create({
    data: {
      name,
      phone,
      status: "ACTIVE",
      passwordHash: await hashPassword(password),
      homes: { create: { homeId } },
    },
  });

  await db.auditLog.create({
    data: { actor: "admin", action: "owner.create", entity: "Owner", entityId: owner.id },
  });

  revalidatePath(`/admin/homes/${homeId}`);
  // Shown once. There is no reset flow yet, so it must be handed over now.
  return `Account created. Phone ${phone}, password ${password} — write this down, it is not shown again.`;
}

// ---------------------------------------------------------------------------
// Demo listings — fictional homes from the prototype, for showing the site
// working before real listings exist. See src/lib/demo-data.ts.
// ---------------------------------------------------------------------------

export async function loadDemoListings() {
  await requireAdmin();

  for (const home of DEMO_HOMES) {
    // Create the suburb if the demo needs one that was not in the standard list.
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
      feeExcludes: [...home.feeExcludes],
      bedsTotal: home.bedsTotal,
      bedsAvailable: home.bedsAvailable,
      roomTypes: [...home.roomTypes],
      careTypes: [...home.careTypes] as CareType[],
      features: [...home.features],
      languages: [...home.languages] as Language[],
      nightNurses: home.nightNurses,
      doctorArrangement: home.doctorArrangement,
      transferHospital: home.transferHospital,
      visitingHours: home.visitingHours,
      phone: home.phone,
      whatsapp: home.whatsapp,
      isBlanketHome: home.isBlanketHome,
      status: HomeStatus.LIVE,
      tier: home.verified ? HomeTier.VERIFIED : HomeTier.UNVERIFIED,
      verifiedAt: home.verified ? new Date(home.ownerUpdatedAt) : null,
      ownerUpdatedAt: new Date(home.ownerUpdatedAt),
    };

    await db.home.upsert({
      where: { slug: home.slug },
      create: { slug: home.slug, ...data },
      update: data,
    });
  }

  await db.auditLog.create({
    data: { actor: "admin", action: "demo.load", entity: "Home", entityId: "demo" },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/homes");
}

export async function removeDemoListings() {
  await requireAdmin();

  await db.home.deleteMany({ where: { slug: { in: [...DEMO_SLUGS] } } });
  await db.auditLog.create({
    data: { actor: "admin", action: "demo.remove", entity: "Home", entityId: "demo" },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/homes");
}
