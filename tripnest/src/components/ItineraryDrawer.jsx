"use client"

import { useRef, useState } from "react"
import {
  X,
  Sun,
  Moon,
  MapPin,
  Map,
  Luggage,
  Wallet,
  FileDown,
  FileJson,
  Printer,
  Compass,
  Pin,
  Loader2,
} from "lucide-react"
import PackingChecklist from "./PackingCheckList"

export const CATEGORY_STYLES = {
  Sightseeing: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  Food: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Adventure: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  Stay: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  Transport: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  Custom: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  Heritage: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  Beaches: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  Mountains: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Wildlife: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
}

export function currency(n) {
  return `$${Number(n || 10).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

export default function ItineraryDrawer({
  open,
  onClose,
  theme,
  onToggleTheme,
  activeDestination,
  activitiesByDay,
  totalBudget,
  packingItems,
  onTogglePacking,
  onExportJSON,
  onExportPDF,
  loading = false,
}) {
  const [tab, setTab] = useState("itinerary")
  const [selectedDay, setSelectedDay] = useState(1)
  const dayBarRef = useRef(null)

  // Generate fixed days based on active destination
  const fixedDays = activeDestination 
    ? Array.from({ length: activeDestination.suggestedDays }, (_, i) => i + 1)
    : [1]

  const dayActivities = activitiesByDay[selectedDay] || []

  function handleWheel(e) {
    const el = dayBarRef.current
    if (!el) return
    if (e.deltaY === 0) return
    el.scrollLeft += e.deltaY
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`tn-no-print fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l shadow-2xl transition-transform duration-300 ease-out ${
          theme === 'dark'
            ? 'border-slate-800 bg-slate-900'
            : 'border-slate-200 bg-white'
        } ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Itinerary and essentials"
      >
        {/* Header */}
        <header className={`flex items-center gap-3 border-b p-4 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-gradient-to-r from-teal-500/10 to-indigo-500/10 px-3 py-2">
            <span className="text-xl leading-none" aria-hidden="true">
              🎒
            </span>
            <div className="min-w-0">
              <h2 className={`truncate text-sm font-bold ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>Itinerary &amp; Essentials</h2>
              <p className={`truncate text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>Plan every day of your trip</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors hover:bg-slate-100 ${
              theme === 'dark'
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close itinerary panel"
            className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors hover:bg-slate-100 ${
              theme === 'dark'
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Status Badge */}
        {activeDestination && (
          <div className={`mx-4 mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 px-3 py-2 border border-sky-500/20 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            <Pin className="h-4 w-4 text-sky-500" />
            <span className="text-xs font-semibold">
              📌 Fixed {activeDestination.suggestedDays}-Day Plan: {activeDestination.name}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className={`flex gap-1 border-b p-2 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <TabButton
            active={tab === "itinerary"}
            onClick={() => setTab("itinerary")}
            icon={<Map className="h-4 w-4" />}
            full={`🗺️ Itinerary (${fixedDays.length} Days)`}
            short="Itinerary"
            theme={theme}
          />
          <TabButton
            active={tab === "packing"}
            onClick={() => setTab("packing")}
            icon={<Luggage className="h-4 w-4" />}
            full="🧳 Packing Checklist"
            short="Packing"
            theme={theme}
          />
        </div>

        {/* Scrollable body */}
        <div className="tn-scroll flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <Loader2 className={`h-8 w-8 animate-spin ${theme === 'dark' ? 'text-teal-400' : 'text-teal-500'}`} />
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Building your itinerary...
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Mapping out days, activities, and your packing list
              </p>
            </div>
          ) : tab === "itinerary" ? (
            <div className="flex flex-col gap-5">
              {/* Day navigation wheel */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Days
                  </span>
                </div>
                <div
                  ref={dayBarRef}
                  onWheel={handleWheel}
                  className="tn-scroll-x flex snap-x gap-2 overflow-x-auto pb-2"
                >
                  {fixedDays.map((day) => {
                    const count = (activitiesByDay[day] || []).length
                    const active = day === selectedDay
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        aria-pressed={active}
                        className={`flex min-w-[84px] snap-start flex-col items-center rounded-xl border px-3 py-2.5 transition-all ${
                          active
                            ? "border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                            : theme === 'dark'
                              ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-teal-400"
                              : "border-slate-200 bg-white text-slate-600 hover:border-teal-400"
                        }`}
                      >
                        <span className="text-xs font-medium opacity-80">Day</span>
                        <span className="text-lg font-bold leading-tight">{day}</span>
                        <span className={`text-[10px] ${active ? "text-white/80" : "text-slate-400"}`}>
                          {count} {count === 1 ? "item" : "items"}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Activities */}
              <div className="flex flex-col gap-2">
                <h3 className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                }`}>Day {selectedDay} activities</h3>
                {dayActivities.length === 0 ? (
                  <div className={`flex flex-col items-center gap-3 rounded-2xl border border-dashed py-10 text-center ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-300'
                  }`}>
                    <span className={`grid h-14 w-14 place-items-center rounded-full ${
                      theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Compass className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                      }`}>No activities yet</p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                      }`}>Let's Decide the activities.</p>
                    </div>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {dayActivities.map((a) => (
                      <li
                        key={a.id}
                        className={`group flex items-start gap-3 rounded-xl border p-3 shadow-sm transition-colors hover:border-slate-300 ${
                          theme === 'dark'
                            ? 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`truncate text-sm font-semibold ${
                              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                            }`}>{a.title}</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                CATEGORY_STYLES[a.category] || CATEGORY_STYLES.Custom
                              }`}
                            >
                              {a.category}
                            </span>
                          </div>
                          <p className={`mt-0.5 flex items-center gap-1 text-xs ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            <span className="truncate">{a.location}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-sm font-bold ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                          }`}>{currency(a.cost)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Budget summary */}
              <div className="flex items-center justify-between rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400">
                    <Wallet className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>Total estimated cost</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>Across all {fixedDays.length} days</p>
                  </div>
                </div>
                <span className={`text-2xl font-extrabold ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>{currency(totalBudget)}</span>
              </div>
            </div>
          ) : (
            <PackingChecklist
              items={packingItems}
              onToggle={onTogglePacking}
              activeDestination={activeDestination}
              theme={theme}
            />
          )}
        </div>

        {/* Footer action bar */}
        <footer className={`tn-no-print grid grid-cols-2 gap-2 border-t p-3 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => window.print()}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors hover:bg-slate-100 ${
              theme === 'dark'
                ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'border-slate-200 text-slate-700'
            }`}
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Save as PDF
          </button>
          <button
            type="button"
            onClick={onExportJSON}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-2 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            <FileJson className="h-4 w-4" aria-hidden="true" />
            Export JSON
          </button>
        </footer>
      </aside>
    </>
  )
}

export function TabButton({ active, onClick, icon, full, short, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        active
          ? theme === 'dark'
            ? "bg-slate-100 text-slate-900"
            : "bg-slate-900 text-white"
          : theme === 'dark'
            ? "text-slate-400 hover:bg-slate-800"
            : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{full}</span>
      <span className="sm:hidden">{short}</span>
    </button>
  )
}
