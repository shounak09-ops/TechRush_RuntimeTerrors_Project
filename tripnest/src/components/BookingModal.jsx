import React, { useState, useEffect } from "react";
import {
  X,
  Ticket,
  Users,
  CalendarDays,
  User,
  Mail,
  Phone,
  IndianRupee,
  Loader2,
  CheckCircle2,
  MapPin,
} from "lucide-react";

const emptyForm = { fullName: "", email: "", phone: "", travelDate: "", travelers: 1 };

// Parses a totalBudget string like "32,121" into a plain number. Falls
// back to 0 for destinations without pricing data so the UI never shows
// NaN.
function parseBudget(totalBudget) {
  if (!totalBudget) return 0;
  const n = Number(String(totalBudget).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatINR(n) {
  return n.toLocaleString("en-IN");
}

// Purely client-side "Book Now" flow — no backend. Collects trip details,
// shows a computed price (per-traveler budget × traveler count), then
// "confirms" the booking with a locally-generated reference ID and saves
// it to localStorage, the same pattern already used for favorites/
// itinerary state elsewhere in the app.
export default function BookingModal({ dest, open, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("form"); // "form" | "submitting" | "confirmed"
  const [bookingRef, setBookingRef] = useState(null);

  // Reset the flow whenever a new destination is booked or the modal reopens
  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
      setStatus("form");
      setBookingRef(null);
    }
  }, [open, dest?.id]);

  if (!open || !dest) return null;

  const perPerson = parseBudget(dest.totalBudget);
  const total = perPerson * (Number(form.travelers) || 1);

  const updateField = (field) => (e) => {
    const value = field === "travelers" ? Math.max(1, Math.min(20, Number(e.target.value) || 1)) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 7) next.phone = "Valid phone required";
    if (!form.travelDate) next.travelDate = "Pick a date";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    // Simulated processing delay — no real request is made, this is a
    // purely local mock so the UI still feels like a real booking action.
    setTimeout(() => {
      const ref = `TN-${dest.id.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

      const record = {
        ref,
        destinationId: dest.id,
        destinationName: dest.name,
        country: dest.country,
        ...form,
        total,
        bookedAt: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem("tripnest_bookings") || "[]");
        localStorage.setItem("tripnest_bookings", JSON.stringify([...existing, record]));
      } catch (err) {
        console.error("Could not save booking locally:", err);
      }

      setBookingRef(ref);
      setStatus("confirmed");
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="tn-modal-in relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          aria-label="Close booking dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "confirmed" ? (
          <div className="p-8 flex flex-col items-center text-center gap-4 overflow-y-auto">
            <span className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Booking confirmed!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your trip to <span className="font-semibold text-slate-700 dark:text-slate-200">{dest.name}</span> is reserved.
              </p>
            </div>

            <div className="w-full mt-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Booking reference</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{bookingRef}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Travelers</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{form.travelers}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Travel date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{form.travelDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Total (est.)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <IndianRupee className="h-3 w-3" />{formatINR(total)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              This is a demo booking — no payment was taken and no email was sent.
            </p>

            <button
              onClick={onClose}
              className="mt-1 w-full px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-colors active:scale-95"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wide mb-1">
                <Ticket className="h-4 w-4" />
                Book this trip
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{dest.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {dest.country}{dest.region ? ` • ${dest.region} India` : dest.continent ? ` • ${dest.continent}` : ""}
              </div>
            </div>

            {/* Form fields */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                  <User className="h-3.5 w-3.5" /> Full name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                    errors.fullName ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={updateField("email")}
                    placeholder="you@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                      errors.email ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={updateField("phone")}
                    placeholder="98765 43210"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                      errors.phone ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> Travel date
                  </label>
                  <input
                    type="date"
                    value={form.travelDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={updateField("travelDate")}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-sm outline-none text-slate-900 dark:text-white focus:border-emerald-500 ${
                      errors.travelDate ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.travelDate && <p className="text-[11px] text-rose-500 mt-1">{errors.travelDate}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Users className="h-3.5 w-3.5" /> Travelers
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.travelers}
                    onChange={updateField("travelers")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm outline-none text-slate-900 dark:text-white focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Price + submit */}
            <div className="p-6 pt-2 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Estimated total{perPerson ? ` (₹${formatINR(perPerson)} × ${form.travelers})` : ""}
                </span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center">
                  <IndianRupee className="h-3.5 w-3.5" />{formatINR(total)}
                </span>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors active:scale-95"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <Ticket className="h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                Demo booking flow — no payment is processed.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}