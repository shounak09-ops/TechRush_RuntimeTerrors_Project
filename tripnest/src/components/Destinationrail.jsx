import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationCard from "./DestinationCard";

// One titled, horizontally-scrollable row of DestinationCards. Extracted
// from the old inline "Trending Destinations" rail in App.jsx so the same
// slider (scroll arrows, snap scrolling, sideways mouse-wheel support) can
// be reused for Trending / All Indian / All Foreign without duplicating
// the scroll-handling logic three times.
export default function DestinationRail({
  title,
  destinations,
  favorites,
  onToggleFavorite,
  compared,
  onToggleCompare,
  onAddToItinerary,
  onOpenDetails,
  railKey,
}) {
  const railRef = useRef(null);

  const scrollRailBy = (amount) => {
    railRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!destinations || destinations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {title}
        </p>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={() => scrollRailBy(-340)}
            aria-label={`Scroll ${title} left`}
            className="p-2 border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-900 hover:border-emerald-500 dark:hover:border-emerald-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollRailBy(340)}
            aria-label={`Scroll ${title} right`}
            className="p-2 border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-900 hover:border-emerald-500 dark:hover:border-emerald-400 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        key={railKey}
        className="tn-scroll-x tn-stagger-grid flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 sm:-mx-8 px-6 sm:px-8"
      >
        {destinations.map((dest) => (
          <div key={dest.id} className="snap-start shrink-0 w-[80vw] sm:w-[320px]">
            <DestinationCard
              dest={dest}
              onAddToItinerary={onAddToItinerary}
              isFavorite={favorites.includes(dest.id)}
              onToggleFavorite={onToggleFavorite}
              isCompared={compared.includes(dest.id)}
              onToggleCompare={onToggleCompare}
              onOpenDetails={onOpenDetails}
            />
          </div>
        ))}
      </div>
    </div>
  );
}