// Icons for facilities. Matched on keywords rather than an exact list, because
// admins type facilities freely and a home will eventually write "lift" where
// another wrote "elevator". Anything unrecognised falls back to a tick, so a new
// facility never renders as a blank space.

type Rule = { match: RegExp; path: string };

const RULES: Rule[] = [
  // Care and medical
  { match: /nurs/i, path: '<path d="M12 4v6m-3-3h6"/><path d="M5 21v-8a7 7 0 0 1 14 0v8"/>' },
  { match: /doctor|physician|medical/i, path: '<path d="M6 3v6a6 6 0 0 0 12 0V3"/><path d="M6 3H4m14 0h2"/><circle cx="18" cy="15" r="3"/><path d="M18 12V9"/>' },
  { match: /physio|therap|rehab/i, path: '<path d="M3 12h4l3-8 4 16 3-8h4"/>' },
  { match: /dementia|memory/i, path: '<path d="M12 4a6 6 0 0 0-6 6c0 2 .8 3 .8 4.6L6 20h9v-3h2a1 1 0 0 0 1-1v-2.4l1.4-.9-1.7-2.5A6 6 0 0 0 12 4z"/>' },
  { match: /pharmac|medicin/i, path: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/><path d="M12 12v5m-2.5-2.5h5"/>' },

  // Building and access
  { match: /lift|elevator/i, path: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 9l3-3 3 3M9 15l3 3 3-3"/>' },
  { match: /wheelchair|accessib|step-free|ramp/i, path: '<circle cx="11" cy="19" r="4"/><path d="M15 19h4l-3-7H9V5"/><circle cx="9" cy="3.5" r="1.5"/>' },
  { match: /private room|en-?suite/i, path: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M7 10V7h6v3"/>' },
  { match: /garden|outdoor|terrace/i, path: '<path d="M12 22v-6"/><path d="M12 16c-4 0-6-2.5-6-6a6 6 0 0 1 12 0c0 3.5-2 6-6 6z"/>' },
  { match: /air.?condition|a\/c|cooling/i, path: '<path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5"/><path d="M12 6l-2-2m2 2 2-2m-2 14-2 2m2-2 2 2"/>' },
  { match: /park/i, path: '<path d="M5 17h14M6 17V9l2-4h8l2 4v8"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>' },
  { match: /generator|backup power|solar/i, path: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>' },
  { match: /security|cctv|camera|gated/i, path: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/>' },

  // Daily life
  { match: /wi-?fi|internet|broadband/i, path: '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/><path d="M2 9a15 15 0 0 1 20 0"/>' },
  { match: /video call|family call|whatsapp/i, path: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 11 6-3v8l-6-3z"/>' },
  { match: /meal|food|diet|vegetarian|kitchen|catering/i, path: '<path d="M4 3v8a3 3 0 0 0 6 0V3"/><path d="M7 11v10"/><path d="M17 3c-1.5 2-2 4-2 6s.5 3 2 3 2-1 2-3-.5-4-2-6z"/><path d="M17 12v9"/>' },
  { match: /laundry|washing/i, path: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6.5h.01M11 6.5h.01"/>' },
  { match: /tv|television|entertain/i, path: '<rect x="2" y="5" width="20" height="13" rx="2"/><path d="m8 21 4-3 4 3"/>' },
  { match: /prayer|religio|temple|pirith|church/i, path: '<path d="M12 3v18M8 8h8"/><path d="M5 21c2-4 4-6 7-6s5 2 7 6"/>' },
  { match: /transport|vehicle|ambulance/i, path: '<path d="M3 17V7h11v10"/><path d="M14 10h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>' },
  { match: /visit|family/i, path: '<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="8" r="4"/>' },
];

const FALLBACK = '<path d="m4 12 5 5L20 6"/>';

export function featureIconPath(feature: string) {
  return RULES.find((r) => r.match.test(feature))?.path ?? FALLBACK;
}

export function FeatureIcon({ feature, className = "" }: { feature: string; className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: featureIconPath(feature) }}
    />
  );
}

/// Facilities as a labelled icon grid rather than a row of plain chips.
export function FeatureList({ features }: { features: string[] }) {
  if (!features.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-2.5 text-[15px]">
          <span className="shrink-0 w-9 h-9 rounded-full bg-teal-soft text-teal grid place-items-center">
            <FeatureIcon feature={f} />
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

/// Compact icon row for cards. Each icon names itself on hover, and the +N
/// expands to show what it is hiding rather than leaving people to guess.
/// Pure CSS hover — no state, so this still renders inside a server component.
export function FeatureRow({ features, max = 4 }: { features: string[]; max?: number }) {
  if (!features.length) return null;

  const shown = features.slice(0, max);
  const rest = features.slice(max);

  return (
    <ul className="flex items-center gap-1.5 text-muted shrink-0">
      {shown.map((f) => (
        <li key={f} className="relative group/f leading-none">
          <FeatureIcon feature={f} className="w-4 h-4" />
          <span className="sr-only">{f}</span>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/f:block whitespace-nowrap rounded-md bg-ink text-white text-[11.5px] font-medium px-2 py-1 shadow-lg z-30"
          >
            {f}
          </span>
        </li>
      ))}

      {rest.length ? (
        <li className="relative group/more leading-none">
          <button
            type="button"
            aria-label={`${rest.length} more: ${rest.join(", ")}`}
            className="text-[12px] tabular-nums font-medium hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded"
          >
            +{rest.length}
          </button>
          <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover/more:block group-focus-within/more:block z-30 rounded-xl bg-ink text-white px-3 py-2.5 shadow-xl">
            <ul className="space-y-1.5">
              {rest.map((f) => (
                <li key={f} className="flex items-center gap-2 whitespace-nowrap text-[12.5px]">
                  <FeatureIcon feature={f} className="w-3.5 h-3.5 opacity-75 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ) : null}
    </ul>
  );
}
