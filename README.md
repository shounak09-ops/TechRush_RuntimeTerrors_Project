# 🌍 TripNest – AI-Powered Travel Planner

TripNest is a full-stack travel planning app built for the **TechRush Hackathon** by
**Team Runtime Terrors**. It helps people discover destinations, plan a day-by-day
itinerary with a real LLM, track a trip budget, build a smart packing list, and export
everything as a PDF — all in one place.

---

## ✨ Features

- **Destination Explorer** — browse curated destinations with photos, weather, category
  tags, and highlights; view an "all destinations" grid or a horizontal rail.
- **AI Trip Planner** — generates a full day-by-day itinerary (timed activities, food,
  sightseeing, costs) from a real LLM call (Google Gemini), based on destination, trip
  length, budget, number of companions, and mood/weather preference. Falls back to a
  deterministic local generator if the AI server is unreachable.
- **AI flight-price estimate** — fetched on demand (only when a destination card's
  "Add" button is clicked, not for every card on screen) and cached client-side to stay
  within free-tier rate limits.
- **Itinerary Drawer** — the main trip workspace: per-day activity lists with drag-and-
  drop reordering, add/edit/delete activities, live per-day and total budget, an
  interactive day map, and a **Save as PDF** export (via `html2pdf.js`).
- **Packing Checklist** — suggests items based on the destination, trip length, weather,
  and the activities actually in the generated itinerary (e.g. trekking gear only shows
  up if the itinerary includes a trek).
- **Compare Drawer** — compare multiple shortlisted destinations side-by-side.
- **Favorites & Bookings** — save destinations and manage booked trips.
- **Interactive Map View** — Leaflet-based map for destinations and day-wise stops.
- **Light/Dark Theme** — an explicit in-app toggle (not tied to the OS setting) that
  persists across visits and applies with no flash-of-wrong-theme on load.
- **User Experiences** — a scrolling showcase of traveler testimonials.

---

## 🏗️ Tech Stack

| Layer | Tools |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router |
| **Maps** | Leaflet, react-leaflet |
| **Icons** | lucide-react |
| **PDF export** | html2pdf.js |
| **AI backend** | Node.js, Express, Google Gemini (`@google/generative-ai`) |
| **Deployment** | Vercel (backend, see `server/vercel.json`) |

---

## 📂 Project Structure

```
TechRush_RuntimeTerrors_Project/
├── tripnest/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AITripPlanner.jsx        # AI trip-generation form + results
│   │   │   ├── AllDestinationsOverlay.jsx
│   │   │   ├── BookingModal.jsx / BookingsDrawer.jsx
│   │   │   ├── CompareDrawer.jsx
│   │   │   ├── DestinationCard.jsx      # Card grid item — image gallery, flight price, add/favorite
│   │   │   ├── DestinationModal.jsx
│   │   │   ├── Destinationrail.jsx
│   │   │   ├── Intro.jsx / Intro.css    # Landing hero
│   │   │   ├── ItineraryDrawer.jsx      # Core trip workspace (days, activities, budget, PDF export)
│   │   │   ├── ItineraryDayMap.jsx
│   │   │   ├── MapView.jsx / MapView.css
│   │   │   ├── PackingCheckList.jsx
│   │   │   └── UserExperiences.jsx
│   │   ├── data/
│   │   │   └── destinations.js          # Static destination dataset
│   │   ├── services/
│   │   │   └── aiService.js             # Calls the backend AI endpoints, with caching
│   │   ├── utils/
│   │   │   ├── mockTripGenerator.js     # Deterministic fallback trip/budget/packing generator
│   │   │   ├── categoryColors.js
│   │   │   └── useCountUp.js
│   │   ├── App.jsx                      # Top-level state, routing, theme
│   │   ├── index.css                    # Tailwind entry, theme tokens, animations
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── .env.production                  # VITE_API_BASE_URL for the deployed backend
│
├── server/                        # Backend (Node + Express + Gemini)
│   ├── index.js                   # /api/generate-trip, /api/flight-estimate, /api/health
│   ├── package.json
│   └── vercel.json                # Vercel deployment config
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- A free [Google AI Studio](https://aistudio.google.com/apikey) API key (for the AI trip
  planner and flight estimates)

### 1. Clone the repository
```bash
git clone https://github.com/shounak09-ops/TechRush_RuntimeTerrors_Project.git
cd TechRush_RuntimeTerrors_Project
```

### 2. Set up the backend (AI server)
The AI Trip Planner is backed by a real LLM call, not a mock — it lives in a small
separate server so the API key is never exposed in the browser bundle.

```bash
cd server
npm install
cp .env.example .env      # if present; otherwise create server/.env manually
```

Add your key to `server/.env`:
```
GEMINI_API_KEY=your-real-key-here
PORT=3001
```

Start it:
```bash
npm run dev
# TripNest AI server listening on :3001
```

### 3. Set up the frontend
In a separate terminal:
```bash
cd tripnest
npm install
npm run dev
```

The dev server proxies `/api` requests to `http://localhost:3001` automatically (see
`vite.config.js`), so no extra configuration is needed locally.

If the AI server isn't running, or a request fails, the app **gracefully falls back**
to `mockTripGenerator.js` for trip planning and to a static budget figure for flight
prices, so the app still works end-to-end without a key — just without live AI results.

### 4. Build for production
```bash
cd tripnest
npm run build
```

---

## 🚀 Deployment

- **Backend** (`server/`) deploys to Vercel using `server/vercel.json`.
- **Frontend** (`tripnest/`) needs `VITE_API_BASE_URL` set to the deployed backend's
  URL — Vite bakes this in at **build time**, not runtime, so the frontend must be
  rebuilt/redeployed after changing it. See `tripnest/.env.production`. Use `https`,
  not `http` — a frontend served over HTTPS will silently block mixed-content requests
  to an HTTP backend.

---

## 🔑 Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | `server/.env` | Google Gemini API key for trip generation & flight estimates |
| `PORT` | `server/.env` | Port the AI server listens on (default `3001`) |
| `VITE_API_BASE_URL` | `tripnest/.env.production` | Absolute URL of the deployed backend, used in production builds |

---

## 🤖 How the AI integration works

- `tripnest/src/services/aiService.js` calls `POST /api/generate-trip` and
  `POST /api/flight-estimate` on the backend, with client-side caching so repeat views
  of the same destination don't re-trigger a network/API call.
- Flight-price estimates are fetched **only when a user clicks "Add" on a destination
  card** — not automatically for every card rendered on screen — to avoid hitting
  Gemini's free-tier rate limits on pages with many cards (e.g. the "all destinations"
  grid).
- `server/index.js` wraps the Gemini SDK, enforces a structured JSON response schema
  for both endpoints, and returns clean errors the frontend can fall back from.
- If the backend is unreachable or errors, the frontend transparently falls back to
  `mockTripGenerator.js`, so the UI never breaks — it just loses live AI content.

---

## 🧭 Team

Built by **Team Runtime Terrors** for the TechRush Hackathon.
