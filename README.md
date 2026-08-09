# 🌍 TripNest – AI-Powered Travel Planner

Welcome to **TripNest**, a smart travel planning web app built for the **TechRush Hackathon** by **Team Runtime Terrors**.  
TripNest helps users discover destinations, compare options, and generate personalized itineraries using AI.

---

## 🚀 Overview

TripNest combines intuitive UI design with AI-driven trip planning.  
Users can:
- Explore destinations with rich visuals and details.
- Compare multiple destinations side-by-side.
- Generate custom itineraries using AI.
- View interactive maps and packing checklists.
- Toggle between light/dark themes for a personalized experience.

---

## 🧠 Key Features

| Feature | Description |
|----------|--------------|
| 🗺️ **Destination Explorer** | Browse curated destinations with images, weather info, and highlights. |
| 🤖 **AI Trip Planner** | Uses `aiService.js` to generate smart itineraries based on user preferences. |
| 🧳 **Packing Checklist** | Auto-suggests items based on trip type and duration. |
| 🧭 **Map View** | Interactive map powered by `MapView.jsx` for visual navigation. |
| ❤️ **Favorites & Compare Drawer** | Save favorite spots and compare destinations easily. |
| 🌙 **Theme Toggle** | Switch between light and dark modes seamlessly. |

---

## 🏗️ Tech Stack

| Category | Tools |
|-----------|-------|
| **Frontend** | React.js, Tailwind CSS |
| **Icons** | Lucide React |
| **AI Service** | Custom `aiService.js` integrating mock AI trip generation |
| **Utilities** | `mockTripGenerator.js`, reusable components |
| **Build Tools** | Vite, PostCSS |
| **Version Control** | Git & GitHub |

---

## 📂 Project Structure

tripnest/
├── src/
│   ├── components/
│   │   ├── AITripPlanner.jsx
│   │   ├── DestinationCard.jsx
│   │   ├── DestinationModal.jsx
│   │   ├── CompareDrawer.jsx
│   │   ├── ItineraryDrawer.jsx
│   │   ├── MapView.jsx
│   │   ├── PackingCheckList.jsx
│   ├── data/
│   │   └── destinations.js
│   ├── services/
│   │   └── aiService.js
│   ├── utils/
│   │   └── mockTripGenerator.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── README.md

Code

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/TripNest.git
cd TripNest
2. Install dependencies
bash
npm install
3. Run the development server
bash
npm run dev
4. Build for production
bash
npm run build
🤖 AI Trip Planner backend
The AI Trip Companion is backed by a real LLM call, not a mock. It lives in a small separate
server (kept out of the frontend so the API key is never exposed in the browser bundle):

bash
cd server
npm install
cp .env.example .env   # then fill in GEMINI_API_KEY (get a free one at https://aistudio.google.com/apikey)
npm run dev

Run this alongside `npm run dev` in `tripnest/` — Vite proxies `/api/*` requests to it
(see `tripnest/vite.config.js`). If the server isn't running, `generateTrip()` in
`src/services/aiService.js` automatically falls back to the local mock generator, so the
app still works without it.


🧪 Future Enhancements
🌐 Real-time weather and location data integration.

🧭 Google Maps API for live navigation.

🧠 GPT-powered itinerary generation.

📱 Mobile-responsive design improvements.

💬 User reviews and social sharing.

🏁 License
This project is licensed under the MIT License.
Feel free to use, modify, and distribute with attribution.

💡 Inspiration
Built for TechRush Hackathon 2026, TripNest embodies the spirit of innovation and teamwork.
Our goal: make travel planning effortless, intelligent, and fun.
