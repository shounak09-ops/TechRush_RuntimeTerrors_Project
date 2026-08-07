import React, { useState, useEffect } from "react";
import { 
  X, MapPin, Thermometer, Calendar, Heart, Plus, Sparkles, 
  CheckCircle2, Clock, Lightbulb, Package, Ticket 
} from "lucide-react";

export default function DestinationModal({
  dest,
  onClose,
  onAddToItinerary,
  onBookNow,
  isFavorite,
  onToggleFavorite
}) {
  // Safe fallback: use dest.images array, or fall back to single dest.image
  const gallery = dest?.images && dest.images.length > 0 ? dest.images : [dest?.image];
  const [selectedImage, setSelectedImage] = useState(gallery[0]);

  // Update selected image whenever a new destination is opened
  useEffect(() => {
    if (dest) {
      const initialGallery = dest.images && dest.images.length > 0 ? dest.images : [dest.image];
      setSelectedImage(initialGallery[0]);
    }
  }, [dest]);

  if (!dest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 backdrop-blur-md transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto">
          
          {/* Main Selected Image */}
          <div className="relative aspect-[16/9] w-full bg-slate-950">
            <img
              src={selectedImage}
              alt={dest.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Over-Image Info */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                {dest.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">{dest.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-sky-300 font-medium mt-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {dest.country}{" "}
                  {dest.region
                    ? `• ${dest.region} India`
                    : dest.continent
                    ? `• ${dest.continent}`
                    : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Strip for Multi-Image Support */}
          {gallery.length > 1 && (
            <div className="p-4 bg-slate-100 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Photo Gallery ({gallery.length})
              </p>
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative rounded-xl overflow-hidden shrink-0 transition-all duration-200 h-16 w-24 border-2 ${
                      selectedImage === imgUrl
                        ? "border-sky-500 scale-105 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${dest.name} preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Details Body */}
          <div className="p-6 space-y-6">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {dest.description}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Temperature</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{dest.temp}</p>
                </div>
              </div>

              {dest.bestTime && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-sky-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Best Time</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{dest.bestTime}</p>
                  </div>
                </div>
              )}

              {dest.suggestedDays && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3 col-span-2 sm:col-span-1">
                  <Clock className="h-5 w-5 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Suggested Trip</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{dest.suggestedDays} Days</p>
                  </div>
                </div>
              )}
            </div>

            {/* Highlights Section */}
            {dest.highlights && dest.highlights.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Highlights
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {dest.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Packing Section */}
            {dest.recommendedPacking && dest.recommendedPacking.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-indigo-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Recommended Packing
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dest.recommendedPacking.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Insider Tip Section */}
            {dest.insiderTip && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                    Insider Tip
                  </h5>
                  <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    {dest.insiderTip}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onToggleFavorite(dest.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-colors ${
                isFavorite
                  ? "bg-rose-500 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Saved" : "Favorite"}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onAddToItinerary(dest);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add to Itinerary
              </button>

              <button
                onClick={() => {
                  onBookNow(dest);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
              >
                <Ticket className="h-4 w-4" />
                Book Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}