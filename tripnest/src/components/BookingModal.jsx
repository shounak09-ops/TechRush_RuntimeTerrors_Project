import React, { useState } from "react";
import { X, User, Mail, Phone, CalendarDays, Users, CheckCircle2 } from "lucide-react";

function generateBookingCode() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `TN-${ts}-${rand}`;
}

export default function BookingModal({ dest, onClose, onConfirmBooking }) {
  const [step, setStep] = useState("form"); // "form" | "confirmed"
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelDate: "",
    travelers: 1,
  });
  const [bookingCode, setBookingCode] = useState(null);

  if (!dest) return null;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isValid =
    form.name.trim() && form.email.trim() && form.travelDate && form.travelers > 0;

  const handlePay = () => {
    if (!isValid) return;
    const code = generateBookingCode();
    setBookingCode(code);
    setStep("confirmed");

    onConfirmBooking({
      code,
      destinationId: dest.id,
      destinationName: dest.name,
      country: dest.country,
      name: form.name,
      email: form.email,
      phone: form.phone,
      travelDate: form.travelDate,
      travelers: form.travelers,
      bookedAt: new Date().toISOString(),
    });
  };

  const handleClose = () => {
    setStep("form");
    setForm({ name: "", email: "", phone: "", travelDate: "", travelers: 1 });
    setBookingCode(null);
    onClose();
  };

  const qrPayload = bookingCode
    ? JSON.stringify({
        code: bookingCode,
        destination: dest.name,
        country: dest.country,
        name: form.name,
        date: form.travelDate,
        travelers: form.travelers,
      })
    : "";

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    qrPayload
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="tn-modal-in bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close booking modal"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "form" && (
          <>
            <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
              Book {dest.name}
            </h2>
            <p className="text-sm text-slate-500 mb-5">{dest.country}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="bg-transparent outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="bg-transparent outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="bg-transparent outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={form.travelDate}
                  onChange={handleChange("travelDate")}
                  className="bg-transparent outline-none text-sm w-full text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                <Users className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  min={1}
                  value={form.travelers}
                  onChange={handleChange("travelers")}
                  className="bg-transparent outline-none text-sm w-full text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!isValid}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold disabled:opacity-40 transition-opacity"
            >
              Pay &amp; Confirm
            </button>
          </>
        )}

        {step === "confirmed" && (
          <div className="text-center py-2">
            <CheckCircle2 className="tn-pop-in h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
              Booking Confirmed
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              {dest.name}, {dest.country} — {form.travelDate}
            </p>

            <img
              src={qrUrl}
              alt="Booking QR code"
              className="mx-auto rounded-xl border border-slate-200 dark:border-slate-700"
            />

            <div className="mt-4 font-mono text-lg font-bold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-2">
              {bookingCode}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Show this code and QR at check-in.
            </p>

            <button
              onClick={handleClose}
              className="mt-6 w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}