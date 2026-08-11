// ============================================================================
// mockTripGenerator.js
// ----------------------------------------------------------------------------
// A fully local, deterministic "AI trip planner" data engine.
//
// Nothing here calls a network API — it scores the REAL destinations already
// shipped in `data/destinations.js` against the traveler's inputs (budget,
// days, weather preference, destination type, mood, companions, free-text
// preferences) and assembles a believable itinerary, budget breakdown,
// packing list, food guide, tips, etc. from that match.
//
// It is intentionally the ONLY file that knows how a "trip recommendation"
// is produced. `services/aiService.js` is the single seam that would be
// swapped for a real LLM call later — this file itself never needs to change
// for that swap, and neither does any UI component.
// ============================================================================

import { DESTINATIONS } from "../data/destinations";
import { STANDARD_ESSENTIALS } from "../components/PackingCheckList";

// ---------------------------------------------------------------------------
// Static knowledge tables (the "world knowledge" a real model would already
// have baked in). Kept small and readable on purpose.
// ---------------------------------------------------------------------------

// Rough cost-of-travel tier for every destination currently in the app.
// India entries lean cheaper by default; overrides below make it realistic
// per-destination (e.g. a Kerala houseboat trip costs more than Hampi).
const BUDGET_TIER_OVERRIDES = {
  "paris-france": "Medium",
  "tokyo-japan": "Luxury",
  "bali-indonesia": "Medium",
  "rome-italy": "Medium",
  "swiss-alps": "Luxury",
  "dubai-uae": "Luxury",
  "new-york-usa": "Luxury",
  singapore: "Luxury",
  "santorini-greece": "Luxury",
  "cairo-egypt": "Medium",
  "sydney-australia": "Luxury",
  "queenstown-newzealand": "Luxury",
  "moscow-russia": "Medium",
  "masai-mara-kenya": "Luxury",

  "ladakh-india": "Medium",
  "kerala-backwaters": "Luxury",
  "kaziranga-india": "Medium",
  "jim-corbett-india": "Medium",
  "gir-national-park-india": "Medium",
  "kabini-india": "Medium",
  "mahabalipuram-india": "Low",
  "hampta-pass-india": "Low",
  "sikkim-india": "Medium",
  "puri-india": "Low",
  "gujarat-india": "Low",
  "rann-of-kutch-india": "Medium",
  "jaipur-india": "Medium",
  "goa-india": "Medium",
  "varanasi-india": "Low",
  "taj-mahal-agra": "Medium",
  "kashmir-valley": "Medium",
  "andaman-islands": "Luxury",
  "meghalaya-shillong": "Low",
  "hampi-karnataka": "Low",
  "darjeeling-westbengal": "Low",
  "rishikesh-uttarakhand": "Low",
};

const BUDGET_TIERS = ["Low", "Medium", "Luxury"];

// Normalizes the various category strings found in the dataset into a
// smaller canonical set used for matching.
const CATEGORY_ALIASES = {
  Beach: "Beaches",
  Beaches: "Beaches",
  Culture: "Heritage",
  Heritage: "Heritage",
  "Desert & Culture": "Heritage",
  Mountains: "Mountains",
  Wildlife: "Wildlife",
  Adventure: "Adventure",
  Nature: "Nature",
  Metropolis: "Metropolis",
};

const MOOD_CATEGORY_WEIGHTS = {
  Relaxing: ["Beaches", "Nature"],
  Adventurous: ["Mountains", "Adventure", "Wildlife"],
  Romantic: ["Beaches", "Heritage", "Nature"],
  Cultural: ["Heritage", "Metropolis"],
  Spiritual: ["Heritage", "Nature", "Mountains"],
  Party: ["Metropolis", "Beaches"],
};

const COMPANION_CATEGORY_WEIGHTS = {
  Solo: ["Heritage", "Nature", "Adventure"],
  Couple: ["Beaches", "Heritage", "Nature"],
  Family: ["Heritage", "Wildlife", "Nature", "Beaches"],
  Friends: ["Adventure", "Mountains", "Metropolis", "Beaches"],
};

// Per-day baseline USD spend by budget tier (matches the $ formatting
// already used across the app's itinerary/compare UI).
const DAILY_RATE = {
  Low: { accommodation: 25, food: 15, localTransport: 8, activities: 12, misc: 5 },
  Medium: { accommodation: 70, food: 30, localTransport: 15, activities: 25, misc: 10 },
  Luxury: { accommodation: 220, food: 70, localTransport: 35, activities: 60, misc: 25 },
};

// One-time "getting there" cost, domestic vs international.
const TRAVEL_COST = {
  India: { Low: 60, Medium: 110, Luxury: 220 },
  International: { Low: 400, Medium: 650, Luxury: 1400 },
};

const ACTIVITY_POOL = {
  Mountains: [
    "Guided trek to a scenic viewpoint",
    "Cable car / ropeway ride",
    "Riverside camping under the stars",
    "Local mountain-village market walk",
    "Sunrise photography session",
  ],
  Beaches: [
    "Water sports session (jet-ski / parasailing)",
    "Sunset cruise",
    "Island / beach-hopping tour",
    "Seafood shack crawl",
    "Snorkeling or scuba trial dive",
  ],
  Heritage: [
    "Guided fort / palace tour",
    "Old-town heritage walk",
    "Local museum visit",
    "Sound & light show",
    "Traditional craft workshop",
  ],
  Wildlife: [
    "Morning jeep safari",
    "Evening nature walk with a naturalist",
    "Bird-watching session",
    "Night safari (where permitted)",
    "Visit to a local conservation centre",
  ],
  Adventure: [
    "White-water rafting",
    "Paragliding session",
    "Rock climbing / rappelling",
    "Mountain biking trail",
    "Zip-lining",
  ],
  Nature: [
    "Waterfall trek",
    "Backwater / lake boat ride",
    "Botanical garden or nature reserve walk",
    "Guided birding & photography walk",
    "Village homestay experience",
  ],
  Metropolis: [
    "Guided city walking tour",
    "Rooftop dining experience",
    "Shopping district exploration",
    "Skyline observation deck visit",
    "Local nightlife / live music outing",
  ],
};

const FOOD_BY_COUNTRY = {
  India: ["Regional thali / set meal", "Street-food trail (chaat, snacks)", "Masala chai at a local stall", "Signature regional sweet"],
  France: ["Fresh croissants & pastries", "Classic French bistro dinner", "Cheese & wine tasting", "Macarons from a local patisserie"],
  Japan: ["Sushi at a local counter", "Ramen shop crawl", "Izakaya small-plates dinner", "Matcha desserts"],
  Indonesia: ["Nasi goreng & satay", "Beachside seafood BBQ", "Fresh tropical fruit stalls", "Balinese suckling pig (babi guling)"],
  Italy: ["Wood-fired pizza", "Fresh pasta at a family trattoria", "Gelato tasting walk", "Espresso at a corner café"],
  Switzerland: ["Alpine cheese fondue", "Swiss chocolate tasting", "Rösti at a mountain lodge", "Fresh bakery breakfast"],
  "United Arab Emirates": ["Traditional Emirati mezze", "Shawarma & street-food trail", "Arabic coffee & dates", "Fine-dining desert dinner"],
  "United States": ["Classic NY-style pizza slice", "Diner brunch", "Farmers-market food stalls", "Rooftop bar bites"],
  Singapore: ["Hawker centre food trail", "Chilli crab dinner", "Kaya toast breakfast", "Bubble tea & dessert stalls"],
  Greece: ["Fresh Greek salad & feta", "Souvlaki street food", "Seaside seafood taverna", "Baklava for dessert"],
  Egypt: ["Koshari (local staple)", "Nile-side dinner cruise", "Fresh falafel & ful medames", "Egyptian mint tea"],
  Australia: ["Beachside brunch café", "Fresh seafood platter", "Aussie meat pie", "Flat white coffee culture"],
  "New Zealand": ["Hangi-style feast", "Craft-beer & lamb dinner", "Fresh green-lipped mussels", "Pavlova for dessert"],
  Russia: ["Borscht & traditional soups", "Blini with local toppings", "Tea from a samovar", "Pelmeni dumplings"],
  Kenya: ["Nyama choma (grilled meats)", "Ugali with local stew", "Fresh-brewed Kenyan coffee", "Sukuma wiki (sautéed greens)"],
};

const GENERIC_FOODS = ["Popular local street food", "A traditional regional thali or set menu", "A well-loved local dessert", "A signature regional beverage"];

// ---------------------------------------------------------------------------
// Small deterministic helpers
// ---------------------------------------------------------------------------

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function parseTempC(tempString) {
  const match = /(-?\d+)/.exec(tempString || "");
  return match ? parseInt(match[1], 10) : 22;
}

function weatherBucket(tempC) {
  if (tempC < 12) return "Cold";
  if (tempC < 22) return "Pleasant";
  if (tempC < 28) return "Warm";
  return "Tropical";
}

function normalizedCategory(dest) {
  return CATEGORY_ALIASES[dest.category] || dest.category;
}

function budgetTierOf(dest) {
  return BUDGET_TIER_OVERRIDES[dest.id] || "Medium";
}

function textCorpus(dest) {
  return [dest.name, dest.country, dest.region, dest.continent, dest.category, dest.description, ...(dest.highlights || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Scoring: rank every real destination against the traveler's form inputs.
// ---------------------------------------------------------------------------

function scoreDestination(dest, formData) {
  const { budget, days, weatherPreference, destinationType, mood, companions, preferences } = formData;
  let score = 0;
  const reasons = [];

  const cat = normalizedCategory(dest);
  const corpus = textCorpus(dest);

  // Destination type
  if (destinationType && destinationType !== "Any") {
    if (cat === destinationType) {
      score += 4;
      reasons.push(`it's a ${destinationType.toLowerCase()} destination`);
    } else if (corpus.includes(destinationType.toLowerCase())) {
      score += 2;
      reasons.push(`it offers strong ${destinationType.toLowerCase()} experiences`);
    }
  }

  // Budget
  const tier = budgetTierOf(dest);
  if (budget && budget !== "Any") {
    if (tier === budget) {
      score += 3;
      reasons.push(`it fits a ${budget.toLowerCase()} budget`);
    } else if (Math.abs(BUDGET_TIERS.indexOf(tier) - BUDGET_TIERS.indexOf(budget)) === 1) {
      score += 1;
    }
  }

  // Weather
  if (weatherPreference && weatherPreference !== "Any") {
    const bucket = weatherBucket(parseTempC(dest.temp));
    if (bucket === weatherPreference) {
      score += 2;
      reasons.push(`the climate matches your ${weatherPreference.toLowerCase()} weather preference`);
    }
  }

  // Mood
  if (mood && MOOD_CATEGORY_WEIGHTS[mood]?.includes(cat)) {
    score += 2;
    reasons.push(`it suits a ${mood.toLowerCase()} trip mood`);
  }

  // Companions
  if (companions && COMPANION_CATEGORY_WEIGHTS[companions]?.includes(cat)) {
    score += 1;
    reasons.push(`it works well for ${companions.toLowerCase()} travel`);
  }

  // Trip length closeness to the destination's suggested duration
  const dayDelta = Math.abs((dest.suggestedDays || days) - days);
  if (dayDelta <= 1) score += 1;
  else if (dayDelta <= 3) score += 0.5;

  // Free-text preferences: simple keyword overlap
  if (preferences && preferences.trim()) {
    const keywords = preferences
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3);
    let matches = 0;
    for (const kw of keywords) {
      if (corpus.includes(kw)) matches++;
      if (matches >= 3) break;
    }
    if (matches > 0) {
      score += matches;
      reasons.push("it matches details from your extra preferences");
    }
  }

  // Deterministic tiny tiebreaker so results feel varied across different
  // inputs, but never random/flaky for the same inputs.
  const tieBreak = (hashString(dest.id + JSON.stringify(formData)) % 100) / 100;
  score += tieBreak * 0.4;

  return { dest, score, reasons };
}

function rankDestinations(formData) {
  return DESTINATIONS.map((dest) => scoreDestination(dest, formData)).sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Content builders
// ---------------------------------------------------------------------------

function buildExplanation(top, formData) {
  const { dest, reasons } = top;
  const { companions, mood, days } = formData;
  const who = companions ? `a ${companions.toLowerCase()} trip` : "your trip";
  const moodText = mood ? ` with a ${mood.toLowerCase()} vibe` : "";
  const reasonText = reasons.length
    ? `We picked ${dest.name} because ${reasons.slice(0, 3).join(", ")}.`
    : `${dest.name} is a well-rounded match for the details you shared.`;

  return `For ${who}${moodText} over ${days} day${days === 1 ? "" : "s"}, ${dest.name}, ${dest.country} stood out. ${reasonText} ${
    dest.insiderTip || ""
  }`.trim();
}

function buildDayWiseItinerary(dest, formData) {
  const { days } = formData;
  const tier = budgetTierOf(dest);
  const rate = DAILY_RATE[tier];
  const cat = normalizedCategory(dest);
  const pool = ACTIVITY_POOL[cat] || ACTIVITY_POOL.Heritage;
  const highlights = dest.highlights && dest.highlights.length ? dest.highlights : pool;

  const itinerary = [];
  for (let day = 1; day <= days; day++) {
    const slots = [];

    if (day === 1) {
      slots.push({
        time: "Morning",
        title: `Arrival in ${dest.name} & check-in`,
        category: "Transport",
        cost: Math.round(rate.localTransport * 1.5),
      });
    } else {
      slots.push({
        time: "Morning",
        title: highlights[(day - 1) % highlights.length],
        category: "Sightseeing",
        cost: Math.round(rate.activities * 0.8),
      });
    }

    slots.push({
      time: "Afternoon",
      title: pool[(day + 0) % pool.length],
      category: cat === "Beaches" || cat === "Adventure" ? "Adventure" : "Sightseeing",
      cost: Math.round(rate.activities),
    });

    if (day === days && days > 1) {
      slots.push({
        time: "Evening",
        title: `Farewell dinner & departure prep`,
        category: "Food",
        cost: Math.round(rate.food * 1.3),
      });
    } else {
      slots.push({
        time: "Evening",
        title: `Local food trail: ${(FOOD_BY_COUNTRY[dest.country] || GENERIC_FOODS)[day % (FOOD_BY_COUNTRY[dest.country] || GENERIC_FOODS).length]}`,
        category: "Food",
        cost: Math.round(rate.food),
      });
    }

    itinerary.push({ day, slots });
  }
  return itinerary;
}

export function buildActivities(dest) {
  const cat = normalizedCategory(dest);
  const pool = ACTIVITY_POOL[cat] || ACTIVITY_POOL.Heritage;
  return pool.map((name, idx) => ({
    id: `activity_${idx}`,
    name,
    category: cat,
  }));
}

// `travelCostOverride` lets a caller (e.g. aiService.js, after asking the
// LLM to estimate a real current-day fare for this destination/tier) supply
// a live number instead of the static TRAVEL_COST table below. Only a
// finite, positive override is honored — anything else (undefined, NaN,
// 0, a failed AI call) falls back to the static table so the app never
// shows a broken/zero travel cost.
export function buildBudgetBreakdown(dest, formData, travelCostOverride) {
  const { budget, days } = formData;
  const tier = BUDGET_TIERS.includes(budget) ? budget : budgetTierOf(dest);
  const rate = DAILY_RATE[tier];
  const isIndia = dest.country === "India";
  const hasLiveFare = Number.isFinite(travelCostOverride) && travelCostOverride > 0;
  const travelCost = hasLiveFare ? travelCostOverride : (isIndia ? TRAVEL_COST.India : TRAVEL_COST.International)[tier];

  const breakdown = {
    accommodation: rate.accommodation * days,
    food: rate.food * days,
    localTransport: rate.localTransport * days,
    activities: rate.activities * days,
    flightsOrTravel: travelCost,
    miscellaneous: rate.misc * days,
  };

  const total = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  return { tier, breakdown, total };
}

export function buildPackingChecklist(dest, formData) {
  const { weatherPreference, mood, companions } = formData;
  const destinationItems = (dest.recommendedPacking || []).map((label, idx) => ({
    id: `dest_${idx}`,
    label,
    category: "Custom",
    packed: false,
  }));

  const generated = [];
  const tempC = parseTempC(dest.temp);
  const bucket = weatherPreference && weatherPreference !== "Any" ? weatherPreference : weatherBucket(tempC);

  if (bucket === "Cold") generated.push({ label: "Thermal jacket & layers", category: "Clothing" });
  if (bucket === "Tropical" || bucket === "Warm") generated.push({ label: "Sunscreen SPF 50+", category: "Toiletries" });
  if (normalizedCategory(dest) === "Beaches" || bucket === "Tropical") generated.push({ label: "Swimwear & quick-dry towel", category: "Clothing" });
  if (normalizedCategory(dest) === "Mountains" || normalizedCategory(dest) === "Adventure") generated.push({ label: "Trekking shoes", category: "Clothing" });
  if (companions === "Family") generated.push({ label: "Kids' essentials & snacks", category: "Custom" });
  if (companions === "Solo") generated.push({ label: "Portable safety/whistle & emergency contacts card", category: "Custom" });
  if (mood === "Adventurous") generated.push({ label: "Reusable water bottle", category: "Custom" });
  if (mood === "Party") generated.push({ label: "Evening/outing outfit", category: "Clothing" });

  const generatedItems = generated.map((g, idx) => ({
    id: `gen_${idx}`,
    label: g.label,
    category: g.category,
    packed: false,
  }));

  return [...STANDARD_ESSENTIALS.map((i) => ({ ...i })), ...destinationItems, ...generatedItems];
}

export function buildLocalFoods(dest) {
  return FOOD_BY_COUNTRY[dest.country] || GENERIC_FOODS;
}

function buildTravelTips(dest, formData) {
  const { budget, companions, mood } = formData;
  const tips = [];
  if (dest.insiderTip) tips.push(dest.insiderTip);

  if (budget === "Low") tips.push("Book accommodation and transport at least 3 weeks ahead to lock in the best low-budget rates.");
  if (budget === "Luxury") tips.push("Reach out to premium stays directly for early check-in / late check-out and room upgrades.");
  if (companions === "Family") tips.push("Plan lighter afternoons on travel days — build in downtime for kids to rest.");
  if (companions === "Solo") tips.push("Share your daily plan with someone back home and keep offline maps downloaded.");
  if (companions === "Friends") tips.push("Split costs for shared activities upfront using a group expense app.");
  if (mood === "Spiritual") tips.push("Dress modestly for temples/religious sites and check timing restrictions in advance.");
  if (mood === "Adventurous") tips.push("Book adventure activities through licensed local operators only.");

  tips.push(`Best time to visit: ${dest.bestTime || "year-round"}.`);
  return tips;
}

export function buildCrowdIndicator(dest) {
  const hash = hashString(dest.id + dest.bestTime);
  const levels = ["Low", "Moderate", "High"];
  const level = levels[hash % 3];
  const descriptions = {
    Low: "Fairly quiet — a relaxed pace even in peak weeks.",
    Moderate: "Busy during weekends and the listed best season, calmer on weekdays.",
    High: "Popular hotspot — expect crowds during the best season, book ahead.",
  };
  return { level, description: descriptions[level] };
}

/**
 * generateTripForDestination
 * Builds the exact same trip-plan shape as `generateMockTrip`, but for a
 * destination the traveler already picked directly (destination cards,
 * the compare drawer, the detail modal, or an "alternate" suggestion) —
 * no scoring/ranking against form inputs is needed since the destination
 * isn't being chosen for them.
 *
 * This is what keeps the manually-selected "My Itinerary" flow just as
 * detailed (day-wise plan, budget, packing list, food, tips) as the one
 * built inside the AI Trip Companion.
 *
 * @param {object} dest - a destination object from `data/destinations.js`
 * @param {object} [formData] - optional overrides (days, budget, mood, etc.)
 * @returns {object} full trip plan payload, same shape as generateMockTrip's
 */
export function generateTripForDestination(dest, formData = {}) {
  const safeFormData = {
    budget: budgetTierOf(dest),
    days: dest.suggestedDays || 5,
    weatherPreference: "Any",
    destinationType: normalizedCategory(dest),
    mood: "Relaxing",
    companions: "Couple",
    preferences: "",
    ...formData,
    days: Math.min(30, Math.max(1, Number(formData.days) || dest.suggestedDays || 5)),
  };

  const { tier, breakdown, total } = buildBudgetBreakdown(dest, safeFormData);

  return {
    formData: safeFormData,
    destination: dest,
    aiExplanation: `Here's a ${safeFormData.days}-day plan for ${dest.name}, ${dest.country} — built around its top attractions, local flavors, and everything worth packing.`,
    matchScore: 100,
    dayWiseItinerary: buildDayWiseItinerary(dest, safeFormData),
    attractions: dest.highlights || [],
    activities: buildActivities(dest),
    budgetTier: tier,
    budgetBreakdown: breakdown,
    estimatedTravelCost: Math.round(total),
    packingChecklist: buildPackingChecklist(dest, safeFormData),
    localFoods: buildLocalFoods(dest),
    travelTips: buildTravelTips(dest, safeFormData),
    bestSeason: dest.bestTime || "Year-round",
    crowdIndicator: buildCrowdIndicator(dest),
    weather: {
      display: dest.temp,
      description: `Average conditions around ${dest.temp} — pack accordingly.`,
    },
    alternateDestinations: [],
  };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * generateMockTrip
 * Pure, deterministic "AI" trip generation based on real app data.
 * @param {object} formData
 * @param {"Low"|"Medium"|"Luxury"|"Any"} formData.budget
 * @param {number} formData.days
 * @param {"Cold"|"Pleasant"|"Warm"|"Tropical"|"Any"} formData.weatherPreference
 * @param {"Mountains"|"Beaches"|"Heritage"|"Wildlife"|"Adventure"|"Nature"|"Metropolis"|"Any"} formData.destinationType
 * @param {"Relaxing"|"Adventurous"|"Romantic"|"Cultural"|"Spiritual"|"Party"} formData.mood
 * @param {"Solo"|"Couple"|"Family"|"Friends"} formData.companions
 * @param {string} [formData.preferences] free-text extra preferences
 * @returns {object} full trip plan payload
 */
export function generateMockTrip(formData) {
  const safeFormData = {
    budget: "Medium",
    days: 5,
    weatherPreference: "Any",
    destinationType: "Any",
    mood: "Relaxing",
    companions: "Couple",
    preferences: "",
    ...formData,
    days: Math.min(30, Math.max(1, Number(formData.days) || 5)),
  };

  const ranked = rankDestinations(safeFormData);
  const top = ranked[0];
  const alternates = [];
  for (const candidate of ranked.slice(1)) {
    if (alternates.length >= 2) break;
    if (candidate.dest.country !== top.dest.country || alternates.length === 0) {
      alternates.push(candidate.dest);
    }
  }
  if (alternates.length < 2) {
    for (const candidate of ranked.slice(1)) {
      if (alternates.length >= 2) break;
      if (!alternates.includes(candidate.dest) && candidate.dest.id !== top.dest.id) {
        alternates.push(candidate.dest);
      }
    }
  }

  const dest = top.dest;
  const { tier, breakdown, total } = buildBudgetBreakdown(dest, safeFormData);

  return {
    formData: safeFormData,
    destination: dest,
    aiExplanation: buildExplanation(top, safeFormData),
    matchScore: Math.round(Math.min(99, 55 + top.score * 4)),
    dayWiseItinerary: buildDayWiseItinerary(dest, safeFormData),
    attractions: dest.highlights || [],
    activities: buildActivities(dest),
    budgetTier: tier,
    budgetBreakdown: breakdown,
    estimatedTravelCost: Math.round(total),
    packingChecklist: buildPackingChecklist(dest, safeFormData),
    localFoods: buildLocalFoods(dest),
    travelTips: buildTravelTips(dest, safeFormData),
    bestSeason: dest.bestTime || "Year-round",
    crowdIndicator: buildCrowdIndicator(dest),
    weather: {
      display: dest.temp,
      description:
        safeFormData.weatherPreference !== "Any" && weatherBucket(parseTempC(dest.temp)) === safeFormData.weatherPreference
          ? `Matches your ${safeFormData.weatherPreference.toLowerCase()} weather preference.`
          : `Average conditions around ${dest.temp} — pack accordingly.`,
    },
    alternateDestinations: alternates,
  };
}
