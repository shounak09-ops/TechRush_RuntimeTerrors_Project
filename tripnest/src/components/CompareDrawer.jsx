import React from "react";
import { X, ArrowRightLeft } from "lucide-react";

export default function CompareDrawer({ comparedItems, onRemoveCompare, onClearAll, theme }) {
  if (comparedItems.length === 0) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 backdrop-blur-md border rounded-2xl p-4 shadow-2xl max-w-3xl w-[92%] animate-slide-up ${
      theme === 'dark' 
        ? 'bg-slate-900/95 text-white border-slate-800' 
        : 'bg-white text-slate-900 border-slate-200'
    }`}>
      <div className={`flex items-center justify-between mb-3 border-b pb-2 ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-500">
          <ArrowRightLeft className="h-4 w-4" />
          <span>Comparing Destinations ({comparedItems.length})</span>
        </div>
        <button onClick={onClearAll} className={`text-[11px] hover:text-rose-500 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {comparedItems.map((item) => (
          <div key={item.id} className={`relative p-2.5 rounded-xl text-xs space-y-1 ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50 border border-slate-200'
          }`}>
            <button
              onClick={() => onRemoveCompare(item.id)}
              className={`absolute top-1 right-1 hover:text-rose-500 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
              }`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="font-bold truncate pr-3">{item.name}</p>
            <div className={`flex justify-between text-[10px] ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <span>{item.temp}</span>
              <span className="text-emerald-500 font-bold">{item.budget}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}