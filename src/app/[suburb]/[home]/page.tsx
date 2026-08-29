import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FeatureList } from "@/app/feature-icon";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { ADMISSION_LABEL, CARE_LABEL, LANGUAGE_LABEL, formatFee } from "@/lib/catalog";
import { getHome, whatsappLink } from "@/lib/homes";

export const dynamic = "force-dynamic";



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
              // WhatsApp's own green and glyph: the button should look like the
              // thing it opens, so the tap is a decision already made.
              className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] text-white font-bold px-5 py-3.5 shadow-[0_2px_12px_rgba(37,211,102,0.4)] hover:bg-[#1FBF5B] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Message {home.name} on WhatsApp
            </a>
            {home.phone ? (
              <a
                href={`tel:${home.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface font-semibold px-5 py-3.5 hover:border-teal transition-colors"
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

        {home.accepts.length || home.notAccepted.length || home.minAge || home.maxAge ? (
          <div className="mt-5">
            <Detail label="Who this home takes">
              <div className="grid sm:grid-cols-2 gap-4 mt-1">
                {home.accepts.length ? (
                  <div>
                    <p className="text-[13px] font-semibold text-[#07794f] mb-1.5">Will accept</p>
                    <ul className="space-y-1">
                      {home.accepts.map((a) => (
                        <li key={a} className="flex gap-2 text-[14.5px]">
                          <span className="text-[#07794f]" aria-hidden>✓</span>
                          {ADMISSION_LABEL[a] ?? a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {home.notAccepted.length ? (
                  <div>
                    <p className="text-[13px] font-semibold text-turmeric mb-1.5">Cannot take</p>
                    <ul className="space-y-1">
                      {home.notAccepted.map((a) => (
                        <li key={a} className="flex gap-2 text-[14.5px] text-ink-2">
                          <span className="text-turmeric" aria-hidden>✕</span>
                          {ADMISSION_LABEL[a] ?? a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              {home.minAge || home.maxAge ? (
                <p className="text-[14px] text-ink-2 mt-3">
                  Accepts residents{home.minAge ? ` from ${home.minAge}` : ""}
                  {home.maxAge ? ` up to ${home.maxAge}` : ""} years old.
                </p>
              ) : null}
            </Detail>
          </div>
        ) : null}

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
