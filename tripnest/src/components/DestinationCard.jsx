import React from "react";
import { Heart, Plus, Check, Thermometer, MapPin, Eye } from "lucide-react";

export default function DestinationCard({
  dest,
  onAddToItinerary,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onOpenDetails
}) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Card Header & Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-sm">
            {dest.category}
          </span>

          <div className="flex items-center gap-2">
            {/* Weather Badge */}
            <span className="flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full text-[11px] font-semibold text-white">
              <Thermometer className="h-3 w-3 text-amber-400" />
              {dest.temp}
            </span>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(dest.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-95 ${
                isFavorite
                  ? "bg-rose-500 text-white"
                  : "bg-black/40 text-white hover:bg-black/60"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Title & Location Over Image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-1.5 text-xs text-sky-300 font-medium mb-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{dest.country} {dest.region ? `• ${dest.region} India` : dest.continent ? `• ${dest.continent}` : ''}</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight leading-snug">
            {dest.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {dest.description}
        </p>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          
          {/* Compare Checkbox */}
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => onToggleCompare(dest.id)}
              className="rounded border-slate-300 text-sky-500 focus:ring-sky-400 h-3.5 w-3.5"
            />
            Compare
          </label>

          <div className="flex items-center gap-2">
            {/* View Details Button */}
            <button
              onClick={() => onOpenDetails(dest)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Eye className="h-3.5 w-3.5" />
              Details
            </button>

            {/* Add to Itinerary Button */}
            <button
              onClick={() => onAddToItinerary(dest)}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
