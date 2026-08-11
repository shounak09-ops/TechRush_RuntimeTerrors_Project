import React from "react";
import { X, Ticket } from "lucide-react";

export default function BookingsDrawer({ open, onClose, bookings }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="tn-drawer-in-right w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Ticket className="h-5 w-5 text-sky-500" /> My Bookings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close bookings panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {bookings.length === 0 && (
          <p className="text-sm text-slate-400">No bookings yet.</p>
        )}

        <div className="tn-stagger-grid space-y-4">
          {bookings.slice().reverse().map((b) => {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
              JSON.stringify({ code: b.code, destination: b.destinationName, date: b.travelDate })
            )}`;
            return (
              <div
                key={b.code}
                className="flex gap-4 items-center border border-slate-200 dark:border-slate-800 rounded-none p-4"
              >
                <img src={qrUrl} alt="QR" className="rounded-lg w-16 h-16 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {b.destinationName}, {b.country}
                  </p>
                  <p className="text-xs text-slate-500">
                    {b.travelDate} · {b.travelers} traveler(s)
                  </p>
                  <p className="font-mono text-xs mt-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 inline-block px-2 py-0.5 rounded">
                    {b.code}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}