// ============================================================================
// aiService.js
// ----------------------------------------------------------------------------
// Single integration seam between the UI and "AI trip generation".
//
// `generateTrip()` calls a real LLM through the local backend in /server
// (see server/index.js) — it never talks to the model directly, since the
// API key has to stay server-side. The backend picks a destination id from
// the real dataset and writes a personalized itinerary/explanation; budget
// math, packing lists, food, and crowd info stay deterministic (reused from
// mockTripGenerator.js) so numbers shown elsewhere in the app stay
// consistent and correct.
//
// If the backend is unreachable, misconfigured, or the model call itself
// fails, generateTrip THROWS — it no longer falls back to the mock
// generator. A silent fallback made it impossible to tell, from the UI,
// whether the LLM was actually running (see AITripPlanner.jsx, which
// catches this and shows the error to the user). generateTripForDestination
// (manual destination pick, no AI matching decision involved) still uses
// the local generator directly — that path was never AI-backed.
// ============================================================================

// In dev, this stays "" so requests hit the relative "/api/..." path that
// vite.config.js's server.proxy forwards to the local backend. In
// production there is no such proxy — a static build has no server logic
// at all — so VITE_API_BASE_URL must point at wherever the real backend
// (see /server) is actually deployed, e.g. "https://your-backend.onrender.com".
// Set it in a `.env.production` file or your host's environment variables.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

import { DESTINATIONS } from "../data/destinations";
import {
  generateTripForDestination,
  buildBudgetBreakdown,
  buildPackingChecklist,
  buildActivities,
  buildLocalFoods,
  buildCrowdIndicator,
} from "../utils/mockTripGenerator";

// Only the fields the model needs to choose sensibly and write real
// itinerary content — no need to ship the whole dataset (images, lat/lon,
// etc.) over the wire.
function trimDestinationsForPrompt() {
  return DESTINATIONS.map(({ id, name, country, category, continent, region, highlights, temp, bestTime }) => ({
    id,
    name,
    country,
    category,
    continent,
    region,
    highlights,
    temp,
    bestTime,
  }));
}

// Assembles the same shaped payload the UI already expects (see
// generateMockTrip's return value) from an AI-written plan + a real
// destination object.
function assembleTripFromAiPlan(aiPlan, formData) {
  const dest = DESTINATIONS.find((d) => d.id === aiPlan.destinationId) || DESTINATIONS[0];
  const { tier, breakdown, total } = buildBudgetBreakdown(dest, formData);

  return {
    formData,
    destination: dest,
    aiExplanation: aiPlan.aiExplanation,
    matchScore: aiPlan.matchScore,
    dayWiseItinerary: aiPlan.dayWiseItinerary,
    attractions: dest.highlights || [],
    activities: buildActivities(dest),
    budgetTier: tier,
    budgetBreakdown: breakdown,
    estimatedTravelCost: Math.round(total),
    packingChecklist: buildPackingChecklist(dest, formData),
    localFoods: buildLocalFoods(dest),
    travelTips: aiPlan.travelTips && aiPlan.travelTips.length ? aiPlan.travelTips : [],
    bestSeason: dest.bestTime || "Year-round",
    crowdIndicator: buildCrowdIndicator(dest),
    weather: {
      display: dest.temp,
      description: `Average conditions around ${dest.temp} — pack accordingly.`,
    },
    alternateDestinations: [],
  };
}

/**
 * generateTrip
 * @param {object} formData - traveler inputs collected from the AI Trip Planner form
 * @returns {Promise<object>} resolves with the full trip plan payload
 */
export async function generateTrip(formData) {
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

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/generate-trip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formData: safeFormData,
        destinations: trimDestinationsForPrompt(),
      }),
    });
  } catch (networkError) {
    // fetch() itself threw — the /api/generate-trip route isn't reachable at
    // all (backend not running, wrong URL in prod, DNS/CORS failure, etc).
    console.error("generateTrip: could not reach the AI backend.", networkError);
    throw new Error("Couldn't reach the AI trip service. Check that the backend is running and reachable.");
  }

  if (!response.ok) {
    // Backend responded but the request failed — most often the Gemini call
    // itself errored server-side (bad/missing API key, invalid model id,
    // quota). See server/index.js's console.error for the underlying cause.
    console.error(`generateTrip: AI server responded ${response.status}`);
    throw new Error(`AI trip generation failed (server responded ${response.status}). Check the backend logs.`);
  }

  const aiPlan = await response.json();
  return assembleTripFromAiPlan(aiPlan, safeFormData);
}

/**
 * planItineraryForDestination
 * Same integration seam as `generateTrip`, but for a destination the
 * traveler picked manually (a destination card, the compare drawer, or the
 * detail modal) rather than one the AI matched for them. Kept on the local
 * generator — the destination is already fixed, so there's no matching
 * decision for a model to make here, just a day-plan to fill in the same
 * way `generateTrip`'s fallback does.
 *
 * @param {object} destination - a destination object from `data/destinations.js`
 * @param {object} [formData] - optional overrides (days, budget, mood, etc.)
 * @returns {Promise<object>} resolves with the full trip plan payload
 */
export async function planItineraryForDestination(destination, formData = {}) {
  await new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 200));

  try {
    return generateTripForDestination(destination, formData);
  } catch (error) {
    console.error("planItineraryForDestination failed:", error);
    throw new Error("We couldn't build an itinerary for that destination. Please try again.");
  }
}

// ----------------------------------------------------------------------------
// Once-a-day LLM refreshes (trending destinations + realistic card pricing)
// ----------------------------------------------------------------------------
// Both features only need to update once every 24h, not on every render/page
// load, so results are cached in localStorage next to a fetch timestamp.
// Callers (App.jsx) get back either the cached value (same day) or a fresh
// one (from the backend, which itself calls Gemini) — and on any failure the
// promise rejects so the caller can fall back to its existing static logic
// instead of the UI breaking.
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function readDailyCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.fetchedAt !== "number") return null;
    if (Date.now() - parsed.fetchedAt > ONE_DAY_MS) return null; // stale, refetch
    return parsed.data;
  } catch {
    return null;
  }
}

function writeDailyCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ fetchedAt: Date.now(), data }));
  } catch {
    // Storage full/unavailable — non-fatal, just means it'll refetch next load.
  }
}

/**
 * getTrendingDestinationIds
 * Once-a-day LLM pick of which destinations to feature as "Trending" on the
 * home page, weighted toward the traveler's recent on-site searches.
 * @param {string[]} recentSearches - most-recent-last list of search terms
 * @returns {Promise<string[]>} destination ids (may be empty)
 */
export async function getTrendingDestinationIds(recentSearches = []) {
  const cacheKey = "tripnest_trending_cache";
  const cached = readDailyCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/api/trending-destinations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recentSearches, destinations: trimDestinationsForPrompt() }),
  });

  if (!response.ok) {
    throw new Error(`Trending destinations request failed (server responded ${response.status})`);
  }

  const { destinationIds } = await response.json();
  const ids = Array.isArray(destinationIds) ? destinationIds : [];
  writeDailyCache(cacheKey, ids);
  return ids;
}

/**
 * getDailyDestinationPrices
 * Once-a-day LLM-estimated realistic total trip cost (INR) per destination,
 * used on destination cards until an actual itinerary has been built for
 * that destination (see utils/priceSync.js for the priority order).
 * @returns {Promise<Record<string, number>>} map of destination id -> INR total
 */
export async function getDailyDestinationPrices() {
  const cacheKey = "tripnest_price_cache";
  const cached = readDailyCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/api/destination-prices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      destinations: DESTINATIONS.map(({ id, name, country, category, suggestedDays }) => ({
        id,
        name,
        country,
        category,
        days: suggestedDays || 5,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Destination pricing request failed (server responded ${response.status})`);
  }

  const { prices } = await response.json();
  const safePrices = prices && typeof prices === "object" ? prices : {};
  writeDailyCache(cacheKey, safePrices);
  return safePrices;
}
