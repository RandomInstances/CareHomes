import type { Metadata } from "next";

import { PolicyShell } from "@/app/policy-shell";

export const metadata: Metadata = {
  title: "Complaints and corrections",
  description:
    "How to correct a listing, ask for it to be removed, or raise a concern about a care home listed on carehomes.lk.",
  alternates: { canonical: "/complaints" },
};

export default function ComplaintsPage() {
  return (
    <PolicyShell title="Complaints and corrections" updated="29 August 2026">
      <p>
        One email address handles all of this:{" "}
        <a href="mailto:hello@carehomes.lk">hello@carehomes.lk</a>. Tell us which home
        you mean and what is wrong.
      </p>

      <h2>Correcting a listing</h2>
      <p>
        If you run a listed home and something is out of date — the fee, the beds, the
        telephone number — email us and we will change it. If you have an owner account,
        you can submit the change yourself and we will review it.
      </p>

      <h2>Removing a listing</h2>
      <p>
        If you run a home and do not want it listed, say so and we will take it down. We
        do not require a reason.
      </p>

      <h2>Concerns about a home</h2>
      <p>
        If you are worried about the care at a home listed here, tell us. We will record
        it, and where it is serious we will remove the listing while we look into it.
      </p>
      <p>
        <b>We are not a regulator and we cannot investigate care.</b> If a person is at
        risk of harm, contact the home&rsquo;s management, the police, or the National
        Secretariat for Elders, which registers and monitors elders&rsquo; homes in Sri
        Lanka. Please do not wait on us.
      </p>

      <h2>If you think something here is wrong about your business</h2>
      <p>
        Email us and we will correct or remove it promptly. We would rather fix a
        mistake than argue about it.
      </p>

      <h2>What to expect</h2>
      <ul>
        <li>We aim to reply within two working days.</li>
        <li>Corrections to a factual detail are usually made the same day.</li>
        <li>
          A takedown request from a home&rsquo;s owner is actioned without needing a
          reason.
        </li>
      </ul>
    </PolicyShell>
  );
}
