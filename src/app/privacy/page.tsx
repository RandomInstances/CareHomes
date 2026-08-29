import type { Metadata } from "next";

import { PolicyShell } from "@/app/policy-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What carehomes.lk collects, what it does not, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PolicyShell title="Privacy policy" updated="29 August 2026">
      <p>
        carehomes.lk is a directory of care homes in Colombo. You can search and browse
        it without an account, and without telling us anything about yourself.
      </p>

      <h2>We hold no medical information</h2>
      <p>
        We do not collect, store or process health information about anyone. There is no
        assessment, no medical questionnaire and no field anywhere on this site asking
        about a person&rsquo;s condition. If you contact a care home through this site,
        that conversation happens on WhatsApp or by telephone, directly between you and
        the home — it does not pass through us and we never see it.
      </p>

      <h2>What we collect when you browse</h2>
      <ul>
        <li>
          <b>Anonymous usage events</b> — which listings were viewed, which searches and
          filters were used, and when someone taps a home&rsquo;s WhatsApp button. These
          are tied to a random browser identifier, not to a name, and we use them to
          understand which homes families are looking for.
        </li>
        <li>
          <b>Your shortlist</b> — kept in your own browser only. It never reaches our
          servers, and clearing your browser data removes it.
        </li>
      </ul>
      <p>
        We do not ask for your name, telephone number or email address anywhere on this
        site.
      </p>

      <h2>Information about care homes</h2>
      <p>
        Listings contain business information about care homes: name, address, fees,
        facilities, and a contact number the home has given us for enquiries. Where our
        team has visited, we also publish what we observed and the date we saw it.
      </p>
      <p>
        If you run a listed home and want your details corrected or removed, see{" "}
        <a href="/complaints">complaints and corrections</a>.
      </p>

      <h2>Who we share with</h2>
      <p>
        Nobody. We do not sell data, and we do not pass visitor information to care
        homes or to advertisers. Our hosting provider processes data on our behalf in
        order to run the site.
      </p>

      <h2>Where data is held</h2>
      <p>
        The site and its database run in Singapore, chosen because it is the closest
        region to Sri Lanka.
      </p>

      <h2>Your rights</h2>
      <p>
        Sri Lanka&rsquo;s Personal Data Protection Act No. 9 of 2022 gives you rights
        over personal data held about you. Because we hold no personal data about
        visitors, there is generally nothing to access or delete — but if you believe we
        hold something about you, write to{" "}
        <a href="mailto:hello@carehomes.lk">hello@carehomes.lk</a> and we will look into
        it.
      </p>
    </PolicyShell>
  );
}
