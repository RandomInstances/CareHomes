import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";

export const metadata: Metadata = {
  title: "What Visited and Verified means",
  description:
    "Everything our team checks on a care home visit: registration sighted, night roster seen, doctor arrangement confirmed, fire safety, and every room photographed by us on the day.",
  alternates: { canonical: "/verification" },
};

const SECTIONS: { title: string; note?: string; items: string[] }[] = [
  {
    title: "Registration and licensing",
    note: "Sighted in the original, not taken on trust.",
    items: [
      "Registration certificate with the National Secretariat for Elders, seen and dated",
      "Business registration confirmed",
      "Date of the most recent government inspection, recorded",
      "Any conditions or lapses noted as we find them",
    ],
  },
  {
    title: "Staffing, especially at night",
    note: "Nights are when falls, breathing trouble and confusion happen, and when homes are thinnest.",
    items: [
      "The actual night-shift roster, seen — not a number we were told",
      "How many carers and nurses are on duty by day and by night, counted",
      "Nursing qualifications sighted where staff are described as nurses",
      "Whether any staff live on the premises",
      "How long the senior carer or matron has been in post",
    ],
  },
  {
    title: "Medical cover",
    items: [
      "Who the doctor is, how often they attend, and how quickly they can come",
      "Which hospital the home transfers to, and how far it actually is",
      "Who travels with a resident in an emergency",
      "How medicines are stored, recorded and administered — seen, not described",
      "The written emergency procedure, if one exists",
    ],
  },
  {
    title: "The building itself",
    note: "We walk every area a resident would use.",
    items: [
      "Bedrooms, including shared rooms, not only the show room",
      "Bathrooms and toilets, and how many residents share each",
      "The kitchen, and where food is prepared and stored",
      "Dining and communal areas",
      "Step-free routes, handrails, and whether a wheelchair genuinely fits through",
      "Fire exits, extinguishers, and whether an evacuation plan is displayed",
      "Cleanliness and smell, recorded honestly",
    ],
  },
  {
    title: "Photographs",
    note: "This is the part homes cannot fake, and the reason families trust the badge.",
    items: [
      "Every photograph on a verified listing is taken by our team on the day of the visit",
      "We photograph real rooms, including ordinary ones — not a staged suite",
      "Marketing images supplied by the home are never published as ours",
      "Photographs are dated, so a family can see how current they are",
      "Nobody is photographed without consent, and no resident is identifiable",
    ],
  },
  {
    title: "Money, in writing",
    note: "Families tell us the extras are what catch them out.",
    items: [
      "The fee schedule, collected in writing",
      "What the fee excludes, itemised — medicines, nappies, physiotherapy, escorts",
      "Deposit, notice period and what happens on a hospital admission",
      "Whether fees have risen in the last year, and by how much",
    ],
  },
  {
    title: "Daily life",
    items: [
      "What residents actually did the previous afternoon",
      "The week's menu, and how dietary needs are handled",
      "Visiting hours, and whether family can come outside them",
      "Languages the staff genuinely speak with residents",
      "Whether residents can go outside, and how often",
    ],
  },
  {
    title: "After we leave",
    items: [
      "The report is written up the same day and dated",
      "The listing is updated with what we saw, not what we were told",
      "We revisit every twelve months, or sooner if anyone raises a concern",
      "If a home changes materially, the badge does not carry over unchecked",
    ],
  },
];

export default function VerificationPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-5 py-10 flex-1 w-full">
        <span className="inline-flex items-center gap-2 bg-teal text-white rounded-full pl-2 pr-4 py-2 text-[13.5px] font-bold shadow-[0_2px_10px_rgba(14,92,85,0.3)]">
          <span className="grid place-items-center w-5 h-5 rounded-full bg-white/25">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m4 12 5 5L20 6" />
            </svg>
          </span>
          Visited and Verified
        </span>

        <h1 className="text-3xl sm:text-4xl font-semibold mt-5 max-w-[22ch]">
          What we check when we visit a home
        </h1>
        <p className="text-[17px] text-ink-2 mt-4 max-w-[64ch]">
          A member of our team goes to the home, walks every area a resident would use,
          asks for documents in the original, and photographs the building themselves.
          This is the whole list.
        </p>

        <div className="mt-6 border-l-4 border-turmeric bg-turmeric-soft/60 rounded-r-xl p-5">
          <h2 className="font-semibold">What the badge does not mean</h2>
          <p className="text-[15px] text-ink-2 mt-1.5 max-w-[62ch]">
            We report what we observed on a particular day. We are not a regulator, we do
            not license or accredit anyone, and <b>the badge is not a judgement that a
            home is good</b>. It means we went, we looked, and here is what we found.
            Visit the home yourself before you decide anything.
          </p>
        </div>

        <div className="mt-10 space-y-9">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.note ? (
                <p className="text-[14.5px] text-ink-2 mt-1 max-w-[62ch]">{section.note}</p>
              ) : null}
              <ul className="mt-3 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px]">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal mt-1 shrink-0"
                      aria-hidden
                    >
                      <path d="m4 12 5 5L20 6" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-12 border border-line rounded-2xl bg-surface p-6">
          <h2 className="text-xl font-semibold">Run a home and want to be verified?</h2>
          <p className="text-[15px] text-ink-2 mt-1.5 max-w-[58ch]">
            Listing is free. A visit and the badge cost LKR 50,000, which includes your
            first twelve months listed.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/list-your-home"
              className="inline-block rounded-full bg-teal text-white font-semibold px-5 py-3"
            >
              List your care home
            </Link>
            <Link
              href="/complaints"
              className="inline-block rounded-full border border-line-2 bg-surface font-semibold px-5 py-3"
            >
              Report something wrong
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
