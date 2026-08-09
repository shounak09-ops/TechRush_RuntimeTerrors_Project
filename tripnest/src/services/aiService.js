// ============================================================================
// aiService.js
// ----------------------------------------------------------------------------
// Single integration seam between the UI and "AI trip generation".
//
// `generateTrip()` now calls a real LLM through the local backend in
// /server (see server/index.js) — it never talks to the model directly,
// since the API key has to stay server-side. The backend picks a
// destination id from the real dataset and writes a personalized
// itinerary/explanation; budget math, packing lists, food, and crowd info
// stay deterministic (reused from mockTripGenerator.js) so numbers shown
// elsewhere in the app stay consistent and correct.
//
// If the backend is unreachable or errors out, this falls back to the local
// mock generator so the app still works offline / during a demo.
// ============================================================================

import { DESTINATIONS } from "../data/destinations";
import {
  generateMockTrip,
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
    matchScore: 92,
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

  try {
    const response = await fetch("/api/generate-trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formData: safeFormData,
        destinations: trimDestinationsForPrompt(),
      }),
    });

    if (!response.ok) throw new Error(`AI server responded ${response.status}`);

    const aiPlan = await response.json();
    return assembleTripFromAiPlan(aiPlan, safeFormData);
  } catch (error) {
    // Backend not running, network hiccup, or the model call itself failed.
    // Fall back to the local mock so the app still demos/works.
    console.warn("generateTrip: AI backend unavailable, falling back to mock generator.", error);
    return generateMockTrip(safeFormData);
  }
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
