"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  X,
  Sun,
  Moon,
  MapPin,
  Map,
  Luggage,
  Wallet,
  FileDown,
  Compass,
  Clock,
  Pin,
  Loader2,
  GripVertical,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react"
import PackingChecklist from "./PackingCheckList"
import ItineraryDayMap from "./ItineraryDayMap"

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

const ACTIVITY_CATEGORIES = Object.keys(CATEGORY_STYLES)

// Activity costs are stored internally in the same USD-based unit used
// throughout the rest of the app (AI-generated trips, mock data, etc.), and
// currency() converts that to rupees for display. To let users enter and
// edit activity costs directly in rupees, these helpers convert between
// the two so a typed-in rupee amount round-trips back to the same rupee
// figure when displayed.
const USD_TO_INR = 83

export function currency(n) {
  const amount = Number.isFinite(Number(n)) ? Number(n) : 0
  const inr = Math.round(amount * USD_TO_INR)
  return `₹${inr.toLocaleString("en-IN")}`
}

function rupeesToStoredCost(rupees) {
  const amount = Number.isFinite(Number(rupees)) ? Number(rupees) : 0
  return amount / USD_TO_INR
}

function storedCostToRupees(cost) {
  const amount = Number.isFinite(Number(cost)) ? Number(cost) : 0
  return Math.round(amount * USD_TO_INR)
}

export default function ItineraryDrawer({
  open,
  onClose,
  theme,
  onToggleTheme,
  activeDestination,
  activitiesByDay,
  dayCount,
  travelCost = 0,
  totalBudget,
  packingItems,
  onTogglePacking,
  onReorderDay,
  onAddDay,
  onRemoveDay,
  onAddActivity,
  onDeleteActivity,
  onEditActivityCost,
  onMoveActivity,
  onResetItinerary,
  loading = false,
}) {
  const [tab, setTab] = useState("itinerary")
  const [selectedDay, setSelectedDay] = useState(1)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState({ title: "", category: "Sightseeing", location: "", cost: "" })
  const [editingCostId, setEditingCostId] = useState(null)
  const dayBarRef = useRef(null)
  const printableRef = useRef(null)

  const effectiveDayCount = dayCount > 0 ? dayCount : (activeDestination ? activeDestination.suggestedDays : 1)

  // Generate the day list from the live, user-editable day count
  const fixedDays = effectiveDayCount > 0
    ? Array.from({ length: effectiveDayCount }, (_, i) => i + 1)
    : [1]

  // Keep the selected day valid if days are removed
  useEffect(() => {
    if (selectedDay > fixedDays.length) setSelectedDay(fixedDays.length)
  }, [fixedDays.length, selectedDay])

  const dayActivities = activitiesByDay[selectedDay] || []

  // Live per-day cost, recalculated on every reorder/add/delete/edit
  const dayBudget = useMemo(
    () => dayActivities.reduce((sum, a) => sum + (a.cost || 0), 0),
    [dayActivities]
  )

  // Total activity cost across every day — deliberately excludes
  // travelCost (flight/getting-there cost) so the budget planner only
  // tracks day-to-day spend, not the one-time cost of getting there.
  const activitiesCost = useMemo(
    () => Object.values(activitiesByDay).flat().reduce((sum, a) => sum + (a.cost || 0), 0),
    [activitiesByDay]
  )

  // Live budget-left / over-budget indicator, recalculated whenever an
  // activity is added, deleted, moved, or edited. Compared against the
  // destination's planned budget (stored in rupees in
  // data/destinations.js). Flight/travel cost is intentionally left out —
  // see activitiesCost above — so spent is activitiesCost only, in the
  // same USD-based units `currency()` converts from.
  const budgetStatus = useMemo(() => {
    if (!activeDestination?.totalBudget) return null
    const planned = Number(String(activeDestination.totalBudget).replace(/[^0-9.]/g, ""))
    if (!Number.isFinite(planned) || planned <= 0) return null
    const spent = Math.round((Number(activitiesCost) || 0) * 83)
    const diff = planned - spent
    return { planned, spent, diff, overBudget: diff < 0 }
  }, [activeDestination, activitiesCost])

  function handleWheel(e) {
    const el = dayBarRef.current
    if (!el) return
    if (e.deltaY === 0) return
    el.scrollLeft += e.deltaY
  }

  function handleDragStart(index) {
    setDragIndex(index)
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    if (index !== dragOverIndex) setDragOverIndex(index)
  }

  function handleDrop(index) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    const reordered = [...dayActivities]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(index, 0, moved)
    onReorderDay?.(selectedDay, reordered)
    setDragIndex(null)
    setDragOverIndex(null)
  }

  function handleDragEnd() {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  function handleReset() {
    const confirmed = window.confirm("Reset your itinerary? This clears every day's activities and unlocks your destination.")
    if (confirmed) onResetItinerary?.()
  }

  function handleRemoveDay(day) {
    if (fixedDays.length <= 1) return
    const hasActivities = (activitiesByDay[day] || []).length > 0
    if (hasActivities && !window.confirm(`Remove Day ${day}? Its activities will be deleted.`)) return
    onRemoveDay?.(day)
  }

  function handleSubmitAddActivity(e) {
    e.preventDefault()
    if (!newActivity.title.trim()) return
    onAddActivity?.(selectedDay, {
      title: newActivity.title.trim(),
      category: newActivity.category,
      location: newActivity.location.trim() || (activeDestination ? `${activeDestination.name}, ${activeDestination.country}` : ""),
      cost: rupeesToStoredCost(newActivity.cost),
    })
    setNewActivity({ title: "", category: "Sightseeing", location: "", cost: "" })
    setShowAddForm(false)
  }

  // Builds a structured, styled itinerary document and hands it to html2pdf
  async function handleSavePDF() {
    if (pdfBusy) return
    setPdfBusy(true)
    try {
      const html2pdf = (await import("html2pdf.js")).default
      const el = printableRef.current
      if (!el) return
      const filenameBase = activeDestination ? activeDestination.name.replace(/\s+/g, "_") : "itinerary"
      await html2pdf()
        .set({
          margin: 10,
          filename: `${filenameBase}_itinerary.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(el)
        .save()
    } finally {
      setPdfBusy(false)
    }
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
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md lg:max-w-4xl flex-col border-l shadow-2xl transition-transform duration-300 ease-out ${
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
          <div className="flex flex-1 items-center gap-3 rounded-none bg-slate-100 dark:bg-slate-800 px-3 py-2">
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
            className={`grid h-9 w-9 place-items-center rounded-none border transition-colors hover:bg-slate-100 ${
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
            className={`grid h-9 w-9 place-items-center rounded-none border transition-colors hover:bg-slate-100 ${
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
          <div className={`mx-4 mt-4 flex items-center gap-2 rounded-none bg-gradient-to-r from-sky-500/10 to-indigo-500/10 px-3 py-2 border border-sky-500/20 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            <Pin className="h-4 w-4 text-sky-500" />
            <span className="text-xs font-semibold">
              📌 {fixedDays.length}-Day Plan: {activeDestination.name}
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
        <div className="flex flex-1 min-h-0">
        <div className={`tn-scroll flex-1 lg:max-w-[380px] lg:shrink-0 overflow-y-auto p-4 ${
          theme === 'dark' ? 'lg:border-r lg:border-slate-800' : 'lg:border-r lg:border-slate-200'
        }`}>
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
                  {dayActivities.length > 0 && (
                    <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Drag a card onto a day to move it there
                    </span>
                  )}
                </div>
                <div
                  ref={dayBarRef}
                  onWheel={handleWheel}
                  className="tn-days-scroll flex snap-x gap-2 overflow-x-auto pb-2"
                >
                  {fixedDays.map((day) => {
                    const count = (activitiesByDay[day] || []).length
                    const active = day === selectedDay
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragIndex === null || day === selectedDay) return
                          const moving = dayActivities[dragIndex]
                          if (moving) onMoveActivity?.(moving.id, selectedDay, day)
                          setDragIndex(null)
                          setDragOverIndex(null)
                        }}
                        aria-pressed={active}
                        className={`relative flex min-w-[84px] snap-start flex-col items-center rounded-none border px-3 py-2.5 transition-all ${
                          active
                            ? "border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                            : theme === 'dark'
                              ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-teal-400"
                              : "border-slate-200 bg-white text-slate-600 hover:border-teal-400"
                        }`}
                      >
                        {fixedDays.length > 1 && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); handleRemoveDay(day) }}
                            aria-label={`Remove Day ${day}`}
                            className={`absolute -top-1.5 -right-1.5 grid h-4 w-4 place-items-center rounded-full border text-[9px] leading-none ${
                              active
                                ? "bg-white text-teal-600 border-white"
                                : theme === 'dark'
                                  ? "bg-slate-700 text-slate-300 border-slate-600"
                                  : "bg-white text-slate-500 border-slate-300"
                            }`}
                          >
                            ×
                          </span>
                        )}
                        <span className="text-xs font-medium opacity-80">Day</span>
                        <span className="text-lg font-bold leading-tight">{day}</span>
                        <span className={`text-[10px] ${active ? "text-white/80" : "text-slate-400"}`}>
                          {count} {count === 1 ? "item" : "items"}
                        </span>
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    onClick={onAddDay}
                    disabled={fixedDays.length >= 30}
                    aria-label="Add day"
                    className={`flex min-w-[56px] snap-start flex-col items-center justify-center gap-1 rounded-none border border-dashed px-3 py-2.5 transition-all disabled:opacity-40 ${
                      theme === 'dark'
                        ? "border-slate-700 text-slate-400 hover:border-teal-400 hover:text-teal-400"
                        : "border-slate-300 text-slate-400 hover:border-teal-400 hover:text-teal-500"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-[10px] font-semibold">Add day</span>
                  </button>
                </div>
              </div>

              {/* Activities */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>Day {selectedDay} activities</h3>
                  <div className="flex items-center gap-2">
                    {dayActivities.length > 0 && (
                      <span className={`text-xs font-bold ${
                        theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                      }`}>{currency(dayBudget)}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowAddForm(v => !v)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${
                        theme === 'dark' ? 'bg-teal-500/15 text-teal-400 hover:bg-teal-500/25' : 'bg-teal-500/10 text-teal-600 hover:bg-teal-500/20'
                      }`}
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>

                {showAddForm && (
                  <form
                    onSubmit={handleSubmitAddActivity}
                    className={`flex flex-col gap-2 rounded-none border p-3 ${
                      theme === 'dark' ? 'border-slate-700 bg-slate-800/60' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <input
                      type="text"
                      placeholder="Activity title"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity(v => ({ ...v, title: e.target.value }))}
                      autoFocus
                      className={`w-full rounded-lg border px-2.5 py-2 text-xs outline-none ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                    <div className="flex gap-2">
                      <select
                        value={newActivity.category}
                        onChange={(e) => setNewActivity(v => ({ ...v, category: e.target.value }))}
                        className={`flex-1 rounded-lg border px-2 py-2 text-xs outline-none ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      >
                        {ACTIVITY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input
                        type="number"
                        min="0"
                        placeholder="Cost (₹)"
                        value={newActivity.cost}
                        onChange={(e) => setNewActivity(v => ({ ...v, cost: e.target.value }))}
                        className={`w-24 rounded-lg border px-2 py-2 text-xs outline-none ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Location (optional)"
                      value={newActivity.location}
                      onChange={(e) => setNewActivity(v => ({ ...v, location: e.target.value }))}
                      className={`w-full rounded-lg border px-2.5 py-2 text-xs outline-none ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-teal-500 px-3 py-2 text-xs font-bold text-white hover:bg-teal-600 transition-colors"
                      >
                        Add activity
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                          theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {dayActivities.length > 1 && (
                  <p className={`-mt-1 text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Drag <GripVertical className="inline h-3 w-3 -mt-0.5" aria-hidden="true" /> to reorder
                  </p>
                )}
                {dayActivities.length === 0 ? (
                  <div className={`flex flex-col items-center gap-3 rounded-none border border-dashed py-10 text-center ${
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
                    {dayActivities.map((a, index) => (
                      <li
                        key={a.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        className={`group flex items-start gap-2 rounded-none border p-3 shadow-sm transition-colors cursor-grab active:cursor-grabbing ${
                          dragOverIndex === index && dragIndex !== null && dragIndex !== index
                            ? 'border-teal-500 ring-1 ring-teal-500'
                            : theme === 'dark'
                              ? 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                        } ${dragIndex === index ? 'opacity-50' : ''}`}
                      >
                        <span className={`mt-0.5 shrink-0 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`} aria-hidden="true">
                          <GripVertical className="h-4 w-4" />
                        </span>
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
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <span className={`inline-flex items-center gap-1 font-semibold ${
                              theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                            }`}>
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              <span>{a.time || 'Flexible timing'}</span>
                            </span>
                            <span className={`inline-flex min-w-0 items-center gap-1 ${
                              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                              <span className="truncate">{a.location}</span>
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            {fixedDays.length > 1 && (
                              <select
                                value=""
                                onChange={(e) => {
                                  const toDay = Number(e.target.value)
                                  if (toDay) onMoveActivity?.(a.id, selectedDay, toDay)
                                }}
                                aria-label={`Move ${a.title} to another day`}
                                className={`rounded-md border px-1.5 py-1 text-[10px] font-semibold outline-none ${
                                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-500'
                                }`}
                              >
                                <option value="" disabled>Move to day...</option>
                                {fixedDays.filter(d => d !== selectedDay).map(d => (
                                  <option key={d} value={d}>Day {d}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onDeleteActivity?.(selectedDay, a.id)}
                            aria-label={`Delete ${a.title}`}
                            className={`rounded-md p-1 transition-colors ${
                              theme === 'dark' ? 'text-slate-500 hover:bg-rose-500/15 hover:text-rose-400' : 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-500'
                            }`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          {editingCostId === a.id ? (
                            <input
                              type="number"
                              min="0"
                              autoFocus
                              defaultValue={storedCostToRupees(a.cost)}
                              onBlur={(e) => {
                                onEditActivityCost?.(selectedDay, a.id, rupeesToStoredCost(e.target.value))
                                setEditingCostId(null)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur()
                                if (e.key === "Escape") setEditingCostId(null)
                              }}
                              className={`w-20 rounded-md border px-1.5 py-1 text-right text-xs font-bold outline-none ${
                                theme === 'dark' ? 'bg-slate-900 border-teal-500 text-slate-100' : 'bg-white border-teal-500 text-slate-900'
                              }`}
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => setEditingCostId(a.id)}
                              title="Click to edit cost"
                              className={`text-sm font-bold underline decoration-dotted underline-offset-2 ${
                                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                              }`}
                            >
                              {currency(a.cost)}
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Budget summary */}
              <div className="flex flex-col gap-2">
                {travelCost > 0 && (
                  <div className={`flex items-center justify-between rounded-none border p-3 ${
                    theme === 'dark' ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-white'
                  }`}>
                    <div>
                      <p className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                      }`}>Travel cost (from India)</p>
                      <p className={`text-[11px] ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        One-time {activeDestination?.country === "India" ? "domestic" : "international"} getting-there cost, kept separate from daily activities
                      </p>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}>{currency(travelCost)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-none border border-teal-500/30 bg-slate-100 dark:bg-slate-800 p-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-none bg-teal-500/20 text-teal-600 dark:text-teal-400">
                      <Wallet className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>Total estimated cost</p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {travelCost > 0 ? `Travel + activities across all ${fixedDays.length} days` : `Across all ${fixedDays.length} days`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-2xl font-extrabold ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>{currency(totalBudget)}</span>
                </div>

                {/* Budget left / over budget — updates live as activities
                    are added or removed from the itinerary */}
                {budgetStatus && (
                  <div className={`flex items-center justify-between rounded-none border p-4 ${
                    budgetStatus.overBudget
                      ? 'border-rose-500/40 bg-rose-500/10'
                      : 'border-emerald-500/40 bg-emerald-500/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`grid h-9 w-9 place-items-center rounded-none ${
                        budgetStatus.overBudget
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        <Wallet className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className={`text-xs font-semibold ${
                          budgetStatus.overBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {budgetStatus.overBudget ? "Over budget" : "Budget left"}
                        </p>
                        <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Planned budget: ₹{budgetStatus.planned.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-extrabold shrink-0 ${
                      budgetStatus.overBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {budgetStatus.overBudget
                        ? `₹${Math.abs(budgetStatus.diff).toLocaleString("en-IN")} over`
                        : `₹${budgetStatus.diff.toLocaleString("en-IN")} left`}
                    </span>
                  </div>
                )}
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

        {/* Map — beside the itinerary content on large screens only, showing
            the currently selected day's activities. Not shown while loading
            or on the packing-list tab, since there's nothing day-specific to
            plot there. */}
        {!loading && tab === "itinerary" && activeDestination && (
          <div className="hidden lg:flex lg:flex-1 lg:flex-col">
            <ItineraryDayMap
              destination={activeDestination}
              activities={dayActivities}
              selectedDay={selectedDay}
              theme={theme}
            />
          </div>
        )}
        </div>

        {/* Footer action bar */}
        <footer className={`tn-no-print flex flex-col gap-2 border-t p-3 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <button
            type="button"
            onClick={handleSavePDF}
            disabled={pdfBusy || !activeDestination}
            className={`inline-flex items-center justify-center gap-1.5 rounded-none border px-2 py-2.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileDown className="h-4 w-4" aria-hidden="true" />}
            {pdfBusy ? "Preparing PDF..." : "Save as PDF"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!activeDestination}
            className="inline-flex items-center justify-center gap-1.5 rounded-none border border-rose-500/30 bg-rose-500/10 px-2 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors hover:bg-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset itinerary
          </button>
        </footer>
      </aside>
{/* Offscreen printable template — rendered every time so it stays in
          sync, captured by html2pdf only when "Save as PDF" is clicked */}
      <div style={{ position: "fixed", top: 0, left: "-9999px", width: "700px" }} aria-hidden="true">
        <div ref={printableRef} style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#ffffff", color: "#1c1917", padding: "36px" }}>
          <div style={{ borderBottom: "3px solid #c85a3c", paddingBottom: "16px", marginBottom: "20px" }}>
            <p style={{ margin: 0, fontSize: "11px", letterSpacing: "2px", color: "#c85a3c", fontWeight: "bold" }}>TRIPNEST ITINERARY</p>
            <h1 style={{ margin: "4px 0 0", fontSize: "26px", color: "#1c1917" }}>
              {activeDestination ? `${activeDestination.name}, ${activeDestination.country}` : "Your trip"}
            </h1>
            {activeDestination && (
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#78716c" }}>
                {fixedDays.length}-day plan · Total estimated cost: {currency(totalBudget)}
              </p>
            )}
          </div>

          {travelCost > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fdf4f0", borderRadius: "8px", padding: "10px 14px", marginBottom: "18px", border: "1px solid #fbe8e0" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#c85a3c", fontWeight: "bold" }}>
                Travel cost (from India, one-time)
              </p>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#1c1917" }}>{currency(travelCost)}</p>
            </div>
          )}

          {fixedDays.map((day) => {
            const items = activitiesByDay[day] || []
            const dayTotal = items.reduce((sum, a) => sum + (a.cost || 0), 0)
            return (
              <div key={day} style={{ marginBottom: "22px", breakInside: "avoid" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", background: "#f3eee5", borderRadius: "8px", padding: "8px 14px", marginBottom: "8px" }}>
                  <h2 style={{ margin: 0, fontSize: "15px", color: "#1c1917" }}>Day {day}</h2>
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "#c85a3c" }}>{currency(dayTotal)}</span>
                </div>
                {items.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#a8a29e", padding: "0 14px" }}>No activities planned for this day.</p>
                ) : (
                  items.map((a, idx) => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "8px 14px", borderBottom: idx === items.length - 1 ? "none" : "1px solid #e7e0d6" }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#1c1917" }}>{a.title} <span style={{ fontWeight: "normal", color: "#c85a3c", fontSize: "10px" }}>· {a.category}</span></p>
                        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#78716c" }}>{a.location}</p>
                      </div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#1c1917", whiteSpace: "nowrap" }}>{currency(a.cost)}</p>
                    </div>
                  ))
                )}
              </div>
            )
          })}

          <div style={{ marginTop: "24px", borderTop: "2px solid #c85a3c", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#78716c" }}>Generated with TripNest — plans subject to change</p>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#1c1917" }}>Total: {currency(totalBudget)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export function TabButton({ active, onClick, icon, full, short, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-none px-3 py-2 text-sm font-semibold transition-colors ${
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
