import React, { useState, useEffect } from "react";
import DestinationCard from "./components/DestinationCard";
import DestinationModal from "./components/DestinationModal";
import CompareDrawer from "./components/CompareDrawer";
import ItineraryDrawer from "./components/ItineraryDrawer";
import MapView from "./components/MapView";
import AITripPlanner from "./components/AITripPlanner";
import { DESTINATIONS } from "./data/destinations";
import { planItineraryForDestination } from "./services/aiService";
import { 
  MapPin, Search, Moon, Sun, Compass, 
  Filter, Globe, Heart, Bot, Luggage, Loader2
} from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState("light");
  
  // Filter States
  const [scope, setScope] = useState("All"); 
  const [activeCategory, setActiveCategory] = useState("All"); 
  const [selectedRegion, setSelectedRegion] = useState("All"); 
  const [selectedContinent, setSelectedContinent] = useState("All"); 
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Persistence States
  const [selectedModalDest, setSelectedModalDest] = useState(null);

  // Live Map Overlay State
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("tripnest_favorites") || "[]");
  });

  const [compared, setCompared] = useState([]);

  // Active Destination State (Destination Lock System)
  const [activeDestination, setActiveDestination] = useState(null);

  // Itinerary Drawer State ("My Itinerary" — separate from the AI Companion)
  const [itineraryDrawerOpen, setItineraryDrawerOpen] = useState(false);
  const [itineraryLoading, setItineraryLoading] = useState(false);

  // AI Trip Companion State
  const [aiPlannerOpen, setAiPlannerOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activitiesByDay, setActivitiesByDay] = useState(() => {
    return JSON.parse(localStorage.getItem("tripnest_activities") || "{}");
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("tripnest_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("tripnest_activities", JSON.stringify(activitiesByDay));
  }, [activitiesByDay]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  const handleToggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // Multi-Level Filtering Logic
  const filteredDestinations = DESTINATIONS.filter((item) => {
    if (showOnlyFavorites && !favorites.includes(item.id)) return false;
    if (scope === "India" && item.country !== "India") return false;
    if (scope === "International" && item.country === "India") return false;

    if (scope === "India" && selectedRegion !== "All" && item.region !== selectedRegion) {
      return false;
    }

    if (scope === "International" && selectedContinent !== "All" && item.continent !== selectedContinent) {
      return false;
    }

    if (activeCategory !== "All" && item.category !== activeCategory) {
      return false;
    }

    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.country.toLowerCase().includes(query) ||
      (item.region && item.region.toLowerCase().includes(query)) ||
      (item.continent && item.continent.toLowerCase().includes(query))
    );
  });

  const comparedObjects = DESTINATIONS.filter(item => compared.includes(item.id));

  // Applies a fully-generated trip payload (same shape produced by both the
  // AI Trip Companion and the manual "My Itinerary" generator) to the
  // shared itinerary state, so the drawer always shows a fully locked,
  // day-by-day plan no matter which flow produced it.
  const applyGeneratedTrip = (trip) => {
    setActiveDestination(trip.destination);

    const byDay = {};
    trip.dayWiseItinerary.forEach(({ day, slots }) => {
      byDay[day] = slots.map((slot, idx) => ({
        id: `${trip.destination.id}-d${day}-${idx}`,
        title: slot.title,
        location: `${trip.destination.name}, ${trip.destination.country}`,
        category: slot.category,
        cost: slot.cost,
        destinationId: trip.destination.id,
      }));
    });
    setActivitiesByDay(byDay);
  };

  // Destination Lock System Handler — used when a destination is picked
  // manually (destination cards, the compare drawer, the detail modal, or
  // an "alternate" suggestion). Generates the same kind of day-wise plan +
  // packing checklist the AI Companion builds, just for the exact
  // destination the person chose, instead of a single placeholder entry.
  const handleAddToItinerary = async (destination) => {
    setActiveDestination(destination);
    setItineraryDrawerOpen(true);
    setItineraryLoading(true);
    try {
      const trip = await planItineraryForDestination(destination);
      applyGeneratedTrip(trip);
    } catch (err) {
      console.error(err);
      // Fall back to a minimal single entry so the drawer is never empty
      setActivitiesByDay(prev => ({
        ...prev,
        1: [{
          id: Date.now(),
          title: destination.name,
          location: destination.country,
          category: destination.category,
          cost: 0,
          destinationId: destination.id
        }]
      }));
    } finally {
      setItineraryLoading(false);
    }
  };

  // Called when a trip is locked from inside the AI Trip Companion. The
  // Companion already generated the full trip (respecting the traveler's
  // chosen days/budget/mood), so it's applied directly instead of being
  // regenerated with defaults.
  const handleLockTrip = (trip) => {
    applyGeneratedTrip(trip);
    setItineraryDrawerOpen(true);
  };

  // Compare Drawer Handler
  const handleChooseDestination = (destination) => {
    handleAddToItinerary(destination);
    setIsCompareOpen(false);
  };

  const handleToggleCompare = (id) => {
    setCompared(prev => {
      const isAdding = !prev.includes(id);
      const newCompared = isAdding ? [...prev, id] : prev.filter(compId => compId !== id);
      
      // Open compare drawer when items are added
      if (isAdding) {
        setIsCompareOpen(true);
      }
      
      return newCompared;
    });
  };

  const handleExportJSON = () => {
    const data = {
      activeDestination,
      activitiesByDay,
      favorites,
      compared
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tripnest_itinerary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalBudget = Object.values(activitiesByDay).flat().reduce((sum, activity) => sum + (activity.cost || 0), 0);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span className="p-2.5 bg-gradient-to-tr from-sky-500 to-emerald-400 text-white rounded-xl shadow-md">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="text-2xl font-black tracking-tight">
              Trip<span className="text-sky-500">Nest</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600 dark:text-slate-300">
            <a href="#explore" className="hover:text-sky-500 transition-colors">Destinations</a>
            <button
              onClick={() => setIsMapOpen(true)}
              className="hover:text-sky-500 transition-colors"
            >
              Live Map
            </button>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 transition-transform"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setAiPlannerOpen(true)}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:scale-105 transition-transform flex items-center gap-2 px-4"
          >
            <Bot className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold text-black">Companion</span>
          </button>

          {/* My Itinerary — standalone button, independent of the AI Companion.
              Opens the shared ItineraryDrawer (itinerary + packing checklist),
              whether the active destination came from a manual pick or the AI. */}
          <button
            onClick={() => setItineraryDrawerOpen(true)}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-105 transition-transform flex items-center gap-2 px-4"
          >
            {itineraryLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Luggage className="h-5 w-5" />
            )}
            <span className="hidden sm:inline font-semibold">My Itinerary</span>
            {activeDestination && (
              <span
                title={activeDestination.name}
                className="bg-sky-500/15 text-sky-600 dark:text-sky-400 text-[10px] px-2 py-0.5 rounded-full font-bold max-w-[70px] truncate"
              >
                {activeDestination.name}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="py-16 px-6 text-center max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs tracking-wider uppercase">
          <Compass className="h-4 w-4" /> Smart Travel Planner
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Explore India & The World <br className="hidden sm:inline"/>
          <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] font-bold">
           With Rich Insights
          </span>
        </h1>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg p-2">
            <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search by city, country, region, or continent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 pb-24 space-y-16">

        {/* FILTER BAR */}
        <section id="explore" className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Scope Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                <Globe className="h-5 w-5 text-sky-500" />
                <span>Scope</span>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full sm:w-auto">
                {["All", "India", "International"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setScope(item);
                      if (item !== "India") setSelectedRegion("All");
                      if (item !== "International") setSelectedContinent("All");
                    }}
                    className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      scope === item
                        ? "bg-white dark:bg-slate-900 text-sky-500 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {item === "India" ? "🇮🇳 India" : item === "International" ? "🌍 Foreign" : "🌐 All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills & Dropdowns */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {["All", "Heritage", "Beaches", "Mountains", "Wildlife","Metropolis","Nature"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === cat
                        ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                {/* Favorite Quick Filter Pill */}
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    showOnlyFavorites
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-rose-500"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${showOnlyFavorites ? "fill-current" : ""}`} />
                  Favorites ({favorites.length})
                </button>
              </div>

              {/* Region/Continent Selectors */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                {(scope === "All" || scope === "India") && (
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none w-full sm:w-auto"
                  >
                    <option value="All">All Indian Regions</option>
                    <option value="North">North India</option>
                    <option value="South">South India</option>
                    <option value="East">East India</option>
                    <option value="West">West India</option>
                  </select>
                )}

                {(scope === "All" || scope === "International") && (
                  <select
                    value={selectedContinent}
                    onChange={(e) => setSelectedContinent(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none w-full sm:w-auto"
                  >
                    <option value="All">All Continents</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Americas">Americas</option>
                    <option value="Africa">Africa</option>
                  </select>
                )}
              </div>
            </div>

          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                dest={dest}
                onAddToItinerary={handleAddToItinerary}
                isFavorite={favorites.includes(dest.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompared={compared.includes(dest.id)}
                onToggleCompare={handleToggleCompare}
                onOpenDetails={(d) => setSelectedModalDest(d)}
              />
            ))}
          </div>
        </section>

      </main>

      {/* LIVE MAP OVERLAY */}
      <MapView
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        destinations={DESTINATIONS}
        onViewDetails={(dest) => {
          setIsMapOpen(false);
          setSelectedModalDest(dest);
        }}
      />

      {/* AI TRIP COMPANION */}
      <AITripPlanner
        open={aiPlannerOpen}
        onClose={() => setAiPlannerOpen(false)}
        theme={theme}
        onAddToItinerary={handleAddToItinerary}
        onLockTrip={handleLockTrip}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        compared={compared}
        onToggleCompare={handleToggleCompare}
        onOpenDetails={(d) => setSelectedModalDest(d)}
      />

      {/* DETAIL MODAL */}
      <DestinationModal
        dest={selectedModalDest}
        onClose={() => setSelectedModalDest(null)}
        onAddToItinerary={handleAddToItinerary}
      />

      {/* COMPARE DRAWER */}
      {isCompareOpen && (
        <CompareDrawer
          comparedItems={comparedObjects}
          onRemoveCompare={handleToggleCompare}
          onClearAll={() => setCompared([])}
          theme={theme}
          onChooseDestination={handleChooseDestination}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* ITINERARY DRAWER — "My Itinerary": itinerary tab + packing checklist,
          shared by both the manual selection flow and the AI Companion lock */}
      <ItineraryDrawer
        open={itineraryDrawerOpen}
        onClose={() => setItineraryDrawerOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeDestination={activeDestination}
        activitiesByDay={activitiesByDay}
        totalBudget={totalBudget}
        loading={itineraryLoading}
        packingItems={[]}
        onTogglePacking={() => {}}
        onExportJSON={handleExportJSON}
        onExportPDF={() => window.print()}
      />

    </div>
  );
}