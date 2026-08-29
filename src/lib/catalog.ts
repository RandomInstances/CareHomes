// Pure reference data shared by server and client. Deliberately free of any
// database import: the filter sheet is a client component, and pulling the
// server-only module in here would drag Prisma and pg into the browser bundle.

// One icon per category, each meaning something the others do not: a chair for
// residential living, a medical cross for nursing, a walking frame for
// recovery. The colour is part of the meaning — it is what lets someone pick
// the right tab without reading all four.
export const CARE_TYPES = [
  {
    value: "ELDER_HOME",
    label: "Elder Homes",
    color: "#B4780F",
    icon: '<path d="M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/><path d="M5 10a2 2 0 0 1 2 2v2h10v-2a2 2 0 0 1 2-2"/><path d="M7 16v2.5M17 16v2.5"/>',
  },
  {
    value: "NURSING_HOME",
    label: "Nursing Homes",
    color: "#0E5C55",
    icon: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8.5v7M8.5 12h7"/>',
  },
  {
    value: "REHAB",
    label: "Rehab",
    color: "#31456E",
    icon: '<path d="M6 6v13M18 6v13"/><path d="M6 6h12"/><path d="M6 12.5h12"/><path d="M4 19h4M16 19h4"/>',
  },
] as const;

export const ALL_HOMES_COLOR = "#16292C";

export const ALL_HOMES_ICON =
  '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>';

export type CareTypeValue = (typeof CARE_TYPES)[number]["value"];

export function isCareType(value: string | undefined): value is CareTypeValue {
  return !!value && CARE_TYPES.some((c) => c.value === value);
}

export const SORTS = [
  {
    value: "updated",
    label: "Recently updated",
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  },
  {
    value: "fee-asc",
    label: "Lowest fee first",
    icon: '<path d="M4 6h4M4 12h7M4 18h10"/><path d="M18 18V6"/><path d="M15 9l3-3 3 3"/>',
  },
  {
    value: "fee-desc",
    label: "Highest fee first",
    icon: '<path d="M4 6h10M4 12h7M4 18h4"/><path d="M18 6v12"/><path d="M15 15l3 3 3-3"/>',
  },
  {
    value: "beds",
    label: "Most beds available",
    icon: '<path d="M2.5 17.5v-5h19v5"/><path d="M2.5 17.5v3M21.5 17.5v3"/><path d="M6.5 12.5v-3h5v3"/>',
  },
] as const;

export type SortValue = (typeof SORTS)[number]["value"];

export function isSort(value: unknown): value is SortValue {
  return typeof value === "string" && SORTS.some((s) => s.value === value);
}

export const LANGUAGES = [
  { value: "SINHALA", label: "Sinhala" },
  { value: "TAMIL", label: "Tamil" },
  { value: "ENGLISH", label: "English" },
] as const;

/// Drawn from the demo listings; a real deployment would derive these from the
/// facilities actually recorded on visits.
export const FEATURES = [
  "24h nursing",
  "Doctor on call",
  "Physiotherapy",
  "Private rooms",
  "Air-conditioned",
  "Garden",
  "Wheelchair accessible",
  "Family video calls",
  "Diabetic diets",
  "Vegetarian meals",
  "All meals included",
  "Lift",
  "Wi-Fi",
  "Laundry",
  "Parking",
  "Backup generator",
  "Security",
];

/// What a home will and will not take. The single most useful field for
/// stopping families and homes wasting calls on each other — "will you take my
/// bedridden father with a feeding tube" is answerable from data, not a phone
/// call to twenty homes.
export const ADMISSION = [
  { value: "BEDRIDDEN", label: "Bedridden residents" },
  { value: "DEMENTIA_WANDERING", label: "Dementia with wandering" },
  { value: "FEEDING_TUBE", label: "Feeding tube (NG or PEG)" },
  { value: "CATHETER", label: "Catheter or stoma care" },
  { value: "OXYGEN", label: "Oxygen dependency" },
  { value: "BEHAVIOURAL", label: "Behavioural challenges" },
  { value: "WHEELCHAIR", label: "Wheelchair users" },
  { value: "DIALYSIS", label: "Dialysis, with transport" },
  { value: "COUPLES", label: "Couples sharing a room" },
  { value: "SHORT_STAY", label: "Short stays" },
] as const;

export type AdmissionValue = (typeof ADMISSION)[number]["value"];

export const ADMISSION_LABEL: Record<string, string> = Object.fromEntries(
  ADMISSION.map((a) => [a.value, a.label])
);

export function isAdmission(value: string): value is AdmissionValue {
  return ADMISSION.some((a) => a.value === value);
}

export const FEE_MAX = 500000;

export const CARE_LABEL: Record<string, string> = Object.fromEntries(
  CARE_TYPES.map((c) => [c.value, c.label])
);

export const LANGUAGE_LABEL: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.value, l.label])
);

export function formatFee(from: number | null, to: number | null) {
  if (!from && !to) return null;
  const fmt = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;
  if (from && to && to > from) return `${fmt(from)} – ${to.toLocaleString("en-LK")}`;
  return fmt((from ?? to) as number);
}
