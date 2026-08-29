"use client";

import { useActionState } from "react";

type Suburb = { id: string; name: string };

type HomeValues = {
  name?: string;
  slug?: string;
  description?: string;
  suburbId?: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  feeFrom?: number | null;
  feeTo?: number | null;
  feeExcludes?: string[];
  bedsTotal?: number | null;
  bedsAvailable?: number | null;
  roomTypes?: string[];
  careTypes?: string[];
  features?: string[];
  languages?: string[];
  nightNurses?: number | null;
  doctorArrangement?: string | null;
  transferHospital?: string | null;
  visitingHours?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  status?: string;
  tier?: string;
  accepts?: string[];
  notAccepted?: string[];
  minAge?: number | null;
  maxAge?: number | null;
  nseRegistered?: boolean | null;
  isBlanketHome?: boolean;
};

const CARE_TYPES = [
  ["ASSISTED_LIVING", "Assisted living"],
  ["NURSING", "Nursing care"],
  ["DEMENTIA", "Dementia care"],
  ["RESPITE", "Respite"],
  ["PALLIATIVE", "Palliative"],
  ["REHAB", "Post-surgery rehab"],
] as const;

const ADMISSION = [
  ["BEDRIDDEN", "Bedridden residents"],
  ["DEMENTIA_WANDERING", "Dementia with wandering"],
  ["FEEDING_TUBE", "Feeding tube (NG or PEG)"],
  ["CATHETER", "Catheter or stoma care"],
  ["OXYGEN", "Oxygen dependency"],
  ["BEHAVIOURAL", "Behavioural challenges"],
  ["WHEELCHAIR", "Wheelchair users"],
  ["DIALYSIS", "Dialysis, with transport"],
  ["COUPLES", "Couples sharing a room"],
  ["SHORT_STAY", "Short stays"],
] as const;

const LANGUAGES = [
  ["SINHALA", "Sinhala"],
  ["TAMIL", "Tamil"],
  ["ENGLISH", "English"],
] as const;

const field =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600";
const labelText = "text-sm font-medium text-stone-700";

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {hint ? <p className="text-sm text-stone-500 mt-0.5 max-w-prose">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function HomeForm({
  action,
  suburbs,
  values = {},
  submitLabel,
}: {
  action: (prev: string | null | undefined, formData: FormData) => Promise<string | undefined>;
  suburbs: Suburb[];
  values?: HomeValues;
  submitLabel: string;
}) {
  const [message, formAction, pending] = useActionState(action, null);
  const isError = message && message !== "Saved.";

  return (
    <form action={formAction} className="space-y-5">
      <Section title="The basics">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className={labelText}>Name of the home</span>
            <input name="name" defaultValue={values.name ?? ""} required className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Suburb</span>
            <select name="suburbId" defaultValue={values.suburbId ?? ""} required className={field}>
              <option value="">Choose a suburb…</option>
              {suburbs.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-1.5 block">
          <span className={labelText}>Web address</span>
          <input name="slug" defaultValue={values.slug ?? ""} placeholder="Leave blank to build it from the name" className={field} />
          <span className="text-xs text-stone-500">
            Appears in the page link. Changing it later breaks any link already shared.
          </span>
        </label>

        <label className="space-y-1.5 block">
          <span className={labelText}>Description</span>
          <textarea name="description" rows={4} defaultValue={values.description ?? ""} className={field} />
        </label>

        <label className="space-y-1.5 block">
          <span className={labelText}>Address</span>
          <input name="address" defaultValue={values.address ?? ""} className={field} />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className={labelText}>Latitude</span>
            <input name="lat" defaultValue={values.lat ?? ""} placeholder="6.8700" className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Longitude</span>
            <input name="lng" defaultValue={values.lng ?? ""} placeholder="79.8900" className={field} />
          </label>
        </div>
      </Section>

      <Section
        title="Fees and beds"
        hint="Fees are rupees per month. What the fee excludes is the thing families most often get caught out by, so it is worth collecting in writing."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className={labelText}>Fee from</span>
            <input name="feeFrom" defaultValue={values.feeFrom ?? ""} placeholder="90000" className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Fee up to</span>
            <input name="feeTo" defaultValue={values.feeTo ?? ""} placeholder="180000" className={field} />
          </label>
        </div>

        <label className="space-y-1.5 block">
          <span className={labelText}>Not included in the fee</span>
          <input name="feeExcludes" defaultValue={(values.feeExcludes ?? []).join(", ")} placeholder="Medicines, diapers, physiotherapy" className={field} />
          <span className="text-xs text-stone-500">Separate each with a comma.</span>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className={labelText}>Beds in total</span>
            <input name="bedsTotal" defaultValue={values.bedsTotal ?? ""} className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Beds available now</span>
            <input name="bedsAvailable" defaultValue={values.bedsAvailable ?? ""} className={field} />
          </label>
        </div>

        <label className="space-y-1.5 block">
          <span className={labelText}>Room types</span>
          <input name="roomTypes" defaultValue={(values.roomTypes ?? []).join(", ")} placeholder="Shared, Semi-private, Private" className={field} />
        </label>
      </Section>

      <Section title="Care provided">
        <fieldset className="space-y-2">
          <legend className={labelText}>Types of care</legend>
          <div className="grid sm:grid-cols-3 gap-2">
            {CARE_TYPES.map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="careTypes" value={value} defaultChecked={values.careTypes?.includes(value)} className="rounded border-stone-400" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className={labelText}>Languages spoken by staff</legend>
          <div className="flex gap-4">
            {LANGUAGES.map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="languages" value={value} defaultChecked={values.languages?.includes(value)} className="rounded border-stone-400" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="space-y-1.5 block">
          <span className={labelText}>Facilities</span>
          <input name="features" defaultValue={(values.features ?? []).join(", ")} placeholder="Wheelchair access, Garden, Private rooms" className={field} />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className={labelText}>Nurses on the night shift</span>
            <input name="nightNurses" defaultValue={values.nightNurses ?? ""} className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Visiting hours</span>
            <input name="visitingHours" defaultValue={values.visitingHours ?? ""} className={field} />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className={labelText}>Doctor arrangement</span>
            <input name="doctorArrangement" defaultValue={values.doctorArrangement ?? ""} className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Transfers to which hospital</span>
            <input name="transferHospital" defaultValue={values.transferHospital ?? ""} className={field} />
          </label>
        </div>
      </Section>

      <Section
        title="Who this home will take"
        hint="The most useful thing you can record. Families filter on it, so the home stops fielding calls it always has to refuse — and nobody rings round to find out."
      >
        <fieldset className="space-y-2">
          <legend className={labelText}>Will accept</legend>
          <div className="grid sm:grid-cols-2 gap-2">
            {ADMISSION.map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="accepts" value={value} defaultChecked={values.accepts?.includes(value)} className="rounded border-stone-400" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2 pt-2">
          <legend className={labelText}>Cannot take</legend>
          <p className="text-sm text-stone-500 -mt-0.5">Say so explicitly — it is what stops the wasted call.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {ADMISSION.map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="notAccepted" value={value} defaultChecked={values.notAccepted?.includes(value)} className="rounded border-stone-400" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <label className="space-y-1.5 block">
            <span className={labelText}>Youngest resident accepted</span>
            <input name="minAge" defaultValue={values.minAge ?? ""} placeholder="e.g. 55" className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Oldest resident accepted</span>
            <input name="maxAge" defaultValue={values.maxAge ?? ""} placeholder="Leave blank for no limit" className={field} />
          </label>
        </div>
      </Section>

      <Section
        title="Contact details"
        hint="Not shown to families — every enquiry comes through us. This is how your team reaches the home."
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="space-y-1.5 block">
            <span className={labelText}>Phone</span>
            <input name="phone" defaultValue={values.phone ?? ""} className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>WhatsApp</span>
            <input name="whatsapp" defaultValue={values.whatsapp ?? ""} className={field} />
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Email</span>
            <input name="email" defaultValue={values.email ?? ""} className={field} />
          </label>
        </div>
      </Section>

      <Section
        title="Status and tier"
        hint="Verified means your team has visited and inspected the home. Verified homes appear ahead of unverified ones."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className={labelText}>Listing status</span>
            <select name="status" defaultValue={values.status ?? "PENDING_REVIEW"} className={field}>
              <option value="DRAFT">Draft — not visible</option>
              <option value="PENDING_REVIEW">Pending review — not visible</option>
              <option value="LIVE">Live — visible to families</option>
              <option value="SUSPENDED">Suspended — hidden</option>
            </select>
          </label>
          <label className="space-y-1.5 block">
            <span className={labelText}>Tier</span>
            <select name="tier" defaultValue={values.tier ?? "UNVERIFIED"} className={field}>
              <option value="UNVERIFIED">Unverified — free listing</option>
              <option value="VERIFIED">Verified — visited and paid</option>
            </select>
          </label>
        </div>

        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="nseRegistered" defaultChecked={values.nseRegistered ?? false} className="rounded border-stone-400" />
            Registered with the National Secretariat for Elders
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isBlanketHome" defaultChecked={values.isBlanketHome ?? false} className="rounded border-stone-400" />
            Operated by Blanket Care — disclosed on the site, never used for ranking
          </label>
        </div>
      </Section>

      {message ? (
        <p
          className={
            isError
              ? "text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              : "text-sm text-teal-800 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2"
          }
        >
          {message}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-teal-800 text-white font-semibold px-5 py-2.5 disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
