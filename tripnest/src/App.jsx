import React, { useState, useEffect } from "react";
import DestinationRail from "./components/Destinationrail";
import DestinationModal from "./components/DestinationModal";
import BookingModal from "./components/BookingModal";
import CompareDrawer from "./components/CompareDrawer";
import ItineraryDrawer from "./components/ItineraryDrawer";
import MapView from "./components/MapView";
import AllDestinationsOverlay from "./components/AllDestinationsOverlay";
import AITripPlanner from "./components/AITripPlanner";
import { DESTINATIONS } from "./data/destinations";
import { planItineraryForDestination } from "./services/aiService";
import UserExperiences from "./components/UserExperiences";
import Intro from "./components/Intro";
import { 
  MapPin, Search, Moon, Sun, 
  Filter, Globe, Heart, Luggage, Loader2, Menu, X as CloseIcon,
  Sparkles, Wallet, CloudSun, ArrowRight, Plane, Compass
} from "lucide-react";

const TRENDING_SEARCHES = ["Bali", "Switzerland", "Paris", "Goa", "Japan"];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600356033695-a003690a6351?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1600&q=80"
];

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  // Theme: an explicit user choice, persisted once made. Falls back to the
  // OS preference only on a first-ever visit (no saved choice yet) — after
  // that, the app's toggle is the single source of truth and never gets
  // silently overridden by a later system-theme change.
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("tripnest_theme");
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });
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
  const [bookingDest, setBookingDest] = useState(null);

  // Live Map Overlay State
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [allDestinationsOpen, setAllDestinationsOpen] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("tripnest_favorites") || "[]");
  });

  const [compared, setCompared] = useState([]);

  // Active Destination State (Destination Lock System)
  const [activeDestination, setActiveDestination] = useState(null);

  // Itinerary Drawer State
  const [itineraryDrawerOpen, setItineraryDrawerOpen] = useState(false);
  const [itineraryLoading, setItineraryLoading] = useState(false);

  // AI Trip Companion State
  const [aiPlannerOpen, setAiPlannerOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activitiesByDay, setActivitiesByDay] = useState(() => {
    return JSON.parse(localStorage.getItem("tripnest_activities") || "{}");
  });
  const [dayCount, setDayCount] = useState(() => {
    return Number(localStorage.getItem("tripnest_daycount")) || 0;
  });
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

  // Keep the `.dark` class on <html> — and thus every Tailwind `dark:`
  // utility class across the app — in lockstep with the theme state, and
  // persist the explicit choice so it survives reloads and never gets
  // reset by a later change to the OS-level theme.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("tripnest_theme", theme);
  }, [theme]);

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

  const indianDestinations = DESTINATIONS.filter((item) => item.country === "India");
  const foreignDestinations = DESTINATIONS.filter((item) => item.country !== "India");

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
    setTravelCost(trip.budgetBreakdown?.flightsOrTravel || 0);
  };

  const handleAddToItinerary = async (destination, formData) => {
    setActiveDestination(destination);
    setItineraryDrawerOpen(true);
    setItineraryLoading(true);
    try {
      const trip = await planItineraryForDestination(destination, formData);
      applyGeneratedTrip(trip);
    } catch (err) {
      console.error(err);
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

  const handleLockTrip = (trip) => {
    applyGeneratedTrip(trip);
    setItineraryDrawerOpen(true);
  };

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
        if (d === day) return;
        next[d > day ? d - 1 : d] = prev[d];
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

  const activitiesCost = Object.values(activitiesByDay).flat().reduce((sum, activity) => sum + (activity.cost || 0), 0);
  const totalBudget = activitiesCost + travelCost;

  
    return (
  <>
    {showIntro && (
      <Intro
        onComplete={() => setShowIntro(false)}
      />
    )}

    <div className={`tn-editorial min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      
      {/* HEADER — styled as a boarding-pass stub: it sits one shade off the
          page background and its bottom edge is punched with a row of
          page-colored notches (.tn-ticket-edge), so the whole app reads as
          "you're holding a ticket" from the very first pixel. */}
      <header className="tn-ticket-edge sticky top-0 z-40 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
          <a href="#" className="group flex items-center gap-2.5 shrink-0">
            <span className="p-2.5 bg-emerald-500 text-white transition-transform duration-300 group-hover:-rotate-6">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-slate-900 dark:text-white">Trip</span><span className="text-emerald-500">Nest</span>
            </span>
          </a>

          {/* Perforation stub + nav tabs, grouped so justify-between still
              only sees three top-level items (logo / tabs / actions). */}
          <div className="hidden md:flex items-center gap-6 flex-1 min-w-0 px-2">
            <div className="h-8 w-px shrink-0 border-l border-dashed border-slate-400/60 dark:border-slate-600/60" />
            <nav className="flex items-center gap-1 font-semibold text-sm text-slate-600 dark:text-slate-300">
              <a
                href="#explore"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Compass className="h-4 w-4" />
                Destinations
              </a>
              <a
                href="#experiences"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Sparkles className="h-4 w-4" />
                Experiences
              </a>
              <button
                onClick={() => setIsMapOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Globe className="h-4 w-4" />
                Live Map
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Utility dock — itinerary + theme grouped inside one pill so
                they read as a set of "traveler tools" rather than loose icons. */}
            <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-slate-300/70 dark:border-slate-700/70 p-1">
              <button
                onClick={() => setItineraryDrawerOpen(true)}
                className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="My itinerary"
                title="My Itinerary"
              >
                {itineraryLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Luggage className="h-5 w-5" />
                )}
                {activeDestination && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-slate-100 dark:ring-slate-900" />
                )}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors active:scale-90"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun key="sun" className="h-5 w-5 tn-pop-in" /> : <Moon key="moon" className="h-5 w-5 tn-pop-in" />}
              </button>
            </div>

            <button
              onClick={() => setAiPlannerOpen(true)}
              className="tn-shine group relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm active:translate-y-px transition-colors"
            >
              <Plane className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="hidden sm:inline">Plan with AI</span>
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileNavOpen && (
          <nav className="tn-nav-in md:hidden border-t border-dashed border-slate-400/60 dark:border-slate-600/60 bg-slate-100 dark:bg-slate-900 px-4 py-3 flex flex-col gap-1 font-semibold text-sm text-slate-600 dark:text-slate-300">
            <a
              href="#explore"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors"
            >
              <Compass className="h-4 w-4" /> Destinations
            </a>
            <a
              href="#experiences"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors"
            >
              <Sparkles className="h-4 w-4" /> Experiences
            </a>
            <button
              onClick={() => {
                setIsMapOpen(true);
                setMobileNavOpen(false);
              }}
              className="text-left flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors"
            >
              <Globe className="h-4 w-4" /> Live Map
            </button>
            <button
              onClick={() => {
                setItineraryDrawerOpen(true);
                setMobileNavOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors flex items-center gap-2"
            >
              <Luggage className="h-4 w-4" /> My Itinerary
            </button>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {HERO_IMAGES.map((imgSrc, index) => (
            <img
              key={imgSrc}
              src={imgSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover animate-bg-slide"
              style={{ animationDelay: `${index * 6}s` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-40% to-white/0 dark:from-slate-950 dark:via-slate-950/90 dark:via-40% dark:to-slate-950/0" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="max-w-xl space-y-6">
            <span
              className="tn-animate-in inline-flex items-center gap-2 px-0 py-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs tracking-[0.18em] uppercase border-b border-emerald-400/60"
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
                className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1.5"
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
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shrink-0 transition-colors flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>
            </div>

            {/* Trending destination chips */}
            <div className="tn-animate-in flex flex-wrap items-center gap-2 pt-1" style={{ animationDelay: "360ms" }}>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Trending Searches:</span>
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-1 px-0 py-1 border-b border-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
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

     {/* FEATURE HIGHLIGHTS BAR */}
<div id="highlights" className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 scroll-mt-24">
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-2 sm:p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
    {[
      { 
        icon: Luggage, 
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400", 
        title: "AI Trip Planner", 
        desc: "Get a personalized itinerary in seconds", 
        action: () => setAiPlannerOpen(true) 
      },
      { 
        icon: CloudSun, 
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400", 
        title: "Real-time Updates", 
        desc: "Live weather, alerts & travel updates", 
        action: () => setIsMapOpen(true) 
      },
    ].map(({ icon: Icon, color, title, desc, action }) => (
      <button
        key={title}
        onClick={action}
        className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 text-left w-full"
      >
        <span className={`p-3 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${color}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate">{title}</span>
            <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0" />
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

              <div className="flex border-b border-slate-300 dark:border-slate-700 w-full sm:w-auto">
                {["All", "India", "International"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setScope(item);
                      if (item !== "India") setSelectedRegion("All");
                      if (item !== "International") setSelectedContinent("All");
                    }}
                    className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold border-b-2 transition-all active:scale-95 ${
                      scope === item
                        ? "border-emerald-500 text-emerald-500"
                        : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {item === "India" ? "India" : item === "International" ? "Foreign" : "Trending"}
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
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-all active:scale-95 ${
                      activeCategory === cat
                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "border-transparent text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                {/* Favorite Quick Filter Pill */}
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all active:scale-95 flex items-center gap-1.5 ${
                    showOnlyFavorites
                      ? "border-rose-500 text-rose-500"
                      : "border-transparent text-rose-500"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${showOnlyFavorites ? "fill-current" : ""}`} />
                  Favorites ({favorites.length})
                </button>
              </div>
            </div>

          </div>

          {/* Destination rails */}
          {isDefaultView ? (
            <div className="space-y-10">
              <DestinationRail
                title="Trending Destinations"
                destinations={trendingDestinations}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                compared={compared}
                onToggleCompare={handleToggleCompare}
                onAddToItinerary={handleAddToItinerary}
                onOpenDetails={(d) => setSelectedModalDest(d)}
                railKey="trending"
              />
              <DestinationRail
                title="All Indian Destinations"
                destinations={indianDestinations}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                compared={compared}
                onToggleCompare={handleToggleCompare}
                onAddToItinerary={handleAddToItinerary}
                onOpenDetails={(d) => setSelectedModalDest(d)}
                railKey="indian"
              />
              <DestinationRail
                title="All Foreign Destinations"
                destinations={foreignDestinations}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                compared={compared}
                onToggleCompare={handleToggleCompare}
                onAddToItinerary={handleAddToItinerary}
                onOpenDetails={(d) => setSelectedModalDest(d)}
                railKey="foreign"
              />
            </div>
          ) : cardsToShow.length > 0 ? (
            <DestinationRail
              title={`${cardsToShow.length} destination${cardsToShow.length === 1 ? "" : "s"} found`}
              destinations={cardsToShow}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              compared={compared}
              onToggleCompare={handleToggleCompare}
              onAddToItinerary={handleAddToItinerary}
              onOpenDetails={(d) => setSelectedModalDest(d)}
              railKey={railKey}
            />
          ) : (
            <div className="tn-modal-in flex flex-col items-center text-center gap-4 py-20 px-6 border border-dashed border-slate-200 dark:border-slate-800">
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
                className="mt-1 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors active:scale-95"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

      </main>

      {/* USER EXPERIENCES SECTION */}
      <section id="experiences" className="scroll-mt-24 min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <UserExperiences />
      </section>

      {/* ALL DESTINATIONS OVERLAY */}
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

      {/* DETAIL MODAL */}
      <DestinationModal
        dest={selectedModalDest}
        onClose={() => setSelectedModalDest(null)}
        onAddToItinerary={handleAddToItinerary}
        onBookNow={(d) => setBookingDest(d)}
      />

      {/* BOOK NOW MODAL */}
      <BookingModal
        dest={bookingDest}
        open={!!bookingDest}
        onClose={() => setBookingDest(null)}
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
  </>
  );
}