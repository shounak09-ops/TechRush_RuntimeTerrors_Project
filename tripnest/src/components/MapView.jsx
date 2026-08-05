import React, { useEffect, useRef } from "react";
import { X, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./MapView.css";
import L from "leaflet";

// A global bridge so raw Leaflet popup HTML (strings) can call back into React.
// Leaflet popups aren't React-rendered, so we can't attach onClick handlers
// directly — instead the popup buttons call these window-level functions,
// which forward the click into the React callbacks passed as props.
function useMapBridge({ onViewDetails }) {
  const bridgeRef = useRef(null);

  useEffect(() => {
    bridgeRef.current = {
      viewDetails: (id) => {
        const dest = window.__tripnestDestinations?.find((d) => d.id === id);
        if (dest) onViewDetails(dest);
      },
    };
    window.__tripnestMapBridge = bridgeRef.current;
    return () => {
      delete window.__tripnestMapBridge;
    };
  }, [onViewDetails]);
}

export default function MapView({ open, onClose, destinations, onViewDetails }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const routeStartMarkerRef = useRef(null);
  const markerIndexRef = useRef({});
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const clearRouteBtnRef = useRef(null);
  const routeInfoRef = useRef(null);

  useMapBridge({ onViewDetails });

  // Expose destinations for the bridge to look up by id
  useEffect(() => {
    window.__tripnestDestinations = destinations;
  }, [destinations]);

  // Initialize the Leaflet map once, when the overlay opens
  useEffect(() => {
    if (!open || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, { scrollWheelZoom: true }).setView([20, 10], 2);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    const customIcon = L.divIcon({
      className: "",
      html: '<div class="dest-marker"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      popupAnchor: [0, -20],
    });

    const startIcon = L.divIcon({
      className: "",
      html: '<div style="background:#16a34a;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
    });
    mapRef.current.__startIcon = startIcon;

    const markerIndex = {};
    destinations.forEach((dest) => {
      if (dest.lat == null || dest.lon == null) return;
      const marker = L.marker([dest.lat, dest.lon], { icon: customIcon }).addTo(map);
      markerIndex[dest.id] = { marker, dest };

      const popupHtml = `
        <div class="popup-card">
          <img src="${dest.image}" alt="${dest.name}">
          <h3>${dest.name}</h3>
          <p>${dest.description ? dest.description.slice(0, 70) : ""}</p>
          <button onclick="window.__tripnestMapBridge?.viewDetails(${dest.id})">View Details</button>
          <button class="secondary" id="dir-${dest.id}" onclick="window.__tripnestMapDirections?.(${dest.lat}, ${dest.lon}, this)">Get Directions</button>
        </div>
      `;
      marker.bindPopup(popupHtml);
    });
    markerIndexRef.current = markerIndex;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Directions / routing bridge (kept as a window function so it can be
  // invoked from raw popup HTML, same pattern as View Details above)
  useEffect(() => {
    function clearRoute() {
      const map = mapRef.current;
      if (!map) return;
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }
      if (routeStartMarkerRef.current) {
        map.removeLayer(routeStartMarkerRef.current);
        routeStartMarkerRef.current = null;
      }
      if (clearRouteBtnRef.current) clearRouteBtnRef.current.style.display = "none";
      if (routeInfoRef.current) routeInfoRef.current.style.display = "none";
    }

    function formatDistance(meters) {
      return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
    }

    function formatDuration(seconds) {
      const totalMin = Math.round(seconds / 60);
      if (totalMin < 60) return `${totalMin} min`;
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      return `${h} h ${m} min`;
    }

    async function drawRoute(startLat, startLng, destLat, destLng) {
      const map = mapRef.current;
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || !data.routes.length) {
        alert("Couldn't find a route between those points.");
        return;
      }

      clearRoute();

      const route = data.routes[0];
      const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      routeLayerRef.current = L.polyline(coords, { color: "#2563eb", weight: 5, opacity: 0.85 }).addTo(map);
      routeStartMarkerRef.current = L.marker([startLat, startLng], { icon: map.__startIcon })
        .addTo(map)
        .bindPopup("You are here");

      map.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });

      if (routeInfoRef.current) {
        routeInfoRef.current.innerHTML = `${formatDistance(route.distance)}<span>${formatDuration(route.duration)} drive</span>`;
        routeInfoRef.current.style.display = "block";
      }
      if (clearRouteBtnRef.current) clearRouteBtnRef.current.style.display = "block";
    }

    window.__tripnestMapDirections = (destLat, destLng, btn) => {
      if (!navigator.geolocation) {
        alert("Geolocation isn't supported in this browser.");
        return;
      }
      const originalText = btn ? btn.textContent : null;
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Locating...";
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await drawRoute(pos.coords.latitude, pos.coords.longitude, destLat, destLng);
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
        },
        () => {
          alert("Couldn't get your location. Please allow location access and try again.");
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
        }
      );
    };

    window.__tripnestClearRoute = clearRoute;

    return () => {
      delete window.__tripnestMapDirections;
      delete window.__tripnestClearRoute;
    };
  }, []);

  const handleLocateMe = () => {
    const map = mapRef.current;
    if (!map) return;
    if (!navigator.geolocation) {
      alert("Geolocation isn't supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        L.marker(latlng, { icon: map.__startIcon }).addTo(map).bindPopup("You are here").openPopup();
        map.setView(latlng, 10);
      },
      () => alert("Couldn't get your location. Please allow location access.")
    );
  };

  const renderSearchResults = (query) => {
    const el = searchResultsRef.current;
    if (!el) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      el.style.display = "none";
      el.innerHTML = "";
      return;
    }
    const matches = destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.country && d.country.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      el.innerHTML = '<div class="no-match">No destinations match</div>';
    } else {
      el.innerHTML = matches.map((d) => `<div data-id="${d.id}">${d.name}</div>`).join("");
    }
    el.style.display = "block";
  };

  const selectDestination = (id) => {
    const entry = markerIndexRef.current[id];
    const map = mapRef.current;
    if (!entry || !map) return;
    map.flyTo([entry.dest.lat, entry.dest.lon], 6, { duration: 1 });
    setTimeout(() => entry.marker.openPopup(), 900);
    if (searchResultsRef.current) searchResultsRef.current.style.display = "none";
    if (searchInputRef.current) searchInputRef.current.value = entry.dest.name;
  };

  const handleSearchResultsClick = (e) => {
    const target = e.target.closest("div[data-id]");
    if (target) selectDestination(Number(target.dataset.id));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const q = e.currentTarget.value.trim().toLowerCase();
      const first = destinations.find((d) => d.name.toLowerCase().includes(q));
      if (first) selectDestination(first.id);
    } else if (e.key === "Escape") {
      if (searchResultsRef.current) searchResultsRef.current.style.display = "none";
      e.currentTarget.blur();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6 animate-fade-in">
      <div className="relative bg-white dark:bg-slate-900 w-full h-full sm:rounded-3xl sm:max-w-6xl sm:h-[85vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header bar */}
        <div className="absolute top-0 left-0 right-0 z-[1100] flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <MapPin className="h-5 w-5 text-sky-500" />
            Live Destination Map
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="tn-map-controls">
          <div className="tn-search-wrap">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="🔍 Search destinations..."
              autoComplete="off"
              onChange={(e) => renderSearchResults(e.target.value)}
              onFocus={(e) => e.target.value && renderSearchResults(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="tn-search-input"
            />
            <div
              ref={searchResultsRef}
              className="tn-search-results"
              onClick={handleSearchResultsClick}
            />
          </div>
          <button onClick={handleLocateMe} className="tn-locate-btn">
            📍 Use my location
          </button>
        </div>

        <button
          ref={clearRouteBtnRef}
          onClick={() => window.__tripnestClearRoute?.()}
          className="tn-clear-route-btn"
        >
          ✕ Clear route
        </button>
        <div ref={routeInfoRef} className="tn-route-info" />

        {/* Map container */}
        <div ref={mapContainerRef} className="w-full h-full pt-[56px]" />
      </div>
    </div>
  );
}
