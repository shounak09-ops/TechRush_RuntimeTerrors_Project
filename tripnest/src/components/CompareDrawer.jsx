import React from "react";
//import{totalBudget, } from "ItineraryDrawer"
import { X, MapPin, DollarSign, Calendar, Sparkles, CheckCircle2, IndianRupee } from "lucide-react";

export default function CompareDrawer({ comparedItems, onRemoveCompare, onClearAll, theme, onChooseDestination, onClose }) {
  if (comparedItems.length === 0) return null;

  const handleChooseDestination = (destination) => {
    onChooseDestination(destination);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md">
      <div className="h-full flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Comparison Studio
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Comparing {comparedItems.length} destinations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-6 flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {comparedItems.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              {/* Image Preview */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onRemoveCompare(item.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 text-white hover:bg-rose-500'
                      : 'bg-white/80 text-slate-600 hover:bg-rose-500 hover:text-white'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 text-white'
                      : 'bg-white/80 text-slate-900'
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {item.name}
                </h3>

                {/* Location Tag */}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className={`h-4 w-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.country}
                  </span>
                </div>

                {/* Price Per Day */}
                <div className="flex items-center gap-2 mb-4">
                  <IndianRupee className={`h-4 w-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Budget: <span className="font-bold text-emerald-500">{item.totalBudget}₹</span>
                  </span>
                </div>

                {/* Fixed Duration */}
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className={`h-4 w-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Fixed Duration: <span className="font-bold text-sky-500">{item.suggestedDays} Days</span>
                  </span>
                </div>

                {/* Temperature */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Temperature: <span className="font-bold">{item.temp}</span>
                  </span>
                </div>

                {/* Description */}
                <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.description}
                </p>

                {/* Key Highlight Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.recommendedPacking && item.recommendedPacking.slice(0, 3).map((packingItem, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        theme === 'dark'
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {packingItem}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleChooseDestination(item)}
                  className="mt-auto w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold rounded-xl hover:from-sky-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Choose & Lock Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}