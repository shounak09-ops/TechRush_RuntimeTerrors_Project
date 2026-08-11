import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// The itinerary's activities (from both the AI planner and the mock
// generator) only ever carry a title/time/category/cost — there's no real
// geocoded address for "Sunset at the old fort" or similar. Rather than
// pretend to precision we don't have, each activity gets a small,
// deterministic offset from the destination's real coordinates (seeded by
// its own id/title, so the same activity always lands in the same spot
// instead of jumping around on every re-render). This is clearly an
// approximate, illustrative layout, not a geocoded address — the caption
// in the UI says so.
function seededOffset(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  // Two independent-ish pseudo-random values from the same hash, spread
  // within roughly a 2-3km "neighborhood" around the destination center.
  const a = Math.sin(hash) * 10000;
  const b = Math.sin(hash * 2.17) * 10000;
  const rand1 = a - Math.floor(a);
  const rand2 = b - Math.floor(b);
  const spread = 0.02; // ~2km of latitude/longitude at most latitudes
  return {
    dLat: (rand1 - 0.5) * spread,
    dLon: (rand2 - 0.5) * spread,
  };
}

const numberedIcon = (n, active) =>
  L.divIcon({
    className: "",
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:26px;height:26px;border-radius:9999px;
      background:${active ? "linear-gradient(to bottom right,#0ea5e9,#10b981)" : "#fff"};
      color:${active ? "#fff" : "#0f172a"};
      border:2px solid ${active ? "#fff" : "#0ea5e9"};
      font-size:12px;font-weight:700;font-family:inherit;
      box-shadow:0 2px 8px rgba(15,23,42,0.25);
    ">${n}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });

const destinationIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:#475569;border:2px solid #fff;
    box-shadow:0 2px 6px rgba(0,0,0,.35);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function ItineraryDayMap({ destination, activities, selectedDay, theme }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerGroupRef = useRef(null);

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([destination.lat, destination.lon], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw markers/route whenever the destination or the selected day's
  // activities change — without tearing down the whole map instance.
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup || !destination) return;

    layerGroup.clearLayers();

    L.marker([destination.lat, destination.lon], { icon: destinationIcon })
      .bindPopup(`<b>${destination.name}</b>`)
      .addTo(layerGroup);

    const points = [[destination.lat, destination.lon]];

    activities.forEach((activity, idx) => {
      const { dLat, dLon } = seededOffset(String(activity.id || activity.title || idx));
      const lat = destination.lat + dLat;
      const lon = destination.lon + dLon;
      points.push([lat, lon]);

      L.marker([lat, lon], { icon: numberedIcon(idx + 1, true) })
        .bindPopup(
          `<div style="font-family:inherit;min-width:140px">
            <div style="font-weight:700;font-size:13px;margin-bottom:2px">${activity.title || "Activity"}</div>
            <div style="font-size:11px;color:#64748b">${activity.time || ""}${activity.time && activity.category ? " · " : ""}${activity.category || ""}</div>
          </div>`
        )
        .addTo(layerGroup);
    });

    if (points.length > 1) {
      L.polyline(points.slice(1), {
        color: "#0ea5e9",
        weight: 3,
        opacity: 0.6,
        dashArray: "6 6",
      }).addTo(layerGroup);
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [destination, activities, selectedDay]);

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="flex-1 min-h-0" />
      <p
        className={`px-3 py-2 text-center text-[10px] ${
          theme === "dark" ? "text-slate-500 bg-slate-900" : "text-slate-400 bg-white"
        }`}
      >
        Activity positions are approximate, centered around {destination?.name}.
      </p>
    </div>
  );
}
