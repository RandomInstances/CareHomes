import type { Metadata } from "next";

import { PolicyShell } from "@/app/policy-shell";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "What carehomes.lk is, what it is not, and the limits of what we verify.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PolicyShell title="Terms of use" updated="29 August 2026">
      <p>
        carehomes.lk is a directory. We publish information about care homes in Colombo
        so families can find and compare them, and contact the homes themselves.
      </p>

      <h2>What we are not</h2>
      <ul>
        <li>We are not a care provider, and we do not deliver care.</li>
        <li>We are not a placement or referral agency, and we do not act for you.</li>
        <li>
          We do not inspect, license, accredit or endorse any home. Where we say a home
          is <b>visited and verified</b>, that means a member of our team went there and
          recorded what they saw on that date — nothing more.
        </li>
      </ul>

      <h2>Homes we have not visited</h2>
      <p>
        Many listings have not been visited by us. Their details were supplied by the
        home, and we have not checked them. Those listings say so plainly on the page.
      </p>

      <h2>Accuracy</h2>
      <p>
        Fees, bed availability and facilities change, sometimes weekly. We show when a
        listing was last updated, but we cannot guarantee any detail is current.
        Confirm everything with the home directly before making a decision.
      </p>

      <h2>Choosing a home is your decision</h2>
      <p>
        Placing a relative in residential care is a serious decision and it is yours to
        make. Visit the home, ask your own questions, and satisfy yourself before
        committing. We are not liable for the care provided by any home listed here, nor
        for arrangements you make with them.
      </p>

      <h2>Listing on this site</h2>
      <p>
        Listing is free. Homes that pay for a field visit carry the visited and verified
        badge and appear ahead of homes we have not seen. That is the only way position
        is affected — no home can buy a higher ranking, and we do not sell placement.
      </p>
      <p>
        Homes are responsible for the accuracy of what they give us, and for holding the
        rights to any photographs they supply.
      </p>

      <h2>Removals</h2>
      <p>
        We remove or correct a listing when the home asks us to, or when we learn it is
        wrong. See <a href="/complaints">complaints and corrections</a>.
      </p>
    </PolicyShell>
  );
}
