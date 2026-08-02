import { useState } from "react";

// Clean imports (Vite will auto-detect whether it's .jsx or .tsx!)
import ItineraryDrawer from "./components/ItineraryDrawer";
import PackingChecklist from "./components/PackingChecklist";

export default function App() {
  const [itineraryItems, setItineraryItems] = useState([
    { id: "1", title: "Snorkeling Trip", location: "Bali", cost: 50, day: "Day 1", weather: "Sunny" }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <header className="flex justify-between items-center max-w-4xl mx-auto mb-6 bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-teal-600">TripNest</h1>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition"
        >
          View Itinerary ({itineraryItems.length})
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <PackingChecklist />
      </main>

      <ItineraryDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        items={itineraryItems}
        setItems={setItineraryItems}
      />
    </div>
  );
}