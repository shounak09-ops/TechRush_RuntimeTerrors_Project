import React from "react";
import { X, ArrowRightLeft } from "lucide-react";

export default function CompareDrawer({ comparedItems, onRemoveCompare, onClearAll }) {
  if (comparedItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl max-w-3xl w-[92%] animate-slide-up">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
          <ArrowRightLeft className="h-4 w-4" />
          <span>Comparing Destinations ({comparedItems.length})</span>
        </div>
        <button onClick={onClearAll} className="text-[11px] text-slate-400 hover:text-white">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {comparedItems.map((item) => (
          <div key={item.id} className="relative bg-slate-800 p-2.5 rounded-xl text-xs space-y-1">
            <button
              onClick={() => onRemoveCompare(item.id)}
              className="absolute top-1 right-1 text-slate-400 hover:text-rose-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="font-bold truncate pr-3">{item.name}</p>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{item.temp}</span>
              <span className="text-emerald-400 font-bold">{item.budget}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}