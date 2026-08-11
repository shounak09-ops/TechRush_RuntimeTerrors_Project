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
app.use(cors());
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
  },
  required: ["destinationId", "aiExplanation", "matchScore", "dayWiseItinerary", "travelTips"],
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

    res.json(plan);
  } catch (err) {
    console.error("generate-trip failed:", err);
    res.status(500).json({ error: "AI trip generation failed" });
  }
});

// ----------------------------------------------------------------------------
// Trending destinations — picks a small set of destination ids to feature on
// the home page. Leans on the traveler's recent on-site searches when there
// are any, otherwise falls back to general real-world travel trends. The
// frontend (src/services/aiService.js) only calls this once every 24h and
// caches the result in localStorage, so this endpoint is hit at most once a
// day per visitor, not on every page load.
// ----------------------------------------------------------------------------
const TRENDING_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    destinationIds: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description:
        "5-8 destination ids, taken EXACTLY from the provided list's \"id\" field, ordered most-trending first.",
    },
  },
  required: ["destinationIds"],
};

const trendingModel = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: TRENDING_SCHEMA,
  },
});

app.post("/api/trending-destinations", async (req, res) => {
  const { recentSearches, destinations } = req.body || {};

  if (!Array.isArray(destinations) || destinations.length === 0) {
    return res.status(400).json({ error: "A non-empty destinations list is required" });
  }

  try {
    const searches = Array.isArray(recentSearches) ? recentSearches.filter(Boolean).slice(-20) : [];

    const prompt =
      `You are choosing "Trending Destinations" to feature on a travel app's home page.\n\n` +
      (searches.length
        ? `This visitor's recent searches on the app were, most recent last: ${JSON.stringify(searches)}. ` +
          `Weight your picks toward destinations that match the theme/vibe/region of those searches, ` +
          `blended with real-world current travel trends and seasonality.\n\n`
        : `This visitor has no search history yet, so just pick destinations that are genuinely trending ` +
          `worldwide right now, accounting for the current season and typical travel demand.\n\n`) +
      `Pick 5-8 destination ids from this exact list (use the "id" field verbatim, never invent a new one):\n` +
      `${JSON.stringify(destinations)}`;

    const result = await trendingModel.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    const validIds = new Set(destinations.map((d) => d.id));
    const destinationIds = Array.isArray(parsed.destinationIds)
      ? parsed.destinationIds.filter((id) => validIds.has(id))
      : [];

    res.json({ destinationIds });
  } catch (err) {
    console.error("trending-destinations failed:", err);
    res.status(500).json({ error: "Trending destinations generation failed" });
  }
});

// ----------------------------------------------------------------------------
// Destination pricing — a once-a-day, realistic total-trip-cost estimate (in
// Indian Rupees) per destination, used as the price shown on a destination
// card until (and unless) that destination has an actual itinerary built for
// it, at which point the itinerary's own total takes over (see src/App.jsx).
// ----------------------------------------------------------------------------
const PRICE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    prices: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING, description: "Must match one of the provided destination ids exactly." },
          totalInr: {
            type: SchemaType.NUMBER,
            description:
              "A realistic TOTAL trip cost in Indian Rupees (INR) for one traveler for the given number of " +
              "days, at a typical mid-range budget — covering getting there, accommodation, food, local " +
              "transport, and activities. Base it on real-world costs for that specific place, converted to INR.",
          },
        },
        required: ["id", "totalInr"],
      },
    },
  },
  required: ["prices"],
};

const priceModel = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: PRICE_SCHEMA,
  },
});

app.post("/api/destination-prices", async (req, res) => {
  const { destinations } = req.body || {};

  if (!Array.isArray(destinations) || destinations.length === 0) {
    return res.status(400).json({ error: "A non-empty destinations list is required" });
  }

  try {
    const prompt =
      `For EACH destination below, estimate a realistic total trip cost in Indian Rupees (INR) for one ` +
      `traveler, for the listed number of days, at a typical mid-range budget (covering getting there, ` +
      `accommodation, food, local transport, and activities). Base every number on real-world costs for that ` +
      `specific place, converted to INR — costs should vary meaningfully between destinations, not cluster ` +
      `around one number. Return exactly one entry per destination "id".\n\n${JSON.stringify(destinations)}`;

    const result = await priceModel.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    const validIds = new Set(destinations.map((d) => d.id));
    const prices = {};
    (Array.isArray(parsed.prices) ? parsed.prices : []).forEach(({ id, totalInr }) => {
      const n = Math.round(Number(totalInr));
      if (validIds.has(id) && Number.isFinite(n) && n > 0) prices[id] = n;
    });

    res.json({ prices });
  } catch (err) {
    console.error("destination-prices failed:", err);
    res.status(500).json({ error: "Destination price generation failed" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`TripNest AI server listening on :${PORT}`));