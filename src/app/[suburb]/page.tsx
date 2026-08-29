import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Suspense } from "react";

import { Directory } from "@/app/directory";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { db } from "@/lib/db";
import { isSort } from "@/lib/catalog";
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

export default async function SuburbPage({ params, searchParams }: PageProps<"/[suburb]">) {
  const { suburb: slug } = await params;
  const sp = await searchParams;
  const suburb = await findSuburb(slug);
  if (!suburb) notFound();

  const many = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

  const homes = await listHomes({
    suburbSlug: slug,
    maxFee: Number(sp.fee) || undefined,
    languages: many(sp.lang),
    features: many(sp.feature),
    vacantOnly: sp.vacant === "1",
    sort: isSort(sp.sort) ? sp.sort : undefined,
  });

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 flex-1 w-full">
        <nav className="text-sm text-muted mb-4">
          <Link href="/" className="hover:text-ink">
            Colombo
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">{suburb.name}</span>
        </nav>

        <div className="mt-5 mb-6">
          <h1 className="text-[19px] sm:text-2xl font-semibold">Care homes in {suburb.name}</h1>
          <p className="text-sm text-ink-2 mt-1">
            {homes.length} home{homes.length === 1 ? "" : "s"}
            {homes.length ? " · visited and verified homes appear first" : ""}
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
          <Suspense fallback={null}>
            <Directory homes={homes} basePath={`/${suburb.slug}`} />
          </Suspense>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
