import React from "react";
import { X, Calendar, DollarSign, MapPin, Compass, CheckCircle2 } from "lucide-react";

export default function DestinationModal({ dest, onClose, onAddToItinerary }) {
  if (!dest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Banner */}
        <div className="relative h-64 sm:h-72">
          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <span className="px-3 py-1 bg-sky-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {dest.category}
            </span>
            <h2 className="text-3xl font-black">{dest.name}</h2>
            <p className="text-sm text-slate-300 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-sky-400" /> {dest.country}
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {dest.description}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Temperature</span>
              <span className="text-base font-bold text-sky-500">{dest.temp}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Budget Level</span>
              <span className="text-base font-bold text-emerald-500">{dest.budget}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Best Season</span>
              <span className="text-base font-bold text-amber-500">Oct - Mar</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-sky-500" /> Key Highlights & Activities
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Guided cultural & heritage walks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Local cuisine & street food tours
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Photography & viewpoint spots
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Eco-friendly local transport
              </li>
            </ul>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onAddToItinerary(dest);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md"
            >
              Add to Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}