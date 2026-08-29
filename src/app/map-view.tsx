"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef } from "react";

import type { DirectoryHome } from "@/app/directory";

// Full-screen map with price pins, as in the prototype. Leaflet plus
// OpenStreetMap tiles: no API key, no billing, and good enough coverage of
// Colombo. Swap the tile URL for a commercial provider if usage ever warrants.

const COLOMBO: [number, number] = [6.9, 79.89];

function priceLabel(home: DirectoryHome) {
  const fee = home.feeFrom ?? home.feeTo;
  if (!fee) return "—";
  return fee >= 1000 ? `${Math.round(fee / 1000)}K` : String(fee);
}

/// Draws the pins into whatever container it is given. Shared by the
/// full-screen overlay and the split view beside a suburb's listings.
function useHomesMap(
  container: React.RefObject<HTMLDivElement | null>,
  homes: DirectoryHome[]
) {
  useEffect(() => {
    if (!container.current) return;

    const withCoords = homes.filter(
      (h): h is DirectoryHome & { lat: number; lng: number } =>
        typeof h.lat === "number" && typeof h.lng === "number"
    );

    const map = L.map(container.current, { zoomControl: true, scrollWheelZoom: false }).setView(COLOMBO, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    const markers = withCoords.map((home) => {
      const verified = home.tier === "VERIFIED";
      const icon = L.divIcon({
        className: "",
        html: `<span style="
          display:inline-block; background:#fff; color:#16292c;
          border:1.5px solid ${verified ? "#0e5c55" : "#cfd7d5"};
          border-radius:999px; padding:4px 10px;
          font: 700 12.5px var(--font-public-sans), system-ui, sans-serif;
          box-shadow: 0 2px 8px rgba(23,48,45,.22); white-space:nowrap;
        ">${priceLabel(home)}</span>`,
        iconSize: [0, 0],
        iconAnchor: [26, 14],
      });

      return L.marker([home.lat, home.lng], { icon, title: home.name })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:170px">
             <strong>${home.name}</strong><br/>
             <span style="color:#4c6164">${home.suburb.name}</span><br/>
             <a href="/${home.suburb.slug}/${home.slug}" style="color:#0e5c55;font-weight:600">
               View this home
             </a>
           </div>`
        );
    });

    if (markers.length > 1) {
      map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2));
    }

    // Leaflet measures on creation; nudge it once the browser has laid out.
    const timer = window.setTimeout(() => map.invalidateSize(), 60);

    return () => {
      window.clearTimeout(timer);
      map.remove();
    };
  }, [container, homes]);
}

/// The split view beside a suburb's listings, as on Airbnb.
export function InlineMap({ homes }: { homes: DirectoryHome[] }) {
  const container = useRef<HTMLDivElement>(null);
  useHomesMap(container, homes);
  return <div ref={container} className="w-full h-full" />;
}

export function MapView({
  homes,
  onClose,
}: {
  homes: DirectoryHome[];
  onClose: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  useHomesMap(container, homes);

  const missing = homes.filter((h) => typeof h.lat !== "number" || typeof h.lng !== "number").length;

  return (
    <div className="fixed inset-0 z-[60] bg-bg">
      <div ref={container} className="absolute inset-0" />

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 left-4 z-[1000] inline-flex items-center gap-2 rounded-full bg-surface border border-line-2 px-4 py-2.5 text-sm font-semibold shadow-lg"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to the list
      </button>

      {missing > 0 ? (
        <p className="absolute bottom-4 left-4 z-[1000] rounded-full bg-surface border border-line px-3.5 py-2 text-[12.5px] text-ink-2 shadow">
          {missing} home{missing > 1 ? "s" : ""} without a location yet
        </p>
      ) : null}
    </div>
  );
}
