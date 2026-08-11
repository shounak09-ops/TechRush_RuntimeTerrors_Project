import React, { useState } from "react";
import { X, Compass, Search as SearchIcon } from "lucide-react";
import DestinationCard from "./DestinationCard";

// "View All" opens this as a self-contained browsing window — same visual
// language as the Live Map overlay (full-screen on mobile, a centered
// rounded panel on larger screens) — so the two full-screen "escape
// hatches" in the app feel like one consistent pattern rather than two
// different modal styles.
export default function AllDestinationsOverlay({
  open,
  onClose,
  destinations,
  favorites,
  onToggleFavorite,
  compared,
  onToggleCompare,
  onAddToItinerary,
  onOpenDetails,
  itineraryOverrides = {},
  aiPrices = {},
}) {
  const [query, setQuery] = useState("");

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const visible = q
    ? destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          (d.region && d.region.toLowerCase().includes(q)) ||
          (d.continent && d.continent.toLowerCase().includes(q))
      )
    : destinations;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6 animate-fade-in">
      <div className="tn-modal-in relative bg-white dark:bg-slate-900 w-full h-full sm:rounded-3xl sm:max-w-6xl sm:h-[85vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header bar */}
        <div className="shrink-0 flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white shrink-0">
            <Compass className="h-5 w-5 text-emerald-500" />
            <span className="hidden sm:inline">All Destinations</span>
            <span className="text-xs font-semibold text-slate-400">({visible.length})</span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-sm bg-slate-100 dark:bg-slate-800 rounded-full px-3.5 py-2 ml-auto">
            <SearchIcon className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable grid of every destination (or the current search match) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {visible.length > 0 ? (
            <div
              key={query}
              className="tn-stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visible.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  dest={dest}
                  onAddToItinerary={onAddToItinerary}
                  isFavorite={favorites.includes(dest.id)}
                  onToggleFavorite={onToggleFavorite}
                  isCompared={compared.includes(dest.id)}
                  onToggleCompare={onToggleCompare}
                  onOpenDetails={(d) => {
                    onClose();
                    onOpenDetails(d);
                  }}
                  itineraryOverrides={itineraryOverrides}
                  aiPrices={aiPrices}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-3 py-20 px-6 text-slate-400">
              <Compass className="h-8 w-8" />
              <p className="text-sm font-semibold">No destinations match "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
