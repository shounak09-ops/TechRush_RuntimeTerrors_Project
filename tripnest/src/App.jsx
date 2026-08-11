import React, { useState, useEffect, useRef } from "react";
import DestinationCard from "./components/DestinationCard";
import DestinationModal from "./components/DestinationModal";
import CompareDrawer from "./components/CompareDrawer";
import ItineraryDrawer from "./components/ItineraryDrawer";
import MapView from "./components/MapView";
import AllDestinationsOverlay from "./components/AllDestinationsOverlay";
import AITripPlanner from "./components/AITripPlanner";
import { DESTINATIONS } from "./data/destinations";
import { planItineraryForDestination } from "./services/aiService";
import UserExperiences from "./components/UserExperiences";
import { 
  MapPin, Search, Moon, Sun, 
  Filter, Globe, Heart, Luggage, Loader2, Menu, X as CloseIcon,
  Sparkles, Wallet, CloudSun, ArrowRight, Plane, Compass, ChevronLeft, ChevronRight
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
  const [allDestinationsOpen, setAllDestinationsOpen] = useState(false);

  // Horizontal destination rail — the scrollbar is deliberately hidden for
  // a cleaner look, so this ref backs the arrow buttons (trackpad/touch
  // swipe already works natively via overflow-x-auto).
  const railRef = useRef(null);
  const scrollRailBy = (amount) => {
    railRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };
  
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
  // One-time "getting there" cost (flights/travel from India, domestic or
  // international depending on the destination) — kept separate from the
  // per-day activitiesByDay costs so it can be shown as its own line in the
  // itinerary instead of being folded into a specific day.
  const [travelCost, setTravelCost] = useState(() => {
    return Number(localStorage.getItem("tripnest_travelcost")) || 0;
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

  useEffect(() => {
    localStorage.setItem("tripnest_travelcost", String(travelCost));
  }, [travelCost]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  const resetFilters = () => {
    setScope("All");
    setActiveCategory("All");
    setSelectedRegion("All");
    setSelectedContinent("All");
    setShowOnlyFavorites(false);
  };

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

  // Home view shows only the trending picks until a filter is actually
  // applied — matched the same way search already matches (name/country/
  // region/continent), so "Switzerland" correctly picks up the Interlaken
  // entry via its country field rather than needing an exact name match.
  const trendingDestinations = DESTINATIONS.filter((item) =>
    TRENDING_SEARCHES.some((term) => {
      const t = term.toLowerCase();
      return (
        item.name.toLowerCase().includes(t) ||
        item.country.toLowerCase().includes(t) ||
        (item.region && item.region.toLowerCase().includes(t)) ||
        (item.continent && item.continent.toLowerCase().includes(t))
      );
    })
  );

  const isDefaultView =
    scope === "All" &&
    activeCategory === "All" &&
    selectedRegion === "All" &&
    selectedContinent === "All" &&
    !showOnlyFavorites &&
    searchQuery.trim() === "";

  const cardsToShow = isDefaultView ? trendingDestinations : filteredDestinations;
  const railKey = isDefaultView
    ? "trending"
    : `${scope}-${activeCategory}-${selectedRegion}-${selectedContinent}-${showOnlyFavorites}-${searchQuery}`;

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
    // One-time getting-there cost (flights/travel from India) — kept out of
    // the day-wise activities and tracked on its own so it shows as a
    // distinct line in the itinerary instead of being lost or blended in.
    setTravelCost(trip.budgetBreakdown?.flightsOrTravel || 0);
  };

  // Destination Lock System Handler — used when a destination is picked
  // manually (destination cards, the compare drawer, the detail modal, or
  // an "alternate" suggestion). Generates the same kind of day-wise plan +
  // packing checklist the AI Companion builds, just for the exact
  // destination the person chose, instead of a single placeholder entry.
  const handleAddToItinerary = async (destination, formData) => {
    setActiveDestination(destination);
    setItineraryDrawerOpen(true);
    setItineraryLoading(true);
    try {
      const trip = await planItineraryForDestination(destination, formData);
      applyGeneratedTrip(trip);
    } catch (err) {
      console.error(err);
      // Fall back to a minimal single entry so the drawer is never empty
      setDayCount(1);
      setTravelCost(0);
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
    setTravelCost(0);
    localStorage.removeItem("tripnest_activities");
    localStorage.removeItem("tripnest_daycount");
    localStorage.removeItem("tripnest_travelcost");
  };

  // Total = day-wise activity costs + the separate one-time travel cost.
  const activitiesCost = Object.values(activitiesByDay).flat().reduce((sum, activity) => sum + (activity.cost || 0), 0);
  const totalBudget = activitiesCost + travelCost;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      
      {/* HEADER — logo left, quiet text links, one obvious CTA on the right */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <span className="p-2.5 bg-gradient-to-tr from-emerald-500 to-emerald-400 text-white rounded-xl shadow-md">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-slate-900 dark:text-white">Trip</span><span className="text-emerald-500">Nest</span>
            </span>
          </a>

          {/* Key links — plain text, underline-on-hover, never boxed like buttons */}
          <nav className="hidden md:flex items-center gap-9 font-semibold text-sm text-slate-600 dark:text-slate-300">
            <a href="#explore" className="group relative py-1">
              Destinations
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>
            <a href="#highlights" className="group relative py-1">
              Experiences
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>
            <button onClick={() => setIsMapOpen(true)} className="group relative py-1">
              Live Map
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </button>
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* My Itinerary — quiet icon, not a competing button. A small dot
                signals an active trip instead of a heavy pill/label. */}
            <button
              onClick={() => setItineraryDrawerOpen(true)}
              className="hidden sm:flex relative p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="My itinerary"
              title="My Itinerary"
            >
              {itineraryLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Luggage className="h-5 w-5" />
              )}
              {activeDestination && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-90"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun key="sun" className="h-5 w-5 tn-pop-in" /> : <Moon key="moon" className="h-5 w-5 tn-pop-in" />}
            </button>

            {/* The one obvious CTA */}
            <button
              onClick={() => setAiPlannerOpen(true)}
              className="ml-1 flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <Plane className="h-4 w-4 -rotate-45" />
              <span className="hidden sm:inline">Plan with AI</span>
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileNavOpen && (
          <nav className="tn-nav-in md:hidden border-t border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 px-4 py-3 flex flex-col gap-1 font-semibold text-sm text-slate-600 dark:text-slate-300">
            <a
              href="#explore"
              onClick={() => setMobileNavOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors"
            >
              Destinations
            </a>
            <a
              href="#highlights"
              onClick={() => setMobileNavOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors"
            >
              Experiences
            </a>
            <button
              onClick={() => {
                setIsMapOpen(true);
                setMobileNavOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors"
            >
              Live Map
            </button>
            <button
              onClick={() => {
                setItineraryDrawerOpen(true);
                setMobileNavOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors flex items-center gap-2"
            >
              <Luggage className="h-4 w-4" /> My Itinerary
            </button>
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
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-40% to-white/0 dark:from-slate-950 dark:via-slate-950/90 dark:via-40% dark:to-slate-950/0" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="max-w-xl space-y-6">
            <span
              className="tn-animate-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase shadow-sm"
              style={{ animationDelay: "0ms" }}
            >
              <Sparkles className="h-4 w-4" /> Smart Travel Planner
            </span>

            <h1
              className="tn-animate-in font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900 dark:text-white"
              style={{ animationDelay: "90ms" }}
            >
              Explore India <br className="hidden sm:inline"/>
              &amp; <span className="text-emerald-500">The World</span>
            </h1>

            <p
              className="tn-animate-in text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-md"
              style={{ animationDelay: "180ms" }}
            >
              Plan smarter, travel better, and create unforgettable memories with{" "}
              <span className="font-bold text-slate-900 dark:text-white">TripNest</span>.
            </p>

            {/* Search Bar */}
            <div className="tn-animate-in pt-2 max-w-lg" style={{ animationDelay: "270ms" }}>
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
                  className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shrink-0 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 transition-all flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>
            </div>

            {/* Trending destination chips — each pinned like a spot on a map */}
            <div className="tn-animate-in flex flex-wrap items-center gap-2 pt-1" style={{ animationDelay: "360ms" }}>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Trending Searches:</span>
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  <MapPin className="h-3 w-3 text-emerald-500" />
                  {term}
                </button>
              ))}
              <a
                href="#explore"
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:gap-1.5 transition-all"
              >
                More <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Signature travel motif — a dotted flight route between two pins,
              standing in for the old promo card without turning the hero
              into another box. */}
          <div
            className="tn-animate-in hidden lg:flex flex-col items-end absolute bottom-12 right-10 pointer-events-none"
            style={{ animationDelay: "450ms" }}
          >
            <div className="relative w-52 h-28">
              <svg viewBox="0 0 200 110" className="w-52 h-28 text-emerald-500/80 dark:text-emerald-400/70" fill="none">
                <path
                  d="M6 100 Q 100 6 194 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 7"
                  strokeLinecap="round"
                />
                <circle cx="6" cy="100" r="4" fill="currentColor" />
                <circle cx="194" cy="24" r="4" fill="currentColor" />
              </svg>
              <Plane className="absolute h-5 w-5 text-emerald-500 dark:text-emerald-400 rotate-[35deg]" style={{ top: "34%", left: "46%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS BAR — overlaps the hero's bottom edge */}
      <div id="highlights" className="max-w-6xl mx-auto px-6 sm:px-8 -mt-14 relative z-10 scroll-mt-24">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { icon: Luggage, color: "text-emerald-600 bg-slate-100 dark:bg-slate-800", title: "AI Trip Planner", desc: "Get a personalized itinerary in seconds", action: () => setAiPlannerOpen(true) },
            { icon: Wallet, color: "text-emerald-600 bg-slate-100 dark:bg-slate-800", title: "Smart Budgeting", desc: "Plan your trip within your budget", action: () => setItineraryDrawerOpen(true) },
           
            { icon: CloudSun, color: "text-emerald-600 bg-slate-100 dark:bg-slate-800", title: "Real-time Updates", desc: "Live weather, alerts & travel updates", action: () => setIsMapOpen(true) },
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
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-24 space-y-16">

        {/* FILTER BAR */}
        <section id="explore" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">Explore by Scope</h2>
              <span className="block w-10 h-1 rounded-full bg-emerald-400 mt-1.5" />
            </div>
            <button
              onClick={() => setAllDestinationsOpen(true)}
              className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:gap-1.5 transition-all"
            >
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 space-y-8">
            
            {/* Scope Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                <Globe className="h-5 w-5 text-emerald-500" />
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
                    className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      scope === item
                        ? "bg-white dark:bg-slate-900 text-emerald-500 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {item === "India" ? "🇮🇳 India" : item === "International" ? "🌍 Foreign" : "🔥 Trending"}
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
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      activeCategory === cat
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                {/* Favorite Quick Filter Pill */}
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
                    showOnlyFavorites
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-rose-500"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${showOnlyFavorites ? "fill-current" : ""}`} />
                  Favorites ({favorites.length})
                </button>
              </div>

              
            </div>

          </div>

          {/* Destination rail — trending picks by default, or the live
              filter results once any filter/search is actually applied.
              A single horizontally-scrollable row (app-drawer style)
              instead of a full grid, or an empty state when a filter
              genuinely matches nothing. */}
          {cardsToShow.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {isDefaultView ? "Trending Destinations" : `${cardsToShow.length} destination${cardsToShow.length === 1 ? "" : "s"} found`}
                </p>
                {/* Scroll arrows — the rail's scrollbar is hidden for a
                    cleaner look, so these give mouse users (no trackpad)
                    an obvious way to move it, alongside touch/trackpad
                    swipe. */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => scrollRailBy(-340)}
                    aria-label="Scroll left"
                    className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollRailBy(340)}
                    aria-label="Scroll right"
                    className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div
                ref={railRef}
                key={railKey}
                className="tn-scroll-x tn-stagger-grid flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 sm:-mx-8 px-6 sm:px-8"
              >
                {cardsToShow.map((dest) => (
                  <div key={dest.id} className="snap-start shrink-0 w-[80vw] sm:w-[320px]">
                    <DestinationCard
                      dest={dest}
                      onAddToItinerary={handleAddToItinerary}
                      isFavorite={favorites.includes(dest.id)}
                      onToggleFavorite={handleToggleFavorite}
                      isCompared={compared.includes(dest.id)}
                      onToggleCompare={handleToggleCompare}
                      onOpenDetails={(d) => setSelectedModalDest(d)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="tn-modal-in flex flex-col items-center text-center gap-4 py-20 px-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <span className="tn-float p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                <Compass className="h-7 w-7" />
              </span>
              <div className="space-y-1.5">
                <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">No destinations match these filters</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Try a different category, region, or clear everything to see all {DESTINATIONS.length} destinations again.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="mt-1 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-colors active:scale-95"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

      </main>

      {/* ALL DESTINATIONS OVERLAY — opened via "View All" */}
      <AllDestinationsOverlay
        open={allDestinationsOpen}
        onClose={() => setAllDestinationsOpen(false)}
        destinations={DESTINATIONS}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        compared={compared}
        onToggleCompare={handleToggleCompare}
        onAddToItinerary={handleAddToItinerary}
        onOpenDetails={(d) => setSelectedModalDest(d)}
      />

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
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Existing Navbar, Main Content, Modals, etc. */}
      
      {/* 2. Add the User Experiences Section here */}
      <UserExperiences />

      {/* Existing Footer (if any) */}
    </div>
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
        travelCost={travelCost}
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