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

  // Native (non-passive) wheel listener so a plain vertical mouse wheel
  // scrolls this rail sideways too — same reasoning as the original
  // App.jsx implementation. Re-binds if railKey changes (the row gets a
  // fresh DOM node to replay its entrance animation).
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: "auto" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [railKey]);

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
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollRailBy(340)}
            aria-label={`Scroll ${title} right`}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
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