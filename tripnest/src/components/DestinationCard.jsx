import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Plus, 
  Thermometer, 
  MapPin, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Columns2, 
  Clock, 
  IndianRupee,
  Loader2 
} from "lucide-react";
import { categoryBadgeColor } from "../utils/categoryColors";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

export default function DestinationCard({
  dest,
  onAddToItinerary,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onOpenDetails
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  
  // Weather state
  const [liveTemp, setLiveTemp] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Safely fallback to single image or default placeholder
  const gallery = dest?.images && dest.images.length > 0 
    ? dest.images 
    : [dest?.image || FALLBACK_IMAGE];

  // Fetch Live Weather when coordinates exist
  useEffect(() => {
    if (!dest?.lat || !dest?.lon) {
      setLiveTemp(dest?.temp || null);
      return;
    }

    let isMounted = true;
    setIsLoadingWeather(true);

    // Free live weather endpoint using latitude & longitude
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lon}&current_weather=true`)
      .then((res) => {
        if (!res.ok) throw new Error("Weather fetch failed");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.current_weather?.temperature !== undefined) {
          setLiveTemp(`${Math.round(data.current_weather.temperature)}°C`);
        }
      })
      .catch((err) => {
        console.error(`Error fetching weather for ${dest.name}:`, err);
        if (isMounted) setLiveTemp(dest?.temp || "--"); // Fallback to static temp
      })
      .finally(() => {
        if (isMounted) setIsLoadingWeather(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dest?.lat, dest?.lon, dest?.temp, dest?.name]);

  // Reset image carousel index on destination change
  useEffect(() => {
    setActiveImgIndex(0);
  }, [dest?.id]);

  const safeImgIndex = activeImgIndex < gallery.length ? activeImgIndex : 0;
  const currentImage = gallery[safeImgIndex] || FALLBACK_IMAGE;

  useEffect(() => {
    setImgSrc(currentImage);
  }, [currentImage]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const badgeClass = typeof categoryBadgeColor === "function" 
    ? categoryBadgeColor(dest?.category) 
    : "bg-slate-700 text-white";

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-900/8 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      
      {/* Card Header & Image Carousel */}
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-950">
        <img
          src={imgSrc}
          alt={`${dest?.name || "Destination"} - Photo ${safeImgIndex + 1}`}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Carousel Arrows */}
        {gallery.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handlePrevImage}
              className="p-1 rounded-full bg-white/90 hover:bg-white text-slate-700 backdrop-blur-xs transition-colors shadow-sm cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="p-1 rounded-full bg-white/90 hover:bg-white text-slate-700 backdrop-blur-xs transition-colors shadow-sm cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className={`px-3 py-1 ${badgeClass} backdrop-blur-md rounded-full text-[11px] font-bold shadow-sm`}>
            {dest?.category || "Travel"}
          </span>

          <div className="flex items-center gap-2">
            {/* Dynamic Live Weather Badge */}
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-semibold text-slate-800 shadow-sm min-w-[55px] justify-center">
              <Thermometer className="h-3 w-3 text-amber-500 shrink-0" />
              {isLoadingWeather ? (
                <Loader2 className="h-3 w-3 animate-spin text-slate-500" />
              ) : (
                <span>{liveTemp || dest?.temp}</span>
              )}
            </span>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(dest?.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-95 shadow-sm cursor-pointer ${
                isFavorite
                  ? "bg-rose-500 text-white"
                  : "bg-white/90 text-slate-700 hover:bg-white"
              }`}
              aria-label="Toggle favorite"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current text-white" : ""}`} />
            </button>
          </div>
        </div>

        {/* Carousel Dots */}
        {gallery.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {gallery.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === safeImgIndex ? "w-4 bg-emerald-400" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Title & Location Over Image */}
        <div className="absolute bottom-3 left-4 right-4 text-white z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 text-sm text-white/75 font-medium mb-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {dest?.country}
              {dest?.region ? ` • ${dest.region} India` : dest?.continent ? ` • ${dest.continent}` : ''}
            </span>
          </div>
          <h3 className="font-display text-xl font-semibold tracking-tight leading-snug truncate">
            {dest?.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {dest?.description}
        </p>

        {/* Budget & Duration — plain metadata, no box-in-box container */}
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          {dest?.totalBudget && (
            <div className="flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">₹{dest.totalBudget}</span>
            </div>
          )}
          {dest?.suggestedDays && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{dest.suggestedDays} Days</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onToggleCompare(dest?.id)}
            aria-pressed={isCompared}
            className={`flex items-center gap-1.5 text-[11px] font-bold transition-all active:scale-95 cursor-pointer ${
              isCompared ? "text-emerald-500" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Columns2 className="h-3.5 w-3.5" />
            {isCompared ? "Comparing" : "Compare"}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetails(dest)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              Details
            </button>

            <button
              onClick={() => onAddToItinerary(dest)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
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