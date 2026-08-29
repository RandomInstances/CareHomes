import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HomeCard } from "@/app/home-card";
import { SiteFooter, SiteHeader } from "@/app/site-header";
import { db } from "@/lib/db";
import { listHomes } from "@/lib/homes";

export const dynamic = "force-dynamic";

async function findSuburb(slug: string) {
  return db.suburb.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: PageProps<"/[suburb]">): Promise<Metadata> {
  const { suburb: slug } = await params;
  const suburb = await findSuburb(slug);
  if (!suburb) return {};

  return {
    title: `Care homes in ${suburb.name}`,
    description: `Compare care homes in ${suburb.name}, Colombo — monthly fees, beds available, types of care, and which homes our team has visited.`,
    alternates: { canonical: `/${suburb.slug}` },
  };
}

export default async function SuburbPage({ params }: PageProps<"/[suburb]">) {
  const { suburb: slug } = await params;
  const suburb = await findSuburb(slug);
  if (!suburb) notFound();

  const homes = await listHomes({ suburbSlug: slug });

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-8 flex-1 w-full">
        <nav className="text-sm text-muted mb-4">
          <Link href="/" className="hover:text-ink">
            Colombo
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">{suburb.name}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Care homes in {suburb.name}</h1>
          <p className="text-sm text-ink-2 mt-1">
            {homes.length} home{homes.length === 1 ? "" : "s"}
            {homes.length ? " · homes our team has visited appear first" : ""}
          </p>
        </div>

        {homes.length === 0 ? (
          <div className="bg-surface border border-line rounded-2xl p-10 text-center">
            <p className="font-semibold">No homes listed in {suburb.name} yet.</p>
            <Link href="/" className="inline-block mt-3 text-sm font-semibold text-teal">
              See homes across Colombo
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
