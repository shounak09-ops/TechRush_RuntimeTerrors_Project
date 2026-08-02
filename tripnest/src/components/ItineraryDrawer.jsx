"use client"

import { useMemo, useState } from "react"
import { X, Clock, MapPin, Trash2, Plus, Download, Sparkles } from "lucide-react"

const CATEGORY_STYLES = {
  Heritage: "bg-amber-50 text-amber-700 ring-amber-200",
  Beach: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Dining: "bg-rose-50 text-rose-700 ring-rose-200",
  Adventure: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Custom: "bg-slate-100 text-slate-600 ring-slate-200",
}

const INITIAL_ACTIVITIES = [
  {
    id: "a1",
    day: 1,
    time: "09:00 AM",
    title: "Old Town Heritage Walk",
    location: "Historic District",
    category: "Heritage",
    price: 120,
  },
  {
    id: "a2",
    day: 1,
    time: "02:30 PM",
    title: "Sunset Cove Retreat",
    location: "Azure Bay",
    category: "Beach",
    price: 85,
  },
  {
    id: "a3",
    day: 2,
    time: "11:00 AM",
    title: "Cliffside Zipline",
    location: "Verde Ridge",
    category: "Adventure",
    price: 160,
  },
]

const DAYS = [1, 2, 3]

function timeToMinutes(time) {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!match) return 0
  let hours = Number.parseInt(match[1], 10) % 12
  const minutes = Number.parseInt(match[2], 10)
  const meridiem = match[3]?.toUpperCase()
  if (meridiem === "PM") hours += 12
  return hours * 60 + minutes
}

export default function ItineraryDrawer() {
  const [open, setOpen] = useState(true)
  const [activeDay, setActiveDay] = useState(1)
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", time: "", cost: "", day: "1" })

  const totalBudget = useMemo(
    () => activities.reduce((sum, a) => sum + a.price, 0),
    [activities],
  )

  const dayActivities = useMemo(
    () =>
      activities
        .filter((a) => a.day === activeDay)
        .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)),
    [activities, activeDay],
  )

  function removeActivity(id) {
    setActivities((prev) => prev.filter((a) => a.id !== id))
  }

  function addActivity(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const day = Number.parseInt(form.day, 10) || 1
    setActivities((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        day,
        time: form.time.trim() || "12:00 PM",
        title: form.title.trim(),
        location: "Custom Stop",
        category: "Custom",
        price: Number.parseFloat(form.cost) || 0,
      },
    ])
    setForm({ title: "", time: "", cost: "", day: String(day) })
    setShowForm(false)
    setActiveDay(day)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/25 transition-transform hover:scale-105 active:scale-95"
      >
        <Sparkles className="h-4 w-4" />
        Open Itinerary
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Trip itinerary"
        aria-modal="true"
        className="absolute right-0 top-0 flex h-full w-full max-w-md translate-x-0 flex-col bg-slate-50 shadow-2xl transition-transform duration-300 ease-out"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 bg-white/80 px-6 py-5 backdrop-blur-sm">
          <div>
            <h2 className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Trip Itinerary
            </h2>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
              {activities.length} Places Saved
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close itinerary"
            className="rounded-full border border-slate-100 bg-white p-2 text-slate-500 shadow-sm transition-all hover:rotate-90 hover:text-slate-900 hover:shadow-md"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Day Tabs */}
        <div className="flex gap-2 px-6 py-4">
          {DAYS.map((day) => {
            const active = day === activeDay
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                    : "bg-white text-slate-500 shadow-sm ring-1 ring-slate-100 hover:text-slate-900"
                }`}
              >
                Day {day}
              </button>
            )
          })}
        </div>

        {/* Activity list */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {dayActivities.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center">
              <p className="text-sm font-medium text-slate-500">
                No activities planned for Day {activeDay} yet.
              </p>
            </div>
          ) : (
            <ol className="relative ml-3 border-l-2 border-dotted border-slate-200">
              {dayActivities.map((a) => (
                <li key={a.id} className="relative mb-4 pl-6">
                  <span className="absolute -left-[7px] top-6 h-3 w-3 rounded-full border-2 border-white bg-gradient-to-r from-teal-500 to-cyan-600 shadow" />
                  <div className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-md transition-all hover:shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        <Clock className="h-3.5 w-3.5" />
                        {a.time}
                      </span>
                      <button
                        onClick={() => removeActivity(a.id)}
                        aria-label={`Remove ${a.title}`}
                        className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="mt-3 text-base font-semibold text-slate-900">
                      {a.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {a.location}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          CATEGORY_STYLES[a.category] ?? CATEGORY_STYLES.Custom
                        }`}
                      >
                        {a.category}
                      </span>
                      <span className="text-base font-bold text-teal-600">
                        ${a.price}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {/* Add activity */}
          <div className="mt-4">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-teal-200 bg-teal-50/50 px-4 py-3 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
              >
                <Plus className="h-4 w-4" />
                Add Custom Activity
              </button>
            ) : (
              <form
                onSubmit={addActivity}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-md"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Title
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="e.g. Rooftop Dinner"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Time
                    </label>
                    <input
                      value={form.time}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, time: e.target.value }))
                      }
                      placeholder="07:00 PM"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Cost ($)
                    </label>
                    <input
                      value={form.cost}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, cost: e.target.value }))
                      }
                      inputMode="numeric"
                      placeholder="120"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Day
                    </label>
                    <select
                      value={form.day}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, day: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-200"
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          Day {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-600/25 transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    Add Activity
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer summary */}
        <footer className="border-t border-slate-100 bg-white/80 px-6 py-5 backdrop-blur-sm">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Estimated Budget
              </p>
              <p className="text-3xl font-bold text-slate-900">${totalBudget}</p>
            </div>
            <button
              onClick={() => setActivities([])}
              className="text-sm font-semibold text-slate-400 transition-colors hover:text-red-500"
            >
              Clear All
            </button>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 transition-transform hover:scale-[1.02] active:scale-95">
            <Download className="h-4 w-4" />
            Export Itinerary
          </button>
        </footer>
      </aside>
    </div>
  )
}
