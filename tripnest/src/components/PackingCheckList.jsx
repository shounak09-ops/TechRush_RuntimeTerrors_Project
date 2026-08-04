"use client"

import { useMemo, useState } from "react"
import { Plus, Trash2, Check, Luggage } from "lucide-react"

const CATEGORY_ORDER = ["Documents", "Electronics", "Toiletries", "Health", "Clothing", "Custom"]

/**
 * Smart packing checklist.
 * State is fully controlled by the parent so it can be persisted and exported.
 *
 * items: Array<{ id, label, category, packed }>
 */
export default function PackingChecklist({ items, onToggle, onAdd, onRemove, theme }) {
  const [label, setLabel] = useState("")
  const [category, setCategory] = useState("Custom")

  const packedCount = items.filter((i) => i.packed).length
  const total = items.length
  const percent = total === 0 ? 0 : Math.round((packedCount / total) * 100)

  const grouped = useMemo(() => {
    const map = {}
    for (const item of items) {
      const key = item.category || "Custom"
      if (!map[key]) map[key] = []
      map[key].push(item)
    }
    return map
  }, [items])

  const orderedCategories = useMemo(() => {
    const present = Object.keys(grouped)
    return present.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a)
      const ib = CATEGORY_ORDER.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    })
  }, [grouped])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = label.trim()
    if (!trimmed) return
    onAdd({ label: trimmed, category })
    setLabel("")
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className={`rounded-2xl border p-4 ${
        theme === 'dark'
          ? 'border-slate-800 bg-slate-800/40'
          : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <Luggage className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
            }`}>Packing Progress</span>
          </div>
          <span className={`text-sm font-bold ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            {packedCount}/{total} Packed
          </span>
        </div>
        <div
          className={`h-2.5 w-full overflow-hidden rounded-full ${
            theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
          }`}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Packing completion"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Add custom item */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Add a custom item…"
          aria-label="Custom packing item"
          className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
            theme === 'dark'
              ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500'
              : 'border-slate-200 bg-white text-slate-800'
          }`}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Item category"
          className={`rounded-xl border px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
            theme === 'dark'
              ? 'border-slate-700 bg-slate-800 text-slate-200'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
          disabled={!label.trim()}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Item
        </button>
      </form>

      {/* Grouped list */}
      <div className="flex flex-col gap-5">
        {orderedCategories.map((cat) => (
          <div key={cat}>
            <h4 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {cat}
            </h4>
            <ul className="flex flex-col gap-2">
              {grouped[cat].map((item) => (
                <li
                  key={item.id}
                  className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors hover:border-slate-300 ${
                    theme === 'dark'
                      ? 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggle(item.id)}
                    aria-pressed={item.packed}
                    aria-label={item.packed ? `Mark ${item.label} as not packed` : `Mark ${item.label} as packed`}
                    className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-md border transition-colors ${
                      item.packed
                        ? "border-teal-600 bg-teal-600 text-white"
                        : theme === 'dark'
                          ? "border-slate-600 bg-transparent text-transparent hover:border-teal-500"
                          : "border-slate-300 bg-transparent text-transparent hover:border-teal-500"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span
                    className={`flex-1 text-sm transition-colors ${
                      item.packed
                        ? theme === 'dark' ? "text-slate-500 line-through" : "text-slate-400 line-through"
                        : theme === 'dark' ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Delete ${item.label}`}
                    className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-rose-500/10 hover:text-rose-500 focus:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {total === 0 && (
          <div className={`rounded-2xl border border-dashed py-10 text-center ${
            theme === 'dark' ? 'border-slate-700' : 'border-slate-300'
          }`}>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>Your packing list is empty. Add your first item above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
