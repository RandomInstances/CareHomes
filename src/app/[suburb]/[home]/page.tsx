import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FeatureList } from "@/app/feature-icon";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { formatFee } from "@/lib/catalog";
import { getHome, whatsappLink } from "@/lib/homes";

export const dynamic = "force-dynamic";

const CARE_LABEL: Record<string, string> = {
  ASSISTED_LIVING: "Assisted living",
  NURSING: "Nursing care",
  DEMENTIA: "Dementia care",
  RESPITE: "Respite (short stay)",
  PALLIATIVE: "Palliative care",
  REHAB: "Post-surgery rehab",
};

const LANGUAGE_LABEL: Record<string, string> = {
  SINHALA: "Sinhala",
  TAMIL: "Tamil",
  ENGLISH: "English",
};

export async function generateMetadata({
  params,
}: PageProps<"/[suburb]/[home]">): Promise<Metadata> {
  const { suburb, home: homeSlug } = await params;
  const home = await getHome(suburb, homeSlug);
  if (!home) return {};

  const fee = formatFee(home.feeFrom, home.feeTo);
  return {
    title: `${home.name}, ${home.suburb.name}`,
    description:
      home.description.slice(0, 155) ||
      `${home.name} is a care home in ${home.suburb.name}, Colombo.${fee ? ` Fees from ${fee} per month.` : ""}`,
    alternates: { canonical: `/${home.suburb.slug}/${home.slug}` },
  };
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-4">
      <h2 className="text-[13px] uppercase tracking-wide text-muted font-semibold mb-1.5">
        {label}
      </h2>
      <div className="text-[15px]">{children}</div>
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/[suburb]/[home]">) {
  const { suburb, home: homeSlug } = await params;
  const home = await getHome(suburb, homeSlug);
  if (!home) notFound();

  const fee = formatFee(home.feeFrom, home.feeTo);
  const visit = home.visits[0];
  const wa = home.whatsapp ?? home.phone;

  // Helps Google show this as a local business rather than a generic page.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: home.name,
    description: home.description || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: home.address || undefined,
      addressLocality: home.suburb.name,
      addressRegion: home.district,
      addressCountry: "LK",
    },
    telephone: home.phone || undefined,
    ...(home.lat && home.lng
      ? { geo: { "@type": "GeoCoordinates", latitude: home.lat, longitude: home.lng } }
      : {}),
  };

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-5 py-6 sm:py-8 flex-1 w-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <nav className="text-sm text-muted mb-4">
          <Link href="/" className="hover:text-ink">Colombo</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/${home.suburb.slug}`} className="hover:text-ink">
            {home.suburb.name}
          </Link>
        </nav>

        <header className="space-y-2">
          {home.tier === "VERIFIED" ? (
            <span className="inline-flex items-center gap-2 bg-teal text-white rounded-full pl-2 pr-4 py-2 text-[13.5px] font-bold shadow-[0_2px_10px_rgba(14,92,85,0.3)]">
              <span className="grid place-items-center w-5 h-5 rounded-full bg-white/25">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m4 12 5 5L20 6" />
                </svg>
              </span>
              Visited and Verified
              {visit ? ` · ${visit.visitedOn.toLocaleDateString("en-GB")}` : ""}
            </span>
          ) : (
            <span className="inline-block bg-turmeric-soft text-turmeric rounded-full px-3 py-1 text-xs font-bold">
              Not yet visited
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-semibold">{home.name}</h1>
          <p className="text-ink-2">
            {home.suburb.name}
            {home.address ? ` · ${home.address}` : ""}
          </p>
          {home.isBlanketHome ? (
            <p className="text-sm text-ink-2">
              Operated by Blanket Care.
            </p>
          ) : null}
        </header>

        {wa ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappLink(wa, home.name)}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-teal text-white font-semibold px-5 py-3"
            >
              Message {home.name} on WhatsApp
            </a>
            {home.phone ? (
              <a
                href={`tel:${home.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface font-semibold px-5 py-3"
              >
                Call {home.phone}
              </a>
            ) : null}
          </div>
        ) : null}

        {home.description ? (
          <p className="mt-6 text-[15.5px] leading-relaxed">{home.description}</p>
        ) : null}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {fee ? (
            <Detail label="Monthly fee">
              <p className="text-xl font-semibold tabular-nums">{fee}</p>
              {home.feeExcludes.length ? (
                <p className="text-sm text-ink-2 mt-1.5">
                  <b>Not included:</b> {home.feeExcludes.join(", ")}.
                </p>
              ) : null}
            </Detail>
          ) : null}

          <Detail label="Availability">
            <p className="text-xl font-semibold">
              {home.bedsAvailable
                ? home.bedsTotal
                  ? `${home.bedsAvailable} of ${home.bedsTotal} beds free`
                  : `${home.bedsAvailable} bed${home.bedsAvailable > 1 ? "s" : ""} free`
                : "Waiting list"}
            </p>
            {!home.bedsAvailable && home.bedsTotal ? (
              <p className="text-sm text-ink-2 mt-1">{home.bedsTotal} beds in total.</p>
            ) : null}
            {home.roomTypes.length ? (
              <p className="text-sm text-ink-2 mt-1.5">Rooms: {home.roomTypes.join(", ")}.</p>
            ) : null}
          </Detail>

          {home.careTypes.length ? (
            <Detail label="Type of care">
              <ul className="space-y-0.5">
                {home.careTypes.map((t) => (
                  <li key={t}>{CARE_LABEL[t] ?? t}</li>
                ))}
              </ul>
            </Detail>
          ) : null}

          {home.nightNurses || home.doctorArrangement || home.transferHospital ? (
            <Detail label="Medical cover">
              {home.nightNurses ? (
                <p>
                  <b>{home.nightNurses}</b> nurse{home.nightNurses > 1 ? "s" : ""} on the night shift
                </p>
              ) : null}
              {home.doctorArrangement ? <p>{home.doctorArrangement}</p> : null}
              {home.transferHospital ? <p>Transfers to {home.transferHospital}</p> : null}
            </Detail>
          ) : null}

          {home.languages.length ? (
            <Detail label="Languages spoken by staff">
              <p>{home.languages.map((l) => LANGUAGE_LABEL[l] ?? l).join(", ")}</p>
            </Detail>
          ) : null}

          {home.visitingHours ? (
            <Detail label="Visiting">
              <p>{home.visitingHours}</p>
            </Detail>
          ) : null}
        </div>

        {home.features.length ? (
          <div className="mt-5">
            <Detail label="Facilities">
              <div className="mt-2">
                <FeatureList features={home.features} />
              </div>
            </Detail>
          </div>
        ) : null}

        <div className="mt-8 text-sm text-ink-2 bg-surface border border-line rounded-xl p-4">
          {home.tier === "VERIFIED" ? (
            <p>
              Our team has visited this home and recorded what we saw. That is an
              observation, not an endorsement — please satisfy yourself before making
              any placement.{" "}
              <Link href="/verification" className="text-teal font-semibold">
                See everything we check
              </Link>
              .
            </p>
          ) : (
            <p>
              Our team has not visited this home yet. The details here were supplied by
              the home and have not been checked by us.
            </p>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
