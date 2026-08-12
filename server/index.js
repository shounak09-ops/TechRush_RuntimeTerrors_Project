// ============================================================================
// server/index.js
// ----------------------------------------------------------------------------
// Small backend that holds the Gemini API key and proxies trip-generation
// requests from the TripNest frontend. This exists ONLY because an API key
// can never live in frontend code (anyone could read it out of the bundle).
//
// The frontend (src/services/aiService.js) POSTs { formData, destinations }
// to /api/generate-trip. `destinations` is a trimmed list of real entries
// from src/data/destinations.js — the model is asked to pick one of THOSE
// ids rather than invent a destination that doesn't exist in the app (so
// images, coordinates, and prices stay consistent with the rest of the UI).
//
// Run with:
//   cd server && npm install && npm run dev
// (with GEMINI_API_KEY set in server/.env — see .env.example — get one free
// at https://aistudio.google.com/apikey)
// ============================================================================

import express from "express";
import cors from "cors";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import "dotenv/config";

const app = express();

// 1. CORS middleware MUST be before routes
app.use(cors({
    origin: 'https://tripnest-rtt5.vercel.app' // Make sure there is no trailing slash
}));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini's structured-output mode (responseSchema + responseMimeType:
// "application/json") is the equivalent of Claude's forced tool-use here —
// it guarantees the model replies with JSON matching this shape instead of
// prose you have to hope is parseable.
const TRIP_PLAN_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    destinationId: {
      type: SchemaType.STRING,
      description: "Must be exactly one of the ids in the provided destinations list.",
    },
    aiExplanation: {
      type: SchemaType.STRING,
      description: "1-2 sentences explaining why this destination fits what the traveler asked for.",
    },
    matchScore: {
      type: SchemaType.NUMBER,
      description:
        "An honest 0-100 score for how well this specific destination fits the traveler's stated " +
        "preferences (mood, budget, weather, companions, and any free-text notes). This should vary " +
        "genuinely with fit — a strong, well-aligned match can score in the 85-98 range, but a looser " +
        "or partial fit (e.g. only some preferences matched, or this destination was the best of a weak " +
        "field) should score meaningfully lower, such as 55-80. Do not default to a high score out of habit.",
    },
    dayWiseItinerary: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.NUMBER },
          slots: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                time: {
                  type: SchemaType.STRING,
                  description:
                    'Exact activity time range such as "09:30 AM - 12:00 PM". Never use Morning, Afternoon, Evening, Night, or Flexible.',
                },
                title: { type: SchemaType.STRING },
                category: { type: SchemaType.STRING },
                cost: {
                  type: SchemaType.NUMBER,
                  description: "Estimated cost for this activity/slot, in US dollars (not local currency).",
                },
              },
              required: ["time", "title", "category", "cost"],
            },
          },
        },
        required: ["day", "slots"],
      },
    },
    travelTips: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    flightEstimate: {
      type: SchemaType.OBJECT,
      description:
        "A realistic estimate of what round-trip flights/transport to this destination would actually " +
        "cost right now — the model should reason like it just checked fares, not return a generic or " +
        "rounded stock figure.",
      properties: {
        costUSD: {
          type: SchemaType.NUMBER,
          description:
            "Estimated one-time round-trip travel cost in US dollars to reach this specific destination, " +
            "for this specific traveler. Must vary realistically with: distance/region from major global " +
            "hubs, whether the destination is domestic or international relative to a traveler assumed to " +
            "be departing from a major hub in their home region, the destination's bestTime/season (higher " +
            "for peak season, lower for off-peak), and the budget tier (Low = budget carrier/economy deals, " +
            "Medium = standard economy, Luxury = premium economy or business). Do NOT reuse a round number " +
            "or the same figure across different destinations/tiers — vary it the way real fares vary.",
        },
        reasoning: {
          type: SchemaType.STRING,
          description:
            "One short sentence explaining the fare estimate (e.g. distance/route, season, class of travel).",
        },
      },
      required: ["costUSD", "reasoning"],
    },
  },
  required: ["destinationId", "aiExplanation", "matchScore", "dayWiseItinerary", "travelTips", "flightEstimate"],
};

// gemini-2.5-flash is on Google AI Studio's free tier as of writing. Google
// renames/retires model ids periodically — if this one 404s for you, check
// https://aistudio.google.com for the current free-tier Flash model name
// and swap it in below.
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: TRIP_PLAN_SCHEMA,
  },
});

app.post("/api/generate-trip", async (req, res) => {
  const { formData, destinations } = req.body || {};

  if (!formData || !Array.isArray(destinations) || destinations.length === 0) {
    return res.status(400).json({ error: "formData and a non-empty destinations list are required" });
  }

  try {
    const prompt =
    `A traveler wants a trip planned with these preferences: ${JSON.stringify(formData)}.\n\n` +
    `Pick the single best-fitting destination from this list (use its exact "id") and build a ` +
    `${formData.days || 5}-day itinerary suited to their mood, companions, and any free-text ` +
    `preferences.\n\n` +

    `MATCH SCORE RULES:\n` +
    `- Give an honest matchScore (0-100) for how well the destination you picked actually fits ` +
    `what the traveler asked for — do not default to a high number out of habit.\n` +
    `- Score genuinely strong, well-aligned fits in the 85-98 range.\n` +
    `- Score partial or "best of a weak field" fits lower, such as 55-80, when only some of their ` +
    `stated preferences (mood, budget, weather, companions, free-text notes) are actually satisfied.\n\n` +

    `IMPORTANT ITINERARY RULES:\n` +
    `- Every activity MUST have an exact start and end time.\n` +
    `- Use 12-hour time format, such as "08:00 AM - 09:30 AM" or "02:30 PM - 05:00 PM".\n` +
    `- NEVER use "Morning", "Afternoon", "Evening", "Night", or "Flexible".\n` +
    `- NEVER leave the time blank.\n` +
    `- Activities must not overlap.\n` +
    `- Include realistic travel time between activities.\n` +
    `- Plan approximately 3-5 meaningful activities/stops on a normal full day.\n` +
    `- Do NOT pack every hour with activities.\n` +
    `- Include realistic lunch, dinner, rest, and free-time periods where appropriate.\n` +
    `- Leave reasonable travel/buffer time between different locations.\n` +
    `- Do not create overlapping activities.\n` +
    `- Give major attractions enough time to actually enjoy them, generally 1.5-3 hours.\n` +
    `- Leave approximately 1-2 hours of flexible/free time on most full days.\n` +
    `- Arrival and departure days should be lighter than normal sightseeing days.\n` +
    `- Consider realistic opening hours and travel time between locations.\n` +
    `- Avoid unnecessary repetition of attractions.\n` +
    `- The day should feel enjoyable and relaxed rather than like a checklist.\n\n` +

    `All costs must be in US dollars per activity, roughly in line with a ` +
    `${formData.budget || "Medium"} budget tier (Low: ~$5-15/activity, Medium: ~$15-30/activity, ` +
    `Luxury: ~$30-70/activity).\n\n` +

    `FLIGHT/TRAVEL COST ESTIMATE RULES:\n` +
    `- Also return a "flightEstimate" with a realistic round-trip flight/travel cost in USD for the ` +
    `destination you picked, as if you had just looked up current fares.\n` +
    `- Base it on real-world factors: how far the destination is from major global travel hubs, ` +
    `whether it's a domestic or long-haul international route, the destination's typical season/bestTime ` +
    `(peak season = pricier fares), and the ${formData.budget || "Medium"} budget tier (Low = budget ` +
    `airline/economy deal fares, Medium = standard economy, Luxury = premium economy/business).\n` +
    `- This number MUST differ meaningfully between destinations and tiers — never fall back to a flat, ` +
    `rounded, or previously-seen figure. Two different destinations at the same tier should still get ` +
    `noticeably different fares if their distance/region differs.\n\n` +

    `Available destinations:\n${JSON.stringify(destinations)}`;
    
    const result = await model.generateContent(prompt);
    const plan = JSON.parse(result.response.text());

    // Guard against the model picking an id that isn't actually in the list
    // it was given.
    const validIds = new Set(destinations.map((d) => d.id));
    if (!validIds.has(plan.destinationId)) {
      plan.destinationId = destinations[0].id;
    }

    // Guard against a missing/out-of-range/non-numeric score — the schema
    // requires it, but structured output isn't a hard type guarantee.
    const score = Math.round(Number(plan.matchScore));
    plan.matchScore = Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 75;

    // Guard against a missing/non-numeric/absurd flight estimate — the schema
    // requires it, but structured output isn't a hard type guarantee, and a
    // hallucinated fare could come back negative or wildly out of range.
    const fareRaw = Number(plan.flightEstimate?.costUSD);
    const fareValid = Number.isFinite(fareRaw) && fareRaw > 0;
    plan.flightEstimate = {
      costUSD: fareValid ? Math.round(Math.min(6000, Math.max(30, fareRaw))) : null,
      reasoning: plan.flightEstimate?.reasoning || "",
    };

    res.json(plan);
  } catch (err) {
    console.error("generate-trip failed:", err);
    res.status(500).json({ error: "AI trip generation failed" });
  }
});

// ----------------------------------------------------------------------------
// /api/flight-estimate
// ----------------------------------------------------------------------------
// Lightweight sibling of /api/generate-trip: no matching decision, no
// itinerary, just a live round-trip flight/travel fare estimate for ONE
// destination the caller already picked (used by DestinationCard so the
// browse-grid/rail cards show an AI-estimated price instead of a hardcoded
// static figure). Kept as its own route/schema rather than reusing the full
// TRIP_PLAN_SCHEMA so these calls stay cheap and fast.
// ----------------------------------------------------------------------------
const FLIGHT_ESTIMATE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    costUSD: {
      type: SchemaType.NUMBER,
      description:
        "Estimated one-time round-trip travel cost in US dollars to reach this specific destination, " +
        "as if fares were just checked. Must vary realistically with: distance/region from major global " +
        "hubs, whether the destination is domestic or international relative to a traveler departing from " +
        "a major hub in their home region, the destination's bestTime/season (higher for peak season, " +
        "lower for off-peak), and the given budget tier (Low = budget carrier/economy deals, Medium = " +
        "standard economy, Luxury = premium economy or business). Do NOT reuse a round number or a figure " +
        "you'd reuse across different destinations/tiers — vary it the way real fares vary.",
    },
    reasoning: {
      type: SchemaType.STRING,
      description: "One short sentence explaining the fare estimate (e.g. distance/route, season, class of travel).",
    },
  },
  required: ["costUSD", "reasoning"],
};

const flightEstimateModel = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: FLIGHT_ESTIMATE_SCHEMA,
  },
});

app.post("/api/flight-estimate", async (req, res) => {
  const { destination, budget } = req.body || {};

  if (!destination || !destination.name) {
    return res.status(400).json({ error: "a destination object with at least a name is required" });
  }

  const tier = ["Low", "Medium", "Luxury"].includes(budget) ? budget : "Medium";

  try {
    const prompt =
      `Estimate a realistic current round-trip flight/travel fare in US dollars for a trip to ` +
      `${destination.name}${destination.country ? `, ${destination.country}` : ""}.\n\n` +
      `Destination details: ${JSON.stringify({
        country: destination.country,
        region: destination.region,
        continent: destination.continent,
        category: destination.category,
        bestTime: destination.bestTime,
      })}.\n\n` +
      `Assume the traveler departs from a major hub in their home region and is booking a ${tier} ` +
      `budget tier (Low = budget carrier/economy deals, Medium = standard economy, Luxury = premium ` +
      `economy/business).\n\n` +
      `Base the number on real-world factors: distance/region from major global travel hubs, whether the ` +
      `route is domestic or long-haul international, and the destination's typical season/bestTime (peak ` +
      `season = pricier fares). This number MUST differ meaningfully between destinations and tiers — never ` +
      `fall back to a flat, rounded, or previously-seen figure.`;

    const result = await flightEstimateModel.generateContent(prompt);
    const plan = JSON.parse(result.response.text());

    const fareRaw = Number(plan.costUSD);
    const fareValid = Number.isFinite(fareRaw) && fareRaw > 0;

    res.json({
      costUSD: fareValid ? Math.round(Math.min(6000, Math.max(30, fareRaw))) : null,
      reasoning: plan.reasoning || "",
    });
  } catch (err) {
    console.error("flight-estimate failed:", err);
    res.status(500).json({ error: "AI flight estimate failed" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Only run the server locally. Vercel will handle the routing in production.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for Vercel using ES Modules
export default app;