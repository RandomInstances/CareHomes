// Pure reference data shared by server and client. Deliberately free of any
// database import: the filter sheet is a client component, and pulling the
// server-only module in here would drag Prisma and pg into the browser bundle.

// Icon paths carried over from the prototype's category bar, unchanged.
export const CARE_TYPES = [
  {
    value: "ASSISTED_LIVING",
    label: "Assisted living",
    icon: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M7 10V7h6v3"/>',
  },
  {
    value: "NURSING",
    label: "Nursing care",
    icon: '<path d="M12 4v6m-3-3h6"/><path d="M5 21v-8a7 7 0 0 1 14 0v8"/>',
  },
  {
    value: "DEMENTIA",
    label: "Dementia care",
    icon: '<path d="M12 4a6 6 0 0 0-6 6c0 2 .8 3 .8 4.6L6 20h9v-3h2a1 1 0 0 0 1-1v-2.4l1.4-.9-1.7-2.5A6 6 0 0 0 12 4z"/>',
  },
  {
    value: "RESPITE",
    label: "Respite",
    icon: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  },
  {
    value: "PALLIATIVE",
    label: "Palliative care",
    icon: '<path d="M12 20s-7-4.4-7-9.5A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.5C19 15.6 12 20 12 20z"/>',
  },
  {
    value: "REHAB",
    label: "Rehab",
    icon: '<path d="M4 20h16"/><path d="M6 20V9l6-4 6 4v11"/><path d="M9 20v-6h6v6"/>',
  },
] as const;

export const ALL_HOMES_ICON =
  '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>';

export type CareTypeValue = (typeof CARE_TYPES)[number]["value"];

export function isCareType(value: string | undefined): value is CareTypeValue {
  return !!value && CARE_TYPES.some((c) => c.value === value);
}

export const SORTS = [
  { value: "updated", label: "Recently updated" },
  { value: "fee-asc", label: "Lowest fee first" },
  { value: "fee-desc", label: "Highest fee first" },
  { value: "beds", label: "Most beds available" },
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
