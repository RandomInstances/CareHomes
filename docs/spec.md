# carehomes.lk — build spec

**Version 4.0 · 29 August 2026**

Source of truth for what carehomes.lk is and how it makes money. Supersedes
v3.0 and the original `carehomes-spec.md` in full.

> **What changed from v3.0.** The paid, clinician-led placement service is
> removed. carehomes.lk is now a **directory**: homes pay to be listed, families
> browse and contact homes directly, and nobody is charged for a placement.
> Everything that described assessments, shortlisting, a placement fee or a
> central enquiry funnel is gone.

---

## 1. What it is

**carehomes.lk, by Blanket Care** — a care-home directory for Colombo.

Families search, compare and contact homes themselves. Each listed home has its
own WhatsApp number on its page. Homes pay to be listed and to be verified.

The site is openly operated by Blanket Care, which runs care homes of its own.
Blanket homes appear as ordinary listings and are labelled as Blanket-operated
on their page.

---

## 2. Commercial model

**Families pay nothing.** There is no placement fee, no assessment fee and no
charge of any kind to a family.

### Homes

| Tier | Cost | What it is |
|---|---|---|
| **Unverified** | Free | Self-serve listing. The home keeps its own details current. |
| **Verified** | LKR 50,000 one-time, then LKR 1,000/month from year two | Our field visit and inspection, the "Visited by our team" badge, and the first twelve months listed. |

Year one is bundled into the 50,000: collecting roughly USD 3 a month from a
small home costs more in administration than it earns.

**Listing fees are the only revenue.** No per-lead fee, no per-visit fee, no
success fee, no sponsored placement. Verified conversions are therefore the
number that decides whether this works commercially.

### Removed models

Not in force, and must not reappear: the LKR 10,000 (previously 50,000) family
placement fee, the clinician-led assessment funnel, sponsored placement, the
owner-verified subscription, pay-per-lead wallets, success fees, the
per-attended-visit facilitation fee, and pay-to-reveal contact gating.

---

## 3. Ranking

**Verified homes rank ahead of unverified ones.** Verified means our team has
visited and inspected the home — registration sighted, night roster seen,
doctor arrangement confirmed, photographs taken by us. Ranking inspected homes
first is an evidence signal; that the inspection is paid for is stated in the
"List a home" section.

Within a tier, homes sort by how recently their owner updated the listing, then
by name.

Unverified homes are listed and reachable in full. They carry a plain notice
that we have not visited them and that their details were supplied by the home.

---

## 4. Scope: Colombo only

Launch covers Colombo district. The UI exposes **suburbs** — Nugegoda, Malabe,
Dehiwela, Mount Lavinia, Rajagiriya, Nawala, Battaramulla, Kotte, Maharagama,
Pannipitiya, Ratmalana, Wellawatte, Moratuwa, Colombo 3–8. The `district` column
defaults to `"Colombo"` so expansion is additive.

Sinhala and Tamil are a fast-follow; `HomeTranslation` exists now so adding them
is a content job, not a migration.

---

## 5. URL structure

Every home has its own indexable page. **No modals for primary content** — a
popup cannot be linked to, shared, or ranked.

| Page | URL |
|---|---|
| Directory | `/` |
| Suburb | `/nugegoda` |
| Home | `/nugegoda/sirimal-home` |

Suburb slugs are globally unique, so expansion adds new slugs rather than
colliding. If a future district ever repeats a suburb name, that one slug gets
qualified (`nugegoda-kandy`) rather than the whole scheme changing — URLs are
the one thing that cannot be changed later without losing search rankings.

Cards **open in a new tab**, so a family can keep several homes open side by
side while comparing, which is how people actually shop for this.

Each home page carries `LocalBusiness` structured data and a canonical URL.

---

## 6. Contact

**Each home is contacted directly.** Its own WhatsApp number appears on its
page, with a pre-filled message naming the home, plus a call button where a
phone number exists.

The number `+94 76 856 4198` belongs to **Blanket Care Malabe** as that home's
listing contact. It is not a site-wide enquiry line.

There is no central enquiry form and no placement funnel.

---

## 7. Data held

No clinical or medical data is collected anywhere. The site holds listing
information supplied by homes or recorded by our field team, plus anonymous
usage events.

`Enquiry`, `Recommendation`, `Appointment` and `Placement` tables exist in the
schema from the placement-service era and are currently unused. They are
harmless, and left in place rather than dropped in case a guided service
returns — but nothing writes to them.

---

## 8. Roles

1. **Visitor / family** — no account. Search, browse, contact homes directly.
2. **Owner** — account created by an admin during onboarding. Signs in with
   phone and password to keep the listing current. Edits are reviewed before
   they go live; verified homes' edits are approved faster.
3. **Admin** — password held in the Railway variable `ADMIN_PASSWORD`. Creates
   and edits listings, records field visits, manages verification, issues owner
   credentials.

### How a home gets listed

Onboarding form → admin review → field visit if they are paying for
verification. Free listings go live after review without a visit.

---

## 9. Attribution

Event logging from the first visitor: listing views, searches, and WhatsApp
click-throughs per listing. Since families now contact homes directly, the
WhatsApp click is the conversion event, and per-listing click counts are the
evidence used when selling verification to a home.

---

## 10. Payments

No gateway. Home verification and renewals are invoiced and settled by bank
transfer, tracked in the ops console. **PAYable** remains the chosen provider if
a gateway is ever added; Sri Lanka is not supported by Stripe.

---

## 11. Technical

| | |
|---|---|
| Stack | Next.js 16.3 (App Router) + TypeScript + Tailwind |
| Database | PostgreSQL via Prisma **7.10.0** (pinned — npm `latest` resolves to an 8.0 release candidate) |
| Hosting | Railway — app and Postgres, both in `asia-southeast1` (Singapore) |
| Repo | `RandomInstances/CareHomes` |
| Domain | carehomes.lk |
| Fonts | Bricolage Grotesque · Public Sans |

Pages are server-rendered. A directory's growth channel is Google, so pages
must return real HTML and work on a low-end Android over mobile data.

Next.js 16 conventions that differ from older versions: `cookies()`, `params`
and `searchParams` are async; `middleware` is now `proxy`; forms use
`useActionState`, whose action must accept `string | null | undefined` first.

> **Railway does not apply `railway.json` to this service.** The `region` key
> was ignored and `preDeployCommand` never ran, leaving a green deployment over
> an empty database. Migrations run from the npm `start` script
> (`prisma migrate deploy && next start`), which the platform cannot skip.
> Deploy settings are set in the dashboard. `/api/health` reports the applied
> migration count so this class of silent failure is visible.

The original prototype remains at `/prototype.html` for design reference.

---

## 12. Build order

1. ~~Admin panel~~ — done: listings CRUD, suburb seeding, owner account creation.
2. ~~Database-backed directory~~ — done: `/`, `/[suburb]`, `/[suburb]/[home]`.
3. **Owner login and edit submission**, with a review queue.
4. **Filters** — care type, fee ceiling, language, beds available. Currently
   search by name and suburb only.
5. **Map view** — Leaflet with price pins, as in the prototype.
6. **Photographs** — uploads from field visits; listings show a placeholder now.
7. **Sitemap and robots.txt.**
8. **Home onboarding form.**
9. **Sinhala and Tamil.**

---

## 13. Open questions

- Company WhatsApp Business number for Blanket Care Malabe, rather than a named
  clinician's personal line on a public page.
- Legal review of the listing agreement, by a Sri Lankan lawyer, before homes
  are signed up.
- Written consent from each home to publish its details, photographs and
  contact number.
