import type { Metadata } from "next";

import { PolicyShell } from "@/app/policy-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What carehomes.lk collects, what it does not, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PolicyShell title="Privacy policy" updated="30 August 2026">
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

      <h2>If you create an account</h2>
      <p>
        You do not need an account to use this site. If you choose to create one so your
        saved homes follow you between devices, we hold your <b>name</b> and{" "}
        <b>email address</b>, and your <b>telephone number</b> only if you choose to add
        one. We also hold the list of homes you have saved.
      </p>
      <p>
        Signing in with Google tells us your name and email address and nothing else. We
        never see your Google password, and we do not read your contacts, calendar or
        anything else in your account.
      </p>
      <p>
        We do not store passwords for this site at all. Signing in works by a one-time
        link sent to your email, or through Google.
      </p>

      <h2>Updates and offers are separate, and optional</h2>
      <p>
        Creating an account does not sign you up to anything. Emails about beds becoming
        available, new homes, or related services are a <b>separate tick box</b> that is
        never pre-ticked, and you can turn it off whenever you like. We do not pass your
        email address to care homes or to anyone else who might market to you.
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
          <b>Your shortlist</b> — kept in your own browser while you are signed out, so it
          never reaches our servers and clearing your browser data removes it. Once you
          sign in it is stored against your account instead, which is what lets it follow
          you to another device.
        </li>
      </ul>
      <p>
        If you have not created an account, we hold nothing that identifies you.
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
        Sri Lanka&rsquo;s Personal Data Protection Act No. 9 of 2022 gives you rights over
        personal data held about you. If you have an account you can ask us for a copy of
        what we hold, ask us to correct it, or ask us to delete the account and everything
        in it — write to <a href="mailto:hello@carehomes.lk">hello@carehomes.lk</a> and we
        will action it. Deleting your account removes your saved homes and your email
        address from our records.
      </p>
    </PolicyShell>
  );
}
