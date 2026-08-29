# carehomes.lk — build spec

**Version 3.0 · 29 August 2026**

This document is the source of truth for what carehomes.lk is and how it makes
money. It replaces `carehomes-spec.md` v2.0 in full. Where the two disagree,
this one wins.

> **Why it was rewritten.** v2.0 had been edited across versions v1.2 → v2.0
> without removing superseded text, so it simultaneously specified and forbade
> sponsored placement, specified and dropped the owner subscription, and
> described a PayHere flow after payments had been removed. The commercial model
> then changed again on 29 August. Everything below reflects decisions actually
> in force.

---

## 1. What it is

**carehomes.lk, by Blanket Care** — a care-home directory for Colombo and a
paid, clinician-led placement service.

Families browse homes freely. When they want help choosing, a registered
clinician assesses their relative in person, and we shortlist, arrange visits
and support the move for a fixed fee.

The platform is openly operated by Blanket Care, which owns care homes of its
own. That is disclosed on the site, not buried.

---

## 2. Commercial model

### Families — LKR 50,000 per placement

| | |
|---|---|
| LKR 25,000 | On starting — covers the clinical assessment |
| LKR 25,000 | On placement |

Covers the assessment, the shortlist, arranging visits and support to move-in.

> The earlier "Always free for families" promise is **withdrawn**. It must not
> appear anywhere on the site or in marketing.

### Homes — free to list, paid to verify

| Tier | Cost | What it is |
|---|---|---|
| **Unverified** | Free | Self-serve account. The home lists itself and keeps its own details current, like any listings site. |
| **Verified** | LKR 50,000 one-time, then LKR 1,000/month from year two | Our field visit and inspection, the Verified badge, and the first twelve months listed. |

Year one is bundled into the 50,000 deliberately: collecting roughly USD 3 a
month from a small home costs more in administration than it earns.

**Homes never pay per referral.** There is no per-lead fee, no per-attended-visit
fee and no success fee. Family fees are the only placement revenue.

### Removed models

These appeared in earlier versions and are **not** in force: sponsored
placement, the LKR 25,000/yr owner-verified subscription, pay-per-lead wallets,
success fees payable by homes, the LKR 25,000 per-attended-visit facilitation
fee, and pay-to-reveal gating of family contact details.

---

## 3. Ranking and the conflict of interest

**Verified homes rank ahead of unverified ones everywhere**, including the
shortlist presented to a family who has paid.

This is paid ranking, and it reverses the earlier "nothing paid touches
matching" rule. It was adopted knowingly. Two things keep it defensible, and
both are load-bearing:

1. **Verified means inspected.** The badge records what our team physically
   sighted — registration certificate, night roster, doctor arrangement,
   photographs taken by us. Ranking inspected homes first is an evidence signal,
   not an auction. That the inspection is paid for is stated publicly in the
   "List a home" section.
2. **The placement pool is not restricted to payers.** Best clinical fit wins.
   An unverified home can be recommended; we visit it first, at our cost,
   before any placement proceeds.

**Blanket Care homes enter by the same criteria as every other home.** The rule
that survives from every earlier version, and must be published:

> If Blanket cannot meet the patient's clinical need — wrong care level, no bed,
> wrong region — the patient goes to the best-fit home, full stop.
> **Blanket first when fit; never Blanket against fit.**

Because the family now *pays*, this matters more than it did, not less. A paying
customer steered toward the operator's own home has a real grievance. Blanket
ownership must be disclosed before payment, not after.

---

## 4. Scope: Colombo only

Launch covers Colombo district. The UI exposes **suburbs** — Nugegoda, Malabe,
Dehiwela, Mount Lavinia, Rajagiriya, Nawala, Battaramulla, Kotte, Maharagama,
Pannipitiya, Ratmalana, Wellawatte, Moratuwa, Colombo 1–15. The data model keeps
a `district` column defaulting to `"Colombo"` so expansion is additive.

Sinhala and Tamil are a fast-follow. Copy is structured for translation from day
one — an English-only site reaches a fraction of Sri Lankan families, and
retrofitting translations onto single-language tables means a rebuild.

---

## 5. The family journey

Directory first, process immediately beneath it: people arrive from search
wanting to look, and the steps catch them once they are interested.

1. **Medical evaluation** — a registered clinician assesses the person in
   person, physical and mental. Nothing is decided from a form or a phone call.
2. **Shortlisting properties** — the assessment is matched against homes, and
   only those that can genuinely meet the need are shortlisted.
3. **Placement** — we arrange the visits, coordinate with the home, and stay
   with the family through the move.

### Contact routing

**Families never contact homes directly.** No home telephone number, WhatsApp
link or email is rendered anywhere — not on cards, not in the detail view, not
in the compare table.

Every call to action routes to a short form, which then opens WhatsApp
pre-filled. WhatsApp: **+94 76 856 4198** (Dr. Minoli Ekanayake).

> **Operational risk, unresolved.** That is a named clinician's personal number
> on a public website. It will be scraped, it cannot be rotated without a code
> change, and if she is unavailable the funnel stops. A company-owned WhatsApp
> Business number forwarded to her removes all three.

### The enquiry form

Collects: suburbs under consideration, the person's age, a monthly budget cap,
known conditions (optional), and any homes already shortlisted.

---

## 6. Clinical data boundary

**No assessment content ever enters the database.** No ADLs, cognition scores,
medications, diagnoses, falls risk or clinical free-text.

The assessment stays with the Blanket Care clinician, is handed to the patient,
and the patient shares it with the care home directly. There is no data
pass-through at any point.

**The conditions field is never transmitted.** It is read from the DOM, written
into the WhatsApp message, and discarded. It is not posted to any endpoint and
appears in no log.

**What is recorded:** suburbs, age, budget band, timeframe, the listing the
enquiry came from, which homes were recommended, and what happened next.

`familyName` and `phone` are **optional** on the enquiry record. Under the
WhatsApp handoff we never learn them — identity arrives in the clinician's
inbox, not our database. An enquiry is *"someone in Nugegoda, 78, budget 150k,
interested in these two homes"* with no name attached.

This produces a privacy statement that is literally true rather than merely
reassuring: **we hold no medical records.**

---

## 7. Roles

1. **Visitor / family** — no account. Search, filter, shortlist, compare,
   enquire. Shortlist persists in `localStorage`.
2. **Owner** — account tied to one or more homes, validated by SMS OTP to the
   number on file plus admin approval. Owners never write to a listing directly:
   edits are stored as a diff and applied only on admin approval, which stamps
   `ownerUpdatedAt`.
3. **Admin** — approves listings and claims, reviews every edit before it goes
   live, records field visits, manages verification and invoices.

### How a home gets listed

Onboarding form → admin review → field visit. The form walks the home through
the process before it takes contact details. Nothing goes live unreviewed.

---

## 8. Attribution

Event logging is live from the first visitor, not deferred to a later milestone.
Without it, a pricing decision in month nine is a rebuild rather than a switch.

Logged: listing views, searches, filters applied, shortlist additions, compare
views, enquiry submissions, and the funnel through to move-in. An anonymous
`sessionId` lets pre-enquiry browsing be joined to an enquiry later.

---

## 9. Payments

No gateway is integrated yet.

- **Family deposit (LKR 25,000)** — the one that genuinely needs a card. Asking
  for 25,000 by bank transfer at the top of the funnel will cost conversions at
  the worst possible moment. **PAYable** is the chosen provider; Sri Lanka is not
  supported by Stripe.
- **Family balance, home verification and renewals** — invoice and bank
  transfer, tracked in the ops console. No gateway required.
- **Card tokenisation** for the LKR 1,000/month renewal is not urgent, since
  year one is bundled. Confirm PAYable supports recurring charges before year
  two.

---

## 10. Technical

| | |
|---|---|
| Stack | Next.js (App Router) + TypeScript + Tailwind |
| Database | PostgreSQL via Prisma **7.10.0** (pinned — npm `latest` resolves to an 8.0 release candidate) |
| Hosting | Railway — app and Postgres, both in `asia-southeast1` (Singapore) |
| Repo | `RandomInstances/CareHomes` |
| Domain | carehomes.lk |
| Maps | Leaflet + OpenStreetMap, price-pin markers |
| Fonts | Bricolage Grotesque · Public Sans · IBM Plex Mono |

The public directory is **server-rendered**. A directory's growth channel is
Google, so pages must return real HTML, with a page per home, per suburb and per
care type, and `LocalBusiness` structured data. It must work on a low-end
Android over mobile data.

> **Railway does not apply `railway.json` to this service.** The `region` key was
> ignored and `preDeployCommand` never ran, leaving a green deployment over an
> empty database. Migrations therefore run from the npm `start` script
> (`prisma migrate deploy && next start`), which the platform cannot skip and
> which is idempotent. Deploy settings are set in the dashboard, and
> `/api/health` reports migration count so this class of silent failure is
> visible.

---

## 11. Build order

1. **Public directory** from the database — listings, search, filters,
   shortlist, compare, map. Visited/verified badges. Attribution live.
2. **Enquiry capture** — form, non-clinical record, WhatsApp handoff.
3. **Admin** — listings CRUD, edit-review queue, field visit records,
   verification and invoice tracking.
4. **Owner accounts** — OTP claim, edit submission.
5. **Home onboarding form** — process acknowledgement into the review queue.
6. **Ops console** — enquiry pipeline, recommendations, appointments,
   placements, family and home invoices.
7. **Sinhala and Tamil.**

---

## 12. Open questions

- Is the family deposit refundable if no suitable home is found? Not yet
  decided, and it must be settled before money is taken.
- What are the terms of the LKR 50,000 placement fee if a family withdraws
  mid-process?
- Company WhatsApp Business number to replace the personal one.
- Legal review of the placement agreement and the listing agreement, by a
  Sri Lankan lawyer, before either is used.
