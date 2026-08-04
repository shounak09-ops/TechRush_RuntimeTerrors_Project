"use client"

import { useMemo, useState, useEffect } from "react"
import { Check, Luggage, Pin } from "lucide-react"

const CATEGORY_ORDER = ["Documents", "Electronics", "Toiletries", "Health", "Clothing", "Custom"]

// Standard essentials that apply to all trips
const STANDARD_ESSENTIALS = [
  { id: "std_1", label: "Passport & ID", category: "Documents", packed: false },
  { id: "std_2", label: "Travel insurance documents", category: "Documents", packed: false },
  { id: "std_3", label: "Wallet/Cash/Cards", category: "Documents", packed: false },
  { id: "std_4", label: "Phone charger", category: "Electronics", packed: false },
  { id: "std_5", label: "Power bank", category: "Electronics", packed: false },
  { id: "std_6", label: "Universal travel adapter", category: "Electronics", packed: false },
  { id: "std_7", label: "Toothbrush & toothpaste", category: "Toiletries", packed: false },
  { id: "std_8", label: "Shampoo & conditioner", category: "Toiletries", packed: false },
  { id: "std_9", label: "First aid kit", category: "Health", packed: false },
  { id: "std_10", label: "Prescription medications", category: "Health", packed: false },
]

/**
 * Fixed Smart packing checklist.
 * Pre-loads standard essentials + destination-specific items.
 * No manual additions or deletions - strict destination lock.
 */
export default function PackingChecklist({ items, onToggle, activeDestination, theme }) {
  const [localItems, setLocalItems] = useState([])

  // Load saved state from localStorage for this destination
  useEffect(() => {
    if (activeDestination) {
      const storageKey = `tripnest_packing_${activeDestination.id}`
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null")
      
      if (saved) {
        setLocalItems(saved)
      } else {
        // Initialize with standard essentials + destination-specific items
        const destinationItems = activeDestination.recommendedPacking?.map((item, index) => ({
          id: `dest_${index}`,
          label: item,
          category: "Custom",
          packed: false
        })) || []
        
        const initialItems = [...STANDARD_ESSENTIALS, ...destinationItems]
        setLocalItems(initialItems)
      }
    }
  }, [activeDestination])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (activeDestination && localItems.length > 0) {
      const storageKey = `tripnest_packing_${activeDestination.id}`
      localStorage.setItem(storageKey, JSON.stringify(localItems))
    }
  }, [localItems, activeDestination])

  // Use parent items if provided, otherwise use local state
  const displayItems = items && items.length > 0 ? items : localItems

  const packedCount = displayItems.filter((i) => i.packed).length
  const total = displayItems.length
  const percent = total === 0 ? 0 : Math.round((packedCount / total) * 100)

  const grouped = useMemo(() => {
    const map = {}
    for (const item of displayItems) {
      const key = item.category || "Custom"
      if (!map[key]) map[key] = []
      map[key].push(item)
    }
    return map
  }, [displayItems])

  const orderedCategories = useMemo(() => {
    const present = Object.keys(grouped)
    return present.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a)
      const ib = CATEGORY_ORDER.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    })
  }, [grouped])

  const handleToggle = (id) => {
    const updatedItems = displayItems.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    )
    setLocalItems(updatedItems)
    if (onToggle) onToggle(id)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Status Badge */}
      {activeDestination && (
        <div className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 px-3 py-2 border border-sky-500/20 ${
          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
        }`}>
          <Pin className="h-4 w-4 text-sky-500" />
          <span className="text-xs font-semibold">
            📌 Fixed Checklist: {activeDestination.name}
          </span>
        </div>
      )}

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
            {packedCount} / {total} Packed ({percent}%)
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
                    onClick={() => handleToggle(item.id)}
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
            }`}>Select a destination to load your packing checklist.</p>
          </div>
        )}
      </div>
    </div>
  )
}
