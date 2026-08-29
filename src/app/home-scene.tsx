// The illustrated house from the prototype. Each listing gets a consistent
// scene so a directory with no photographs still looks finished.
//
// The prototype carried a hand-picked palette per home. Here the palette is
// chosen by hashing the slug instead, so every home — including ones added
// later in the admin panel — gets a stable illustration with nobody having to
// choose colours. Replace this with real photography from the field visits.

const PALETTES: [string, string][] = [
  ["#DCEAE6", "#1F5F5B"], // teal
  ["#F8EBCD", "#A6661C"], // turmeric
  ["#E3E9F5", "#31456E"], // indigo
  ["#E8EFE0", "#4A6B33"], // olive
  ["#F6E3E1", "#8E463C"], // clay
  ["#E4EDEF", "#2E5C6B"], // slate blue
  ["#F1E9F2", "#5D4270"], // plum
  ["#EFEBE2", "#6B5B3E"], // sand
];

function paletteFor(slug: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return PALETTES[hash % PALETTES.length];
}

export function HomeScene({
  slug,
  suburbName,
  className = "",
}: {
  slug: string;
  suburbName: string;
  className?: string;
}) {
  const [bg, fg] = paletteFor(slug);

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <rect width="400" height="300" fill={bg} />
      <circle cx="330" cy="60" r="34" fill={fg} opacity=".14" />
      <path d="M0 232 Q100 208 200 226 T400 220 V300 H0 Z" fill={fg} opacity=".16" />
      <path d="M118 210 V138 L200 92 L282 138 V210 Z" fill="#fff" opacity=".92" />
      <path d="M110 142 L200 88 L290 142" stroke={fg} strokeWidth="9" fill="none" strokeLinecap="round" />
      <rect x="184" y="164" width="32" height="46" rx="3" fill={fg} opacity=".85" />
      <rect x="138" y="156" width="26" height="24" rx="3" fill={fg} opacity=".45" />
      <rect x="236" y="156" width="26" height="24" rx="3" fill={fg} opacity=".45" />
      <circle cx="84" cy="196" r="17" fill={fg} opacity=".35" />
      <rect x="81" y="196" width="6" height="26" fill={fg} opacity=".35" />
      <circle cx="322" cy="192" r="21" fill={fg} opacity=".3" />
      <rect x="319" y="192" width="6" height="30" fill={fg} opacity=".3" />
      <text
        x="20"
        y="282"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="15"
        fill={fg}
        opacity=".75"
      >
        {suburbName}
      </text>
    </svg>
  );
}
