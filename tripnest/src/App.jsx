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
  MapPin, Search, Moon, Sun, 
  Filter, Globe, Heart, Luggage, Loader2, Menu, X as CloseIcon,
  Sparkles, Wallet, CloudSun, ArrowRight, Star,
  ShieldCheck, Lock, Headphones, IndianRupee
} from "lucide-react";

const TRENDING_SEARCHES = ["Bali", "Switzerland", "Paris", "Goa", "Japan"];

export default function App() {
  const [theme, setTheme] = useState("light");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
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
  // Number of days in the active itinerary — separate from a destination's
  // suggestedDays so the traveler can add/remove days freely.
  const [dayCount, setDayCount] = useState(() => {
    return Number(localStorage.getItem("tripnest_daycount")) || 0;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("tripnest_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("tripnest_activities", JSON.stringify(activitiesByDay));
  }, [activitiesByDay]);

  useEffect(() => {
    localStorage.setItem("tripnest_daycount", String(dayCount));
  }, [dayCount]);

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
    setDayCount(trip.dayWiseItinerary.length || trip.destination.suggestedDays || 1);

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
      setDayCount(1);
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

  const handleReorderDay = (day, newList) => {
    setActivitiesByDay(prev => ({ ...prev, [day]: newList }));
  };

  const handleAddDay = () => {
    setDayCount(prev => Math.min(30, (prev || 0) + 1));
  };

  const handleRemoveDay = (day) => {
    setDayCount(prev => Math.max(1, (prev || 1) - 1));
    setActivitiesByDay(prev => {
      const next = {};
      Object.keys(prev).map(Number).sort((a, b) => a - b).forEach((d) => {
        if (d === day) return; // drop this day
        next[d > day ? d - 1 : d] = prev[d]; // shift later days down by one
      });
      return next;
    });
  };

  const handleAddActivity = (day, activity) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { id: `custom-${Date.now()}`, ...activity }]
    }));
  };

  const handleDeleteActivity = (day, activityId) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(a => a.id !== activityId)
    }));
  };

  const handleEditActivityCost = (day, activityId, newCost) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [day]: (prev[day] || []).map(a => a.id === activityId ? { ...a, cost: newCost } : a)
    }));
  };

  const handleMoveActivity = (activityId, fromDay, toDay) => {
    if (fromDay === toDay) return;
    setActivitiesByDay(prev => {
      const fromList = prev[fromDay] || [];
      const moving = fromList.find(a => a.id === activityId);
      if (!moving) return prev;
      return {
        ...prev,
        [fromDay]: fromList.filter(a => a.id !== activityId),
        [toDay]: [...(prev[toDay] || []), moving],
      };
    });
  };

  const handleResetItinerary = () => {
    setActivitiesByDay({});
    setActiveDestination(null);
    setDayCount(0);
    localStorage.removeItem("tripnest_activities");
    localStorage.removeItem("tripnest_daycount");
  };

  const totalBudget = Object.values(activitiesByDay).flat().reduce((sum, activity) => sum + (activity.cost || 0), 0);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2">
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <span className="p-2.5 bg-gradient-to-tr from-sky-500 to-emerald-400 text-white rounded-xl shadow-md">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tight">
              <span className="text-emerald-500">Trip</span><span className="text-sky-500">Nest</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600 dark:text-slate-300">
            <a href="#explore" className="hover:text-sky-500 transition-colors">Destinations</a>
            <a href="#highlights" className="hover:text-sky-500 transition-colors">Experiences</a>
            <button
              onClick={() => setIsMapOpen(true)}
              className="hover:text-sky-500 transition-colors"
            >
              Live Map
            </button>
            <a href="#deals" className="hover:text-sky-500 transition-colors">Deals</a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile nav toggle — reveals Destinations / Live Map, which the
                nav above hides below the md breakpoint */}
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-105 transition-transform"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 transition-transform"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setAiPlannerOpen(true)}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 transition-transform flex items-center gap-2 px-4"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline font-semibold text-black">AI Companion</span>
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
        </div>

        {/* Mobile nav panel — Destinations / Live Map, only reachable via the
            hamburger toggle below the md breakpoint */}
        {mobileNavOpen && (
          <nav className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex flex-col gap-1 font-semibold text-sm text-slate-600 dark:text-slate-300">
            <a
              href="#explore"
              onClick={() => setMobileNavOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-colors"
            >
              Destinations
            </a>
            <a
              href="#highlights"
              onClick={() => setMobileNavOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-colors"
            >
              Experiences
            </a>
            <button
              onClick={() => {
                setIsMapOpen(true);
                setMobileNavOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-colors"
            >
              Live Map
            </button>
            <a
              href="#deals"
              onClick={() => setMobileNavOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-colors"
            >
              Deals
            </a>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/20 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950/20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-24 lg:pt-20 lg:pb-32">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm text-sky-600 dark:text-sky-400 font-bold text-xs tracking-wider uppercase shadow-sm">
              <Sparkles className="h-4 w-4" /> Smart Travel Planner
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Explore India &amp; The World <br className="hidden sm:inline"/>
              <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] font-bold">
               With Rich Insights
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              Plan smarter, travel better and create unforgettable memories with{" "}
              <span className="font-bold text-slate-900 dark:text-white">TripNest</span>.
            </p>

            {/* Search Bar */}
            <div className="pt-2 max-w-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full shadow-md p-2"
              >
                <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by city, country, region or continent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="p-2.5 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-400 text-white shrink-0 hover:scale-105 transition-transform"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Trending Searches */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Trending Searches:</span>
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 hover:text-sky-600 transition-colors shadow-sm"
                >
                  {term}
                </button>
              ))}
              <a
                href="#explore"
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:gap-1.5 transition-all"
              >
                More <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Trusted-by floating card */}
          <div className="hidden lg:block absolute bottom-10 right-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 px-5 py-4 max-w-[220px]">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Trusted by</p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">50K+ Travelers</p>
            <div className="flex items-center -space-x-2 mb-2">
              {[1, 2, 3, 4].map((n) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/40?img=${n * 11}`}
                  alt=""
                  className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-1">4.8 (12K reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS BAR — overlaps the hero's bottom edge */}
      <div id="highlights" className="max-w-6xl mx-auto px-6 -mt-14 relative z-10 scroll-mt-24">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Luggage, color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10", title: "AI Trip Planner", desc: "Get a personalized itinerary in seconds", action: () => setAiPlannerOpen(true) },
            { icon: Wallet, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10", title: "Smart Budgeting", desc: "Plan your trip within your budget", action: () => setItineraryDrawerOpen(true) },
            { icon: MapPin, color: "text-orange-500 bg-orange-50 dark:bg-orange-500/10", title: "Local Insights", desc: "Discover hidden gems & local favorites", action: () => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: CloudSun, color: "text-sky-500 bg-sky-50 dark:bg-sky-500/10", title: "Real-time Updates", desc: "Live weather, alerts & travel updates", action: () => setIsMapOpen(true) },
          ].map(({ icon: Icon, color, title, desc, action }) => (
            <button
              key={title}
              onClick={action}
              className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
            >
              <span className={`p-2.5 rounded-xl shrink-0 ${color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{title}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 space-y-16">

        {/* FILTER BAR */}
        <section id="explore" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Explore by Scope</h2>
              <span className="block w-10 h-1 rounded-full bg-emerald-400 mt-1.5" />
            </div>
            <button
              onClick={() => {
                setScope("All");
                setActiveCategory("All");
                setSelectedRegion("All");
                setSelectedContinent("All");
                setShowOnlyFavorites(false);
              }}
              className="flex items-center gap-1 text-sm font-bold text-sky-600 dark:text-sky-400 hover:gap-1.5 transition-all"
            >
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>

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

        {/* AI TRAVEL COMPANION PROMO BANNER */}
        <section id="deals" className="scroll-mt-24">
          <div className="bg-gradient-to-r from-emerald-50 to-sky-50 dark:from-emerald-500/10 dark:to-sky-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-5xl sm:text-6xl shrink-0" aria-hidden="true">🧳</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                Your AI Travel Companion <Sparkles className="h-5 w-5 text-emerald-500" />
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Get personalized recommendations, day plans, budget estimates and more — all in one place!
              </p>
            </div>
            <button
              onClick={() => setAiPlannerOpen(true)}
              className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform"
            >
              Chat with AI Companion <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
          {[
            { icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10", title: "Best Price Guarantee", desc: "Find the best deals for your trip" },
            { icon: Lock, color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10", title: "Secure Booking", desc: "Book with confidence and peace of mind" },
            { icon: Headphones, color: "text-sky-500 bg-sky-50 dark:bg-sky-500/10", title: "24/7 Support", desc: "We're here for you anytime, anywhere" },
            { icon: IndianRupee, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10", title: "No Hidden Fees", desc: "Transparent pricing you can trust" },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="flex items-start gap-3 pt-4">
              <span className={`p-2.5 rounded-xl shrink-0 ${color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
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
        dayCount={dayCount}
        totalBudget={totalBudget}
        loading={itineraryLoading}
        packingItems={[]}
        onTogglePacking={() => {}}
        onReorderDay={handleReorderDay}
        onAddDay={handleAddDay}
        onRemoveDay={handleRemoveDay}
        onAddActivity={handleAddActivity}
        onDeleteActivity={handleDeleteActivity}
        onEditActivityCost={handleEditActivityCost}
        onMoveActivity={handleMoveActivity}
        onResetItinerary={handleResetItinerary}
      />

    </div>
  );
}