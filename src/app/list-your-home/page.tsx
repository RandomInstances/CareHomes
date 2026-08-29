import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";

export const metadata: Metadata = {
  title: "List your care home",
  description:
    "List your care home on carehomes.lk. Free to list. LKR 50,000 for a field visit, the Visited and verified badge, and your first twelve months.",
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

      <main className="mx-auto max-w-3xl px-5 py-10 flex-1 w-full">
        <h1 className="text-3xl font-semibold">List your care home</h1>
        <p className="text-[17px] text-ink-2 mt-3 max-w-[62ch]">
          Families across Colombo use carehomes.lk to find and compare homes. Listing is
          free, and every listing carries your own contact details so enquiries come
          straight to you.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-5">How it works</h2>
          <ol className="space-y-6">
            <Step n={1} title="Send us your details">
              Tell us the name of the home, the suburb, how many beds you have and how
              to reach you. Nothing goes live until we have spoken.
            </Step>
            <Step n={2} title="We review the listing">
              We check the basics and set the listing up for you. If you would rather
              maintain it yourself, we create an owner account so you can keep fees,
              beds and details current.
            </Step>
            <Step n={3} title="Your listing goes live">
              Your home appears in the directory with its own page and its own WhatsApp
              button. Free listings stay live indefinitely.
            </Step>
            <Step n={4} title="Book a visit if you want to be verified">
              Our team visits, inspects and photographs the home. Verified homes carry
              the badge and appear ahead of listings we have not seen.
            </Step>
          </ol>
        </section>

        <section id="verification" className="mt-12 scroll-mt-20">
          <h2 className="text-xl font-semibold mb-3">What verification means</h2>
          <p className="text-[15px] text-ink-2 max-w-[62ch]">
            A member of our team comes to the home and records what they see. The badge
            says <b>Visited and verified</b> and reports observations — it is not an
            endorsement of quality, and we never score or rank homes on judgement.
          </p>
          <ul className="mt-4 space-y-2 text-[15px]">
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
                <li>Your WhatsApp and phone number on the listing</li>
                <li>Keep fees, beds and details current</li>
              </ul>
            </div>
            <div className="border-2 border-teal rounded-2xl bg-surface p-5">
              <h3 className="font-semibold">Visited and verified</h3>
              <p className="text-2xl font-bold mt-1 tabular-nums">
                LKR 50,000
                <span className="text-sm font-normal text-ink-2"> one-time</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-[14.5px] text-ink-2">
                <li>Everything in a free listing</li>
                <li>A field visit, inspection and photographs</li>
                <li>The Visited and verified badge</li>
                <li>Listed ahead of homes we have not visited</li>
                <li>Your first twelve months included, then LKR 1,000 a month</li>
              </ul>
            </div>
          </div>
          <p className="text-[14px] text-muted mt-4 max-w-[62ch]">
            We never charge a family, and we never charge you for an enquiry or a
            placement. No home can buy a higher position beyond having been visited.
          </p>
        </section>

        <section className="mt-12 border border-line rounded-2xl bg-surface p-6">
          <h2 className="text-xl font-semibold">Get listed</h2>
          <p className="text-[15px] text-ink-2 mt-1.5 max-w-[58ch]">
            Send us the name of your home and the suburb, and we will come back to you
            with next steps.
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
