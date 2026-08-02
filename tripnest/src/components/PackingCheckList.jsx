"use client"

import { useMemo, useState } from "react"
import {
  Check,
  Info,
  Luggage,
  Plus,
  RotateCcw,
  Shirt,
  Snowflake,
  Sun,
  Trophy,
  Zap,
} from "lucide-react"

let idCounter = 0
const uid = () => `item-${idCounter++}`

const CATEGORIES = [
  {
    key: "essentials",
    title: "Essentials",
    icon: Luggage,
    accent: "text-emerald-600",
    chip: "bg-emerald-50 text-emerald-600 ring-emerald-200/60",
  },
  {
    key: "clothing",
    title: "Clothing & Apparel",
    icon: Shirt,
    accent: "text-violet-600",
    chip: "bg-violet-50 text-violet-600 ring-violet-200/60",
  },
  {
    key: "tech",
    title: "Tech & Electronics",
    icon: Zap,
    accent: "text-sky-600",
    chip: "bg-sky-50 text-sky-600 ring-sky-200/60",
  },
]

const INITIAL_ITEMS = [
  { id: uid(), label: "Passport", category: "essentials", packed: true },
  { id: uid(), label: "Travel insurance", category: "essentials", packed: true },
  { id: uid(), label: "Wallet & cards", category: "essentials", packed: false },
  { id: uid(), label: "Toiletries kit", category: "essentials", packed: false },
  { id: uid(), label: "T-shirts", category: "clothing", packed: true },
  { id: uid(), label: "Comfortable shoes", category: "clothing", packed: false },
  { id: uid(), label: "Light jacket", category: "clothing", packed: false },
  { id: uid(), label: "Phone charger", category: "tech", packed: true },
  { id: uid(), label: "Power bank", category: "tech", packed: false },
  { id: uid(), label: "Headphones", category: "tech", packed: false },
  { id: uid(), label: "Camera", category: "tech", packed: false },
  { id: uid(), label: "Universal adapter", category: "tech", packed: false },
]

const SUNNY_ITEMS = [
  { label: "Sunscreen SPF 50", category: "essentials" },
  { label: "Sunglasses", category: "essentials" },
  { label: "Swimsuit", category: "clothing" },
  { label: "Flip-flops", category: "clothing" },
  { label: "Beach hat", category: "clothing" },
]

const COLD_ITEMS = [
  { label: "Thermal layers", category: "clothing" },
  { label: "Insulated gloves", category: "clothing" },
  { label: "Wool beanie", category: "clothing" },
  { label: "Hand warmers", category: "essentials" },
  { label: "Lip balm", category: "essentials" },
]

export default function PackingChecklist() {
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [newItem, setNewItem] = useState("")
  const [newCategory, setNewCategory] = useState("essentials")
  const [activePreset, setActivePreset] = useState(null)

  const packedCount = items.filter((i) => i.packed).length
  const total = items.length
  const percent = total === 0 ? 0 : Math.round((packedCount / total) * 100)
  const complete = total > 0 && packedCount === total

  const grouped = useMemo(() => {
    const map = { essentials: [], clothing: [], tech: [] }
    for (const item of items) map[item.category].push(item)
    return map
  }, [items])

  const toggle = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i)))

  const addItem = (label, category) => {
    const trimmed = label.trim()
    if (!trimmed) return
    setItems((prev) => [...prev, { id: uid(), label: trimmed, category, packed: false }])
  }

  const handleAddCustom = (e) => {
    e.preventDefault()
    addItem(newItem, newCategory)
    setNewItem("")
  }

  const applyPreset = (preset) => {
    const source = preset === "sunny" ? SUNNY_ITEMS : COLD_ITEMS
    setItems((prev) => {
      const existing = new Set(prev.map((i) => i.label.toLowerCase()))
      const additions = source
        .filter((s) => !existing.has(s.label.toLowerCase()))
        .map((s) => ({ id: uid(), label: s.label, category: s.category, packed: false }))
      return [...prev, ...additions]
    })
    setActivePreset(preset)
  }

  const reset = () => {
    setItems(INITIAL_ITEMS.map((i) => ({ ...i, packed: false })))
    setActivePreset(null)
  }

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/60 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-balance text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Smart Packing Checklist
            </h2>
            <span className="group relative inline-flex">
              <Info className="h-4 w-4 cursor-help text-slate-400 transition-colors hover:text-slate-600" />
              <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-52 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs leading-relaxed text-slate-100 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                Check off items as you pack. Use weather presets to auto-fill trip essentials.
              </span>
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {packedCount} of {total} Packed
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="font-medium text-slate-700">{percent}% Complete</span>
          </p>
        </div>

        {complete && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-600 ring-1 ring-emerald-200/70">
            <Trophy className="h-4 w-4" />
            All packed!
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            complete
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-sky-400 to-indigo-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Weather presets */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => applyPreset("sunny")}
          className={`group flex items-center gap-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-left ring-1 transition-all hover:shadow-md ${
            activePreset === "sunny" ? "ring-2 ring-amber-400" : "ring-amber-200/60"
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-transform group-hover:scale-110">
            <Sun className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-900">Beach / Sunny Trip</span>
            <span className="block text-xs text-slate-500">Auto-fill warm-weather gear</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => applyPreset("cold")}
          className={`group flex items-center gap-3 rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 p-4 text-left ring-1 transition-all hover:shadow-md ${
            activePreset === "cold" ? "ring-2 ring-cyan-400" : "ring-cyan-200/60"
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 transition-transform group-hover:scale-110">
            <Snowflake className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-900">Cold / Mountain Trip</span>
            <span className="block text-xs text-slate-500">Auto-fill cold-weather gear</span>
          </span>
        </button>
      </div>

      {/* Checklist grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon
          const catItems = grouped[cat.key]
          const catPacked = catItems.filter((i) => i.packed).length
          return (
            <section key={cat.key} className="rounded-xl bg-slate-50/60 p-4 ring-1 ring-slate-200/50">
              <header className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ring-1 ${cat.chip}`}>
                    <CatIcon className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800">{cat.title}</h3>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {catPacked}/{catItems.length}
                </span>
              </header>

              <ul className="flex flex-col gap-1.5">
                {catItems.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white">
                      <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => toggle(item.id)}
                        className="peer sr-only"
                      />
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 transition-all duration-200 ${
                          item.packed
                            ? "scale-100 bg-emerald-500 ring-emerald-500"
                            : "bg-white ring-slate-300 peer-hover:ring-slate-400"
                        }`}
                      >
                        <Check
                          className={`h-3.5 w-3.5 text-white transition-transform duration-200 ${
                            item.packed ? "scale-100" : "scale-0"
                          }`}
                          strokeWidth={3}
                        />
                      </span>
                      <span
                        className={`text-sm transition-all duration-200 ${
                          item.packed
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  </li>
                ))}
                {catItems.length === 0 && (
                  <li className="px-2 py-2 text-xs text-slate-400">No items yet</li>
                )}
              </ul>
            </section>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
        <form onSubmit={handleAddCustom} className="flex flex-1 items-center gap-2">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="h-10 rounded-lg border-0 bg-slate-100 px-3 text-sm font-medium text-slate-600 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-2 focus:ring-sky-400"
            aria-label="Item category"
          >
            <option value="essentials">Essentials</option>
            <option value="clothing">Clothing</option>
            <option value="tech">Tech</option>
          </select>
          <div className="relative flex-1">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add custom item..."
              className="h-10 w-full rounded-lg border-0 bg-slate-100 pl-3 pr-10 text-sm text-slate-700 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-sky-500 text-white transition hover:bg-sky-600 disabled:opacity-40"
              disabled={!newItem.trim()}
              aria-label="Add item"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={reset}
          className="group flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
        >
          <RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
          Reset Checklist
        </button>
      </div>
    </div>
  )
}
