"use client"

import { useRef, useState } from "react"
import {
  X,
  Sun,
  Moon,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Map,
  Luggage,
  Wallet,
  FileDown,
  FileJson,
  Eraser,
  Compass,
} from "lucide-react"
import PackingChecklist from "./PackingCheckList"

const CATEGORY_STYLES = {
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

function currency(n) {
  return `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

export default function ItineraryDrawer({
  open,
  onClose,
  theme,
  onToggleTheme,
  days,
  selectedDay,
  onSelectDay,
  onAddDay,
  onRemoveDay,
  activitiesByDay,
  onAddActivity,
  onRemoveActivity,
  totalBudget,
  packingItems,
  onTogglePacking,
  onAddPacking,
  onRemovePacking,
  onExportJSON,
  onExportPDF,
  onClearAll,
  itinerary,
  onRemoveFromItinerary,
}) {
  const [tab, setTab] = useState("itinerary")
  const [title, setTitle] = useState("")
  const [cost, setCost] = useState("")
  const dayBarRef = useRef(null)

  const dayActivities = activitiesByDay[selectedDay] || []

  function handleWheel(e) {
    const el = dayBarRef.current
    if (!el) return
    if (e.deltaY === 0) return
    el.scrollLeft += e.deltaY
  }

  function handleAddActivity(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAddActivity(selectedDay, {
      title: trimmed,
      location: "Custom entry",
      category: "Custom",
      cost: Number.parseFloat(cost) || 0,
    })
    setTitle("")
    setCost("")
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

        {/* Tabs */}
        <div className={`flex gap-1 border-b p-2 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <TabButton
            active={tab === "itinerary"}
            onClick={() => setTab("itinerary")}
            icon={<Map className="h-4 w-4" />}
            full="Itinerary & Budget"
            short="Itinerary"
            theme={theme}
          />
          <TabButton
            active={tab === "packing"}
            onClick={() => setTab("packing")}
            icon={<Luggage className="h-4 w-4" />}
            full="Packing Checklist"
            short="Packing"
            theme={theme}
          />
        </div>

        {/* Scrollable body */}
        <div className="tn-scroll flex-1 overflow-y-auto p-4">
          {tab === "itinerary" ? (
            <div className="flex flex-col gap-5">
              {/* Day navigation wheel */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Days
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={onRemoveDay}
                      disabled={days.length <= 1}
                      aria-label="Remove last day"
                      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 ${
                        theme === 'dark'
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                      Remove Day
                    </button>
                    <button
                      type="button"
                      onClick={onAddDay}
                      aria-label="Add a day"
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Day
                    </button>
                  </div>
                </div>
                <div
                  ref={dayBarRef}
                  onWheel={handleWheel}
                  className="tn-scroll-x flex snap-x gap-2 overflow-x-auto pb-2"
                >
                  {days.map((day) => {
                    const count = (activitiesByDay[day] || []).length
                    const active = day === selectedDay
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => onSelectDay(day)}
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

              {/* Saved Destinations */}
              {itinerary && itinerary.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>Saved Destinations</h3>
                  <ul className="flex flex-col gap-2">
                    {itinerary.map((item, index) => (
                      <li
                        key={item.id}
                        className={`group flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-colors ${
                          theme === 'dark'
                            ? 'border-slate-800 bg-slate-800/50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-semibold ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                          }`}>{item.name}</p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}>{item.country}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveFromItinerary(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-rose-500/10 hover:text-rose-500 focus:opacity-100 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
                      }`}>Add one below or from a destination card.</p>
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
                          <button
                            type="button"
                            onClick={() => onRemoveActivity(selectedDay, a.id)}
                            aria-label={`Remove ${a.title}`}
                            className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add custom activity */}
              <form
                onSubmit={handleAddActivity}
                className={`rounded-2xl border p-3 ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-800/40'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Add custom activity
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Activity title"
                    aria-label="Activity title"
                    className={`w-full rounded-xl border px-3 py-2 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                      theme === 'dark'
                        ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500'
                        : 'border-slate-200 bg-white text-slate-800'
                    }`}
                  />
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="Cost"
                        aria-label="Activity cost"
                        className={`w-full rounded-xl border py-2 pl-7 pr-3 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                          theme === 'dark'
                            ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500'
                            : 'border-slate-200 bg-white text-slate-800'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!title.trim()}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Add Activity
                    </button>
                  </div>
                </div>
              </form>

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
                    }`}>Across all {days.length} days</p>
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
              onAdd={onAddPacking}
              onRemove={onRemovePacking}
              theme={theme}
            />
          )}
        </div>

        {/* Footer action bar */}
        <footer className={`tn-no-print grid grid-cols-3 gap-2 border-t p-3 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <button
            type="button"
            onClick={onExportPDF}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors hover:bg-slate-100 ${
              theme === 'dark'
                ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'border-slate-200 text-slate-700'
            }`}
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
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
          <button
            type="button"
            onClick={onClearAll}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors hover:bg-rose-50 ${
              theme === 'dark'
                ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                : 'border-rose-200 text-rose-600'
            }`}
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            Clear All
          </button>
        </footer>
      </aside>
    </>
  )
}

function TabButton({ active, onClick, icon, full, short, theme }) {
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
