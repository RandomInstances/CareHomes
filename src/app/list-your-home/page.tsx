import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";

export const metadata: Metadata = {
  title: "List your care home",
  description:
    "One empty bed costs more in a month than a year of being listed. Free to list on carehomes.lk. LKR 50,000 for a field visit, the Visited and Verified badge, and your first twelve months.",
  alternates: { canonical: "/list-your-home" },
};

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="shrink-0 w-8 h-8 rounded-full bg-teal text-white grid place-items-center font-bold text-sm tabular-nums">
        {n}
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-[15px] text-ink-2 mt-1 max-w-[62ch]">{children}</p>
      </div>
    </li>
  );
}

export default function ListYourHomePage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-5 py-10 flex-1 w-full">
        <h1 className="text-3xl sm:text-4xl font-semibold max-w-[20ch]">
          An empty bed costs more in a month than a year of being listed.
        </h1>
        <p className="text-[17px] text-ink-2 mt-4 max-w-[62ch]">
          Families looking for care in Colombo are searching online before they visit
          anywhere. carehomes.lk puts your home in front of them with your own contact
          number, so the enquiry comes straight to you.
        </p>

        {/* The argument that actually persuades an owner is arithmetic, not adjectives. */}
        <section className="mt-9 border border-line rounded-2xl bg-surface p-6">
          <h2 className="text-xl font-semibold">The arithmetic</h2>
          <p className="text-[15px] text-ink-2 mt-1.5 max-w-[62ch]">
            At a fee of LKR 150,000 a month, a single bed left empty for a year is
            LKR 1,800,000 of income you never see.
          </p>
          <dl className="grid sm:grid-cols-3 gap-4 mt-5">
            {[
              ["LKR 150,000", "One month, one resident"],
              ["LKR 50,000", "A visit, the badge and your first year listed"],
              ["10 days", "How long that bed takes to pay for it"],
            ].map(([figure, label]) => (
              <div key={label} className="border border-line rounded-xl p-4">
                <dt className="text-xl font-bold tabular-nums">{figure}</dt>
                <dd className="text-[14px] text-ink-2 mt-0.5">{label}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[14px] text-muted mt-4 max-w-[62ch]">
            One placement covers the fee many times over. Everything after that is
            occupancy you would not otherwise have had.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Why families find you here</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              [
                "They are already searching",
                "People do not start by driving around Nugegoda. They search, compare and shortlist, then visit two or three homes. If you are not in that shortlist, you are not in the decision.",
              ],
              [
                "Every home gets its own page",
                "Your listing is a real web address with your fees, beds, care types and photographs — built to be found in search rather than buried inside an app.",
              ],
              [
                "The enquiry is yours",
                "Your WhatsApp and telephone number sit on your listing. We do not intercept enquiries, we do not charge per lead, and we take no commission on a placement.",
              ],
              [
                "Demand is growing faster than supply",
                "Sri Lanka is the fastest-ageing country in South Asia, and quality beds are scarce. The families finding you now are the beginning of that curve.",
              ],
            ].map(([title, body]) => (
              <div key={title} className="border border-line rounded-2xl bg-surface p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-[14.5px] text-ink-2 mt-1.5">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-5">How it works</h2>
          <ol className="space-y-6">
            <Step n={1} title="Send us your details">
              The name of the home, the suburb, how many beds you have and how to reach
              you. Nothing goes live until we have spoken.
            </Step>
            <Step n={2} title="We set up the listing">
              We check the basics and build it for you. If you would rather maintain it
              yourself, we create an owner account so you can keep fees and beds current.
            </Step>
            <Step n={3} title="Your listing goes live">
              Your home appears with its own page and its own WhatsApp button. Free
              listings stay live indefinitely.
            </Step>
            <Step n={4} title="Book a visit to be verified">
              Our team visits, inspects and photographs the home. Verified homes carry
              the badge and appear ahead of listings we have not seen.
            </Step>
          </ol>
        </section>

        <section id="verification" className="mt-12 scroll-mt-20">
          <h2 className="text-xl font-semibold mb-3">Why verification converts</h2>
          <p className="text-[15px] text-ink-2 max-w-[62ch]">
            A family choosing a home for their mother is making a decision they are
            frightened of getting wrong. Anyone can write a listing. Very few can show
            that an independent team walked the building, saw the night roster and
            photographed the rooms themselves.
          </p>
          <p className="text-[15px] text-ink-2 mt-3 max-w-[62ch]">
            The badge says <b>Visited and Verified</b> and reports observations — it is
            not an endorsement of quality, and we never score or rank homes on judgement.
            That is exactly why families trust it.
          </p>
          <ul className="mt-5 space-y-2 text-[15px]">
            {[
              "Registration with the National Secretariat for Elders, sighted",
              "The night-shift nursing roster, seen",
              "The doctor arrangement, confirmed",
              "Rooms, kitchen and bathrooms, photographed by us",
              "The fee schedule and what it excludes, collected in writing",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-teal mt-1 shrink-0">
                  <path d="m4 12 5 5L20 6" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="pricing" className="mt-12 scroll-mt-20">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-line rounded-2xl bg-surface p-5">
              <h3 className="font-semibold">Listed</h3>
              <p className="text-2xl font-bold mt-1">Free</p>
              <ul className="mt-3 space-y-1.5 text-[14.5px] text-ink-2">
                <li>Your own page and web address</li>
                <li>Your WhatsApp and telephone on the listing</li>
                <li>Keep fees, beds and details current</li>
                <li>No card, no commitment, no expiry</li>
              </ul>
            </div>
            <div className="border-2 border-teal rounded-2xl bg-surface p-5 relative">
              <span className="absolute -top-3 left-5 bg-teal text-white text-[11.5px] font-bold rounded-full px-2.5 py-1">
                Recommended
              </span>
              <h3 className="font-semibold">Visited and Verified</h3>
              <p className="text-2xl font-bold mt-1 tabular-nums">
                LKR 50,000
                <span className="text-sm font-normal text-ink-2"> one-time</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-[14.5px] text-ink-2">
                <li>Everything in a free listing</li>
                <li>A field visit, inspection and photographs</li>
                <li>The Visited and Verified badge</li>
                <li>Listed ahead of homes we have not visited</li>
                <li>Your first twelve months included, then LKR 1,000 a month</li>
              </ul>
            </div>
          </div>
          <p className="text-[14px] text-muted mt-4 max-w-[62ch]">
            We never charge a family, and we never charge you per enquiry or per
            placement. Beyond having been visited, no home can buy a higher position.
          </p>
        </section>

        <section className="mt-12 border border-line rounded-2xl bg-surface p-6">
          <h2 className="text-xl font-semibold">Start with a free listing</h2>
          <p className="text-[15px] text-ink-2 mt-1.5 max-w-[58ch]">
            It costs nothing and commits you to nothing. Send us the name of your home
            and the suburb, and we will come back to you with next steps.
          </p>
          <a
            href="mailto:hello@carehomes.lk?subject=Listing%20my%20care%20home"
            className="inline-block mt-4 rounded-full bg-teal text-white font-semibold px-5 py-3"
          >
            Email hello@carehomes.lk
          </a>
          <p className="text-[13px] text-muted mt-3">
            An online onboarding form is coming. For now, email reaches us fastest.
          </p>
        </section>

        <p className="mt-10 text-sm text-ink-2">
          Already listed and need something changed?{" "}
          <Link href="/complaints" className="text-teal font-semibold">
            Tell us here
          </Link>
          .
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
