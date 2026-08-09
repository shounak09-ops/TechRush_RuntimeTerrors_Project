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
                time: { type: SchemaType.STRING, enum: ["Morning", "Afternoon", "Evening"] },
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
  required: ["destinationId", "aiExplanation", "dayWiseItinerary", "travelTips"],
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
      `preferences. All costs must be in US dollars per activity, roughly in line with a ` +
      `${formData.budget || "Medium"} budget tier (Low: ~$5-15/activity, Medium: ~$15-30/activity, ` +
      `Luxury: ~$30-70/activity). Available destinations:\n${JSON.stringify(destinations)}`;

    const result = await model.generateContent(prompt);
    const plan = JSON.parse(result.response.text());

    // Guard against the model picking an id that isn't actually in the list
    // it was given.
    const validIds = new Set(destinations.map((d) => d.id));
    if (!validIds.has(plan.destinationId)) {
      plan.destinationId = destinations[0].id;
    }

    res.json(plan);
  } catch (err) {
    console.error("generate-trip failed:", err);
    res.status(500).json({ error: "AI trip generation failed" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`TripNest AI server listening on :${PORT}`));
