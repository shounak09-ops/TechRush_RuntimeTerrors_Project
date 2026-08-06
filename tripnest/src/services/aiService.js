// ============================================================================
// aiService.js
// ----------------------------------------------------------------------------
// Single integration seam between the UI and "AI trip generation".
//
// Today `generateTrip()` calls the local mock generator. To wire up a real
// model later (Gemini / OpenAI / Claude), this is the ONLY file that needs
// to change — replace the body of `generateTrip()` with an API call that
// returns the same shaped object documented in `utils/mockTripGenerator.js`
// (`generateMockTrip`'s return value). No UI component imports the mock
// generator directly, so nothing else needs to be touched.
// ============================================================================

import { generateMockTrip, generateTripForDestination } from "../utils/mockTripGenerator";

/**
 * generateTrip
 * @param {object} formData - traveler inputs collected from the AI Trip Planner form
 * @returns {Promise<object>} resolves with the full trip plan payload
 *
 * Swap-later contract:
 *   async function generateTrip(formData) {
 *     const response = await fetch("https://your-ai-endpoint", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ formData }),
 *     });
 *     if (!response.ok) throw new Error("Failed to generate trip");
 *     return response.json(); // must match the mock generator's output shape
 *   }
 */
export async function generateTrip(formData) {
  // Simulated "thinking" latency so the mock feels like a real AI call during
  // the demo. Safe to remove/shorten once a real API replaces this.
  await new Promise((resolve) => setTimeout(resolve, 1100 + Math.random() * 700));

  try {
    return generateMockTrip(formData);
  } catch (error) {
    console.error("generateTrip failed:", error);
    throw new Error("We couldn't generate a trip plan from those preferences. Please try again.");
  }
}

/**
 * planItineraryForDestination
 * Same integration seam as `generateTrip`, but for a destination the
 * traveler picked manually (a destination card, the compare drawer, or the
 * detail modal) rather than one the AI matched for them. Powers the
 * standalone "My Itinerary" drawer so a manual pick gets the same day-wise
 * plan + packing checklist detail as an AI-planned trip.
 *
 * @param {object} destination - a destination object from `data/destinations.js`
 * @param {object} [formData] - optional overrides (days, budget, mood, etc.)
 * @returns {Promise<object>} resolves with the full trip plan payload
 */
export async function planItineraryForDestination(destination, formData = {}) {
  // Small delay so the drawer's loading state has a moment to show — keeps
  // the feel consistent with the AI planner without the long "thinking" wait.
  await new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 200));

  try {
    return generateTripForDestination(destination, formData);
  } catch (error) {
    console.error("planItineraryForDestination failed:", error);
    throw new Error("We couldn't build an itinerary for that destination. Please try again.");
  }
}
