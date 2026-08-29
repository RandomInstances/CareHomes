"use client";

import dynamic from "next/dynamic";

import type { DirectoryHome } from "@/app/directory";

// Leaflet touches window on import, so it must not run during SSR. `ssr: false`
// is only allowed inside a client component, which is all this wrapper is for.
const InlineMap = dynamic(() => import("@/app/map-view").then((m) => m.InlineMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-teal-soft/40" />,
});

export function SuburbMap({ homes }: { homes: DirectoryHome[] }) {
  return <InlineMap homes={homes} />;
}
