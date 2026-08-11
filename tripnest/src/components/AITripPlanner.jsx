"use client"

import { useEffect, useState } from "react"
import {
  X,
  Bot,
  Sparkles,
  Loader2,
  MapPin,
  Calendar,
  Wallet,
  Utensils,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  Users,
  CloudSun,
  TrendingUp,
  Map,
  Luggage,
  Compass,
  Plus,
} from "lucide-react"
import { generateTrip } from "../services/aiService"
import PackingChecklist from "./PackingCheckList"
import DestinationCard from "./DestinationCard"
import { CATEGORY_STYLES, TabButton, currency } from "./ItineraryDrawer"
import useCountUp from "../utils/useCountUp"

const BUDGET_OPTIONS = ["Low", "Medium", "Luxury"]
const WEATHER_OPTIONS = ["Cold", "Pleasant", "Warm", "Tropical", "Any"]
const TYPE_OPTIONS = ["Mountains", "Beaches", "Heritage", "Wildlife", "Adventure", "Nature", "Metropolis", "Any"]
const MOOD_OPTIONS = ["Relaxing", "Adventurous", "Romantic", "Cultural", "Spiritual", "Party"]
const COMPANION_OPTIONS = ["Solo", "Couple", "Family", "Friends"]

// Rupee scroll bar (range slider) for the Budget section — its filled
// range is bucketed into the same Low/Medium/Luxury tiers as the pills
// above, so dragging the bar keeps the pill selection in sync (and vice
// versa).
const BUDGET_MIN = 1000
const BUDGET_MAX = 15000
const BUDGET_STEP = 500
const BUDGET_RANGES = {
  Low: { max: 5000, default: 3000 },
  Medium: { max: 10000, default: 7500 },
  Luxury: { max: BUDGET_MAX, default: 12500 },
}

const formatRupees = (value) => `₹${Number(value).toLocaleString("en-IN")}`

function tierForBudgetAmount(amount) {
  if (amount <= BUDGET_RANGES.Low.max) return "Low"
  if (amount <= BUDGET_RANGES.Medium.max) return "Medium"
  return "Luxury"
}

const LOADING_MESSAGES = [
  "Analyzing your preferences...",
  "Matching destinations that fit...",
  "Building your day-wise itinerary...",
  "Estimating your travel budget...",
  "Packing your checklist...",
]

const DEFAULT_FORM = {
  budget: "Medium",
  budgetAmount: BUDGET_RANGES.Medium.default,
  days: 5,
  weatherPreference: "Any",
  destinationType: "Any",
  mood: "Relaxing",
  companions: "Couple",
  preferences: "",
}

function PillGroup({ label, options, value, onChange, theme }) {
  return (
    <div>
      <p className={`mb-2 text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              value === opt
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : theme === "dark"
                  ? "bg-slate-800/60 border border-slate-700/60 text-slate-300"
                  : "bg-slate-50 border border-slate-200 text-slate-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// Shared range slider styling for the rupee Budget slider.
function ScrollBarField({ min, max, step = 1, value, onChange, accent, formatValue, minLabel, maxLabel, ariaLabel, theme }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mt-3">
      <div className="flex items-center justify-end mb-1.5">
        <span className="text-sm font-extrabold" style={{ color: accent }}>
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="tn-range w-full"
        style={{ "--tn-range-fill": `${pct}%`, "--tn-range-color": accent }}
        aria-label={ariaLabel}
      />
      <div className={`flex justify-between text-[10px] mt-1 font-medium ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

export default function AITripPlanner({
  open,
  onClose,
  theme,
  onAddToItinerary,
  onBookNow,
  onLockTrip,
  favorites,
  onToggleFavorite,
  compared,
  onToggleCompare,
  onOpenDetails,
}) {
  const [step, setStep] = useState("form") // form | loading | result
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [tripResult, setTripResult] = useState(null)
  const [error, setError] = useState(null)
  const [resultTab, setResultTab] = useState("itinerary")
  const [selectedDay, setSelectedDay] = useState(1)
  const [packingItems, setPackingItems] = useState([])
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0)

  // Reset to a fresh form whenever the planner is closed
  useEffect(() => {
    if (!open) {
      setStep("form")
      setFormData(DEFAULT_FORM)
      setTripResult(null)
      setError(null)
      setResultTab("itinerary")
      setSelectedDay(1)
      setPackingItems([])
    }
  }, [open])

  // Rotate the loading messages while "AI" is "thinking"
  useEffect(() => {
    if (step !== "loading") return
    setLoadingMsgIndex(0)
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 650)
    return () => clearInterval(interval)
  }, [step])

  if (!open) return null

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }))

  // Budget pill <-> rupee scroll bar sync
  const updateBudgetTier = (tier) =>
    setFormData((prev) => ({ ...prev, budget: tier, budgetAmount: BUDGET_RANGES[tier].default }))
  const updateBudgetAmount = (amount) =>
    setFormData((prev) => ({ ...prev, budgetAmount: amount, budget: tierForBudgetAmount(amount) }))


  const handleGenerate = async () => {
    setStep("loading")
    setError(null)
    try {
      const result = await generateTrip(formData)
      setTripResult(result)
      setPackingItems(result.packingChecklist)
      setSelectedDay(1)
      setResultTab("itinerary")
      setStep("result")
    } catch (err) {
      setError(err.message || "Something went wrong generating your trip.")
      setStep("form")
    }
  }

  const handleTogglePacking = (id) => {
    setPackingItems((prev) => prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)))
  }

  // Locks the trip the AI already generated (respecting the traveler's
  // chosen days/budget/mood) straight into "My Itinerary", instead of
  // regenerating it with default assumptions.
  const handleLockTrip = () => {
    if (tripResult) onLockTrip(tripResult)
    onClose()
  }

  const panelClasses = theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
  const mutedText = theme === "dark" ? "text-slate-400" : "text-slate-500"
  const bodyText = theme === "dark" ? "text-slate-100" : "text-slate-900"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`tn-modal-in relative w-full max-w-4xl border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${panelClasses}`}>
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <span className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-500 text-white rounded-xl shadow-md">
            <Bot className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className={`text-sm font-bold truncate ${bodyText}`}>AI Trip Companion</h2>
            <p className={`text-xs truncate ${mutedText}`}>
              {step === "result" && tripResult ? `Recommended for you: ${tripResult.destination.name}` : "Tell us your vibe, we'll plan the trip"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI trip planner"
            className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
              theme === "dark" ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {step === "form" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between gap-3">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retry
                  </button>
                </div>
              )}

              <div>
                <PillGroup label="Budget" options={BUDGET_OPTIONS} value={formData.budget} onChange={updateBudgetTier} theme={theme} />
                <ScrollBarField
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={BUDGET_STEP}
                  value={formData.budgetAmount}
                  onChange={updateBudgetAmount}
                  accent="#10b981"
                  formatValue={(v) => `${formatRupees(v)} / person / day`}
                  minLabel={formatRupees(BUDGET_MIN)}
                  maxLabel={formatRupees(BUDGET_MAX)}
                  ariaLabel="Daily budget in rupees"
                  theme={theme}
                />
              </div>

              <div>
                <p className={`mb-2 text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  Trip Length (days)
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateField("days", Math.max(1, Number(formData.days) - 1))}
                    className={`h-9 w-9 rounded-xl border font-bold transition-colors ${
                      theme === "dark" ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    −
                  </button>
                  <span className={`text-lg font-extrabold w-10 text-center ${bodyText}`}>{formData.days}</span>
                  <button
                    type="button"
                    onClick={() => updateField("days", Math.min(30, Number(formData.days) + 1))}
                    className={`h-9 w-9 rounded-xl border font-bold transition-colors ${
                      theme === "dark" ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              <PillGroup label="Weather Preference" options={WEATHER_OPTIONS} value={formData.weatherPreference} onChange={(v) => updateField("weatherPreference", v)} theme={theme} />
              <PillGroup label="Destination Type" options={TYPE_OPTIONS} value={formData.destinationType} onChange={(v) => updateField("destinationType", v)} theme={theme} />
              <PillGroup label="Travel Mood" options={MOOD_OPTIONS} value={formData.mood} onChange={(v) => updateField("mood", v)} theme={theme} />
              <PillGroup label="Travel Companions" options={COMPANION_OPTIONS} value={formData.companions} onChange={(v) => updateField("companions", v)} theme={theme} />

              <div>
                <p className={`mb-2 text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  Additional Preferences (optional)
                </p>
                <textarea
                  value={formData.preferences}
                  onChange={(e) => updateField("preferences", e.target.value)}
                  placeholder="e.g. quiet cafes, waterfalls, nightlife, wildlife photography..."
                  rows={3}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-sky-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500"
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Generate My Trip
              </button>
            </div>
          )}

          {step === "loading" && (
            <div className="space-y-6 py-6">
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="h-9 w-9 text-emerald-500 animate-spin" />
                <p className={`text-sm font-semibold ${bodyText}`}>{LOADING_MESSAGES[loadingMsgIndex]}</p>
                <p className={`text-xs ${mutedText}`}>Your AI Trip Companion is working on it</p>

                {/* Progress bar tied to the rotating status messages, so the
                    wait reads as forward motion rather than an indefinite spin. */}
                <div className={`w-full max-w-xs h-1.5 rounded-full overflow-hidden mt-1 ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                    style={{ width: `${((loadingMsgIndex + 1) / LOADING_MESSAGES.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Skeleton preview of the result view underneath, so the
                  layout that's about to appear is already hinted at. */}
              <div className="space-y-4 opacity-70">
                <div className="tn-skeleton rounded-3xl aspect-[16/7] w-full" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-500/5 space-y-2">
                      <div className="tn-skeleton h-2.5 w-2/3 rounded-full" />
                      <div className="tn-skeleton h-3 w-full rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="tn-skeleton h-3 w-full rounded-full" />
                  <div className="tn-skeleton h-3 w-5/6 rounded-full" />
                  <div className="tn-skeleton h-3 w-4/6 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {step === "result" && tripResult && (
            <ResultView
              trip={tripResult}
              theme={theme}
              resultTab={resultTab}
              setResultTab={setResultTab}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              packingItems={packingItems}
              onTogglePacking={handleTogglePacking}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              compared={compared}
              onToggleCompare={onToggleCompare}
              onOpenDetails={onOpenDetails}
              onAddToItinerary={onAddToItinerary}
              onBookNow={onBookNow}
            />
          )}
        </div>

        {/* Footer */}
        {step === "result" && (
          <footer className="border-t border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setStep("form")}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                theme === "dark" ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              Plan a Different Trip
            </button>
            <button
              type="button"
              onClick={handleLockTrip}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-sky-600 hover:to-indigo-600 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              Lock {tripResult.destination.name} & Build Itinerary
            </button>
          </footer>
        )}
      </div>
    </div>
  )
}

function ResultView({
  trip,
  theme,
  resultTab,
  setResultTab,
  selectedDay,
  setSelectedDay,
  packingItems,
  onTogglePacking,
  favorites,
  onToggleFavorite,
  compared,
  onToggleCompare,
  onOpenDetails,
  onAddToItinerary,
  onBookNow,
}) {
  const { destination: dest } = trip
  const mutedText = theme === "dark" ? "text-slate-400" : "text-slate-500"
  const bodyText = theme === "dark" ? "text-slate-100" : "text-slate-900"

  const dayData = trip.dayWiseItinerary.find((d) => d.day === selectedDay) || trip.dayWiseItinerary[0]

  const animatedMatchScore = useCountUp(trip.matchScore, { duration: 800 })
  const animatedCost = useCountUp(trip.estimatedTravelCost, { duration: 1000 })

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/7] bg-slate-950">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">{dest.category}</span>
            <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {animatedMatchScore}% match
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold">{dest.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-sky-300 font-medium mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{dest.country}</span>
          </div>
        </div>
      </div>

      {/* AI explanation */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
        <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>{trip.aiExplanation}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<CloudSun className="h-4 w-4 text-amber-500" />} label="Weather" value={trip.weather.display} theme={theme} />
        <StatCard icon={<Calendar className="h-4 w-4 text-sky-500" />} label="Best Season" value={trip.bestSeason} theme={theme} />
        <StatCard icon={<Users className="h-4 w-4 text-indigo-500" />} label="Crowd Level" value={trip.crowdIndicator.level} theme={theme} />
        <StatCard icon={<Wallet className="h-4 w-4 text-emerald-500" />} label="Est. Cost" value={currency(animatedCost)} theme={theme} />
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 border-b p-1 rounded-xl ${theme === "dark" ? "border-slate-800 bg-slate-800/40" : "border-slate-200 bg-slate-50"}`}>
        <TabButton active={resultTab === "itinerary"} onClick={() => setResultTab("itinerary")} icon={<Map className="h-4 w-4" />} full="Itinerary" short="Plan" theme={theme} />
        <TabButton active={resultTab === "budget"} onClick={() => setResultTab("budget")} icon={<Wallet className="h-4 w-4" />} full="Budget" short="Budget" theme={theme} />
        <TabButton active={resultTab === "essentials"} onClick={() => setResultTab("essentials")} icon={<Luggage className="h-4 w-4" />} full="Essentials" short="Pack" theme={theme} />
        <TabButton active={resultTab === "alternates"} onClick={() => setResultTab("alternates")} icon={<Compass className="h-4 w-4" />} full="Alternates" short="More" theme={theme} />
      </div>

      {resultTab === "itinerary" && (
        <div className="space-y-5">
          {/* Day pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {trip.dayWiseItinerary.map(({ day }) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === day
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/25"
                    : theme === "dark"
                      ? "bg-slate-800 text-slate-300 border border-slate-700"
                      : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>

          <ul className="flex flex-col gap-2">
            {dayData.slots.map((slot, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-3 rounded-xl border p-3 ${
                  theme === "dark" ? "border-slate-800 bg-slate-800/50" : "border-slate-200 bg-white"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider w-16 shrink-0 pt-0.5 ${mutedText}`}>{slot.time}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${bodyText}`}>{slot.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_STYLES[slot.category] || CATEGORY_STYLES.Custom}`}>
                      {slot.category}
                    </span>
                  </div>
                </div>
                <span className={`text-sm font-bold shrink-0 ${bodyText}`}>{currency(slot.cost)}</span>
              </li>
            ))}
          </ul>

          {/* Attractions */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${mutedText}`}>Top Attractions</h4>
            <div className="grid gap-2">
              {trip.attractions.map((a, idx) => (
                <div key={idx} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${theme === "dark" ? "border-slate-800 bg-slate-800/40" : "border-slate-100 bg-slate-50"}`}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={`text-xs font-medium leading-relaxed ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested activities */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${mutedText}`}>Suggested Activities</h4>
            <div className="flex flex-wrap gap-2">
              {trip.activities.map((act) => (
                <span key={act.id} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${theme === "dark" ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                  {act.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {resultTab === "budget" && (
        <div className="space-y-3">
          {Object.entries(trip.budgetBreakdown).map(([key, value]) => (
            <div key={key} className={`rounded-xl border p-3 ${theme === "dark" ? "border-slate-800 bg-slate-800/40" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold capitalize ${mutedText}`}>{key.replace(/([A-Z])/g, " $1")}</span>
                <span className={`text-sm font-bold ${bodyText}`}>{currency(value)}</span>
              </div>
              {key === "flightsOrTravel" && (
                <p className={`mt-1.5 flex items-center gap-1 text-[11px] leading-relaxed ${mutedText}`}>
                  <Sparkles className="h-3 w-3 text-sky-500 shrink-0" />
                  {trip.travelCostSource === "ai" && trip.travelCostReasoning
                    ? trip.travelCostReasoning
                    : "AI-estimated fare unavailable — showing a typical baseline fare instead."}
                </p>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-indigo-500/10">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400">
                <Wallet className="h-4 w-4" />
              </span>
              <span className={`text-xs font-semibold ${mutedText}`}>Total estimated cost ({trip.budgetTier} tier)</span>
            </div>
            <span className={`text-2xl font-extrabold ${bodyText}`}>{currency(animatedCost)}</span>
          </div>
        </div>
      )}

      {resultTab === "essentials" && (
        <div className="space-y-6">
          <PackingChecklist items={packingItems} onToggle={onTogglePacking} activeDestination={dest} theme={theme} />

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${mutedText}`}>
              <Utensils className="h-3.5 w-3.5" /> Local Foods to Try
            </h4>
            <div className="flex flex-wrap gap-2">
              {trip.localFoods.map((food, idx) => (
                <span key={idx} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${theme === "dark" ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                  {food}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${mutedText}`}>
              <Lightbulb className="h-3.5 w-3.5" /> Travel Tips
            </h4>
            <div className="space-y-2">
              {trip.travelTips.map((tip, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {resultTab === "alternates" && (
        <div className="space-y-4">
          <p className={`text-xs ${mutedText}`}>Not quite right? Here are two other destinations that matched your preferences well.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trip.alternateDestinations.map((alt) => (
              <DestinationCard
                key={alt.id}
                dest={alt}
                onAddToItinerary={(d) => onAddToItinerary(d, trip.formData)}
                onBookNow={onBookNow}
                isFavorite={favorites.includes(alt.id)}
                onToggleFavorite={onToggleFavorite}
                isCompared={compared.includes(alt.id)}
                onToggleCompare={onToggleCompare}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, theme }) {
  return (
    <div className={`p-3 rounded-2xl flex items-center gap-2.5 ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"}`}>
      {icon}
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase font-bold">{label}</p>
        <p className={`text-xs font-bold truncate ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>{value}</p>
      </div>
    </div>
  )
}
