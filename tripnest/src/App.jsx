import React, { useState, useEffect } from "react";
import DestinationCard from "./components/DestinationCard";
import DestinationModal from "./components/DestinationModal";
import CompareDrawer from "./components/CompareDrawer";
import ItineraryDrawer from "./components/ItineraryDrawer";
import MapView from "./components/MapView";
import BookingModal from "./components/BookingModal";
import BookingsDrawer from "./components/BookingsDrawer";
import { DESTINATIONS } from "./data/destinations";
import { 
  MapPin, Search, Moon, Sun, Compass, 
  Filter, Globe, Heart, Bot, Ticket, Menu, X
} from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  // Booking States
  const [bookingDest, setBookingDest] = useState(null);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [bookings, setBookings] = useState(() => {
    return JSON.parse(localStorage.getItem("tripnest_bookings") || "[]");
  });

  const [compared, setCompared] = useState([]);

  // Active Destination State (Destination Lock System)
  const [activeDestination, setActiveDestination] = useState(null);

  // Itinerary Drawer State
  const [itineraryDrawerOpen, setItineraryDrawerOpen] = useState(false);
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

  useEffect(() => {
    localStorage.setItem("tripnest_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  const handleToggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleConfirmBooking = (booking) => {
    setBookings(prev => [...prev, booking]);
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

  // Destination Lock System Handler
  const handleAddToItinerary = (destination) => {
    setActiveDestination(destination);
    
    // Pre-populate Day 1 with the destination's primary attraction
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
    
    // Open the Itinerary Drawer
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="p-2 sm:p-2.5 bg-gradient-to-tr from-sky-500 to-emerald-400 text-white rounded-xl shadow-md">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tight">
              Trip<span className="text-sky-500">Nest</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-sm text-slate-600 dark:text-slate-300">
            <a href="#explore" className="hover:text-sky-500 transition-colors">Destinations</a>
            <button
              onClick={() => setIsMapOpen(true)}
              className="hover:text-sky-500 transition-colors"
            >
              Live Map
            </button>
          </nav>

          {/* Desktop Quick Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 transition-transform"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setIsBookingsOpen(true)}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-transform flex items-center gap-2 px-3 sm:px-4"
            >
              <Ticket className="h-5 w-5" />
              <span className="hidden md:inline font-semibold text-sm">Bookings</span>
              {bookings.length > 0 && (
                <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {bookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setItineraryDrawerOpen(true)}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:scale-105 transition-transform flex items-center gap-2 px-3 sm:px-4"
            >
              <Bot className="h-5 w-5" />
              <span className="hidden md:inline font-semibold text-sm text-slate-950 dark:text-white">Companion</span>
              {activeDestination && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {activeDestination.name.substring(0, 3)}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
            <a 
              href="#explore" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Destinations
            </a>
            <button
              onClick={() => { setIsMapOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Live Map
            </button>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => { setIsBookingsOpen(true); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <Ticket className="h-4 w-4" />
                Bookings
                {bookings.length > 0 && (
                  <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                    {bookings.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setItineraryDrawerOpen(true); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <Bot className="h-4 w-4" />
                Companion
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs tracking-wider uppercase">
          <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Smart Travel Planner
        </span>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Explore India & The World <br className="hidden sm:inline"/>
          <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] font-bold">
            With Rich Insights
          </span>
        </h1>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-full shadow-lg p-2">
            <Search className="h-5 w-5 text-slate-400 ml-2 sm:ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search by city, country, region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 space-y-12 sm:space-y-16">

        {/* FILTER BAR */}
        <section id="explore" className="space-y-6 sm:space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
            
            {/* Scope Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 sm:pb-5">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base sm:text-lg">
                <Globe className="h-5 w-5 text-sky-500" />
                <span>Scope</span>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl sm:rounded-2xl w-full sm:w-auto">
                {["All", "India", "International"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setScope(item);
                      if (item !== "India") setSelectedRegion("All");
                      if (item !== "International") setSelectedContinent("All");
                    }}
                    className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 rounded-lg sm:rounded-xl text-xs font-bold transition-all ${
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
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              {/* Category Pills - Horizontal Scroll on Mobile */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
                {["All", "Heritage", "Beaches", "Mountains", "Wildlife", "Metropolis", "Nature"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
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
                  className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                {(scope === "All" || scope === "India") && (
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-semibold outline-none w-full"
                    >
                      <option value="All">All Indian Regions</option>
                      <option value="North">North India</option>
                      <option value="South">South India</option>
                      <option value="East">East India</option>
                      <option value="West">West India</option>
                    </select>
                  </div>
                )}

                {(scope === "All" || scope === "International") && (
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                    <select
                      value={selectedContinent}
                      onChange={(e) => setSelectedContinent(e.target.value)}
                      className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-semibold outline-none w-full"
                    >
                      <option value="All">All Continents</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="Americas">Americas</option>
                      <option value="Africa">Africa</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Cards Grid: 1 col on phone, 2 cols on tablet, 3 cols on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                dest={dest}
                onAddToItinerary={handleAddToItinerary}
                onBookNow={setBookingDest}
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

      {/* DETAIL MODAL */}
      <DestinationModal
        dest={selectedModalDest}
        onClose={() => setSelectedModalDest(null)}
        onAddToItinerary={handleAddToItinerary}
        onBookNow={setBookingDest}
        isFavorite={selectedModalDest ? favorites.includes(selectedModalDest.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* BOOKING MODAL */}
      <BookingModal
        dest={bookingDest}
        onClose={() => setBookingDest(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* BOOKINGS DRAWER */}
      <BookingsDrawer
        open={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        bookings={bookings}
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

      {/* ITINERARY DRAWER */}
      <ItineraryDrawer
        open={itineraryDrawerOpen}
        onClose={() => setItineraryDrawerOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeDestination={activeDestination}
        activitiesByDay={activitiesByDay}
        totalBudget={totalBudget}
        packingItems={[]}
        onTogglePacking={() => {}}
        onExportJSON={handleExportJSON}
        onExportPDF={() => window.print()}
      />

    </div>
  );
}