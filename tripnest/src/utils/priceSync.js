// ============================================================================
// priceSync.js
// ----------------------------------------------------------------------------
// Decides which price a destination card shows, in priority order:
//
//   1) itineraryOverrides[dest.id] — the LIVE total from an itinerary that
//      was actually built for this destination (AI Trip Companion lock, or
//      the manual "Add to itinerary" flow). Kept in sync from App.jsx as the
//      itinerary is edited, so the card always matches what's in "My
//      Itinerary" for that destination — no more static-vs-generated
//      mismatch.
//   2) aiPrices[dest.id] — a once-a-day LLM-estimated realistic trip cost,
//      in INR, shown for destinations that don't have an itinerary built
//      yet.
//
// There is no static fallback — until one of the above resolves (e.g. right
// after first load, before the daily AI price fetch has completed), the
// card simply shows no price rather than a mismatched/stale baked-in number.
// ============================================================================

/**
 * @param {object} dest - a destination object from data/destinations.js
 * @param {object} opts
 * @param {Record<string, number>} [opts.itineraryOverrides] - dest id -> live itinerary total (USD)
 * @param {Record<string, number>} [opts.aiPrices] - dest id -> AI-estimated total (INR)
 * @returns {{amount: number, currency: "USD"|"INR", source: "itinerary"|"ai"}|null}
 */
export function getDisplayPrice(dest, { itineraryOverrides = {}, aiPrices = {} } = {}) {
  if (!dest) return null;

  const live = itineraryOverrides[dest.id];
  if (typeof live === "number" && live > 0) {
    return { amount: Math.round(live), currency: "USD", source: "itinerary" };
  }

  const ai = aiPrices[dest.id];
  if (typeof ai === "number" && ai > 0) {
    return { amount: Math.round(ai), currency: "INR", source: "ai" };
  }

  return null;
}
