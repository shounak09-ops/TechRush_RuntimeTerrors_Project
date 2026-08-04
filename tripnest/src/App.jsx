import React, { useState, useEffect } from "react";
import DestinationCard from "./components/DestinationCard";
import DestinationModal from "./components/DestinationModal";
import CompareDrawer from "./components/CompareDrawer";
import ItineraryDrawer from "./components/ItineraryDrawer";
import { DESTINATIONS } from "./data/destinations";
import { 
  MapPin, Search, Moon, Sun, Compass, 
  Trash2, Navigation, Filter, Globe, Heart, Bot
} from "lucide-react";
import html2pdf from 'html2pdf.js';

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
  
  const [itinerary, setItinerary] = useState(() => {
    return JSON.parse(localStorage.getItem("tripnest_itinerary") || "[]");
  });
  
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("tripnest_favorites") || "[]");
  });

  const [compared, setCompared] = useState([]);

  // Itinerary Drawer State
  const [itineraryDrawerOpen, setItineraryDrawerOpen] = useState(false);
  const [days, setDays] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("tripnest_days") || "[]");
    return saved.length > 0 ? saved : [1];
  });
  const [selectedDay, setSelectedDay] = useState(1);
  const [activitiesByDay, setActivitiesByDay] = useState(() => {
    return JSON.parse(localStorage.getItem("tripnest_activities") || "{}");
  });
  const [packingItems, setPackingItems] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("tripnest_packing") || "[]");
    if (saved.length > 0) return saved;
    
    // Default packing items with summer, winter, and general essentials
    return [
      // General Essentials
      { id: 1, label: "Passport/ID", category: "Documents", packed: false },
      { id: 2, label: "Travel insurance documents", category: "Documents", packed: false },
      { id: 3, label: "Wallet/Cash/Cards", category: "Documents", packed: false },
      { id: 4, label: "Phone charger", category: "Electronics", packed: false },
      { id: 5, label: "Power bank", category: "Electronics", packed: false },
      { id: 6, label: "Universal travel adapter", category: "Electronics", packed: false },
      { id: 7, label: "Toothbrush & toothpaste", category: "Toiletries", packed: false },
      { id: 8, label: "Shampoo & conditioner", category: "Toiletries", packed: false },
      { id: 9, label: "Sunscreen", category: "Toiletries", packed: false },
      { id: 10, label: "First aid kit", category: "Health", packed: false },
      { id: 11, label: "Prescription medications", category: "Health", packed: false },
      { id: 12, label: "Comfortable walking shoes", category: "Clothing", packed: false },
      { id: 13, label: "Underwear & socks", category: "Clothing", packed: false },
      
      // Summer Essentials
      { id: 14, label: "Light breathable t-shirts", category: "Clothing", packed: false },
      { id: 15, label: "Shorts", category: "Clothing", packed: false },
      { id: 16, label: "Sun hat/cap", category: "Clothing", packed: false },
      { id: 17, label: "Sunglasses", category: "Clothing", packed: false },
      { id: 18, label: "Sandals/flip-flops", category: "Clothing", packed: false },
      { id: 19, label: "Insect repellent", category: "Health", packed: false },
      { id: 20, label: "Light scarf/bandana", category: "Clothing", packed: false },
      { id: 21, label: "Deodorant", category: "Toiletries", packed: false },
      
      // Winter Essentials
      { id: 22, label: "Warm jacket/coat", category: "Clothing", packed: false },
      { id: 23, label: "Thermal underwear", category: "Clothing", packed: false },
      { id: 24, label: "Sweaters/hoodies", category: "Clothing", packed: false },
      { id: 25, label: "Warm gloves", category: "Clothing", packed: false },
      { id: 26, label: "Woolen hat/beanie", category: "Clothing", packed: false },
      { id: 27, label: "Scarf", category: "Clothing", packed: false },
      { id: 28, label: "Winter boots", category: "Clothing", packed: false },
      { id: 29, label: "Lip balm", category: "Toiletries", packed: false },
      { id: 30, label: "Hand warmers", category: "Health", packed: false },
    ];
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("tripnest_itinerary", JSON.stringify(itinerary));
  }, [itinerary]);

  useEffect(() => {
    localStorage.setItem("tripnest_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("tripnest_days", JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    localStorage.setItem("tripnest_activities", JSON.stringify(activitiesByDay));
  }, [activitiesByDay]);

  useEffect(() => {
    localStorage.setItem("tripnest_packing", JSON.stringify(packingItems));
  }, [packingItems]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  const handleToggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id) => {
    setCompared(prev => 
      prev.includes(id) ? prev.filter(compId => compId !== id) : [...prev, id]
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

  const addToItinerary = (dest) => {
    if (!itinerary.find((i) => i.id === dest.id)) {
      setItinerary([...itinerary, dest]);
      // Automatically add as an activity to the first day
      setActivitiesByDay(prev => ({
        ...prev,
        1: [...(prev[1] || []), {
          id: Date.now(),
          title: dest.name,
          location: dest.country,
          category: dest.category,
          cost: 0,
          destinationId: dest.id
        }]
      }));
    }
  };

  const removeFromItinerary = (id) => {
    setItinerary(itinerary.filter((i) => i.id !== id));
    // Also remove any activities associated with this destination
    setActivitiesByDay(prev => {
      const updated = {};
      for (const day in prev) {
        updated[day] = prev[day].filter(activity => activity.destinationId !== id);
      }
      return updated;
    });
  };

  // Itinerary Drawer Handlers
  const handleAddDay = () => {
    const newDay = Math.max(...days) + 1;
    setDays([...days, newDay]);
    setSelectedDay(newDay);
  };

  const handleRemoveDay = () => {
    if (days.length <= 1) return;
    const dayToRemove = days[days.length - 1];
    const newDays = days.slice(0, -1);
    setDays(newDays);
    if (selectedDay === dayToRemove) {
      setSelectedDay(newDays[newDays.length - 1]);
    }
    // Remove activities for the deleted day
    setActivitiesByDay(prev => {
      const updated = { ...prev };
      delete updated[dayToRemove];
      return updated;
    });
  };

  const handleAddActivity = (day, activity) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { ...activity, id: Date.now() }]
    }));
  };

  const handleRemoveActivity = (day, activityId) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(a => a.id !== activityId)
    }));
  };

  const handleTogglePacking = (id) => {
    setPackingItems(prev => 
      prev.map(item => item.id === id ? { ...item, packed: !item.packed } : item)
    );
  };

  const handleAddPacking = (item) => {
    setPackingItems(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const handleRemovePacking = (id) => {
    setPackingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleExportJSON = () => {
    const data = {
      itinerary,
      days,
      activitiesByDay,
      packingItems,
      favorites,
      compared
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tripnest-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all itinerary data?')) {
      setDays([1]);
      setSelectedDay(1);
      setActivitiesByDay({});
      setPackingItems([]);
      setItinerary([]);
    }
  };

  const totalBudget = Object.values(activitiesByDay).flat().reduce((sum, activity) => sum + (activity.cost || 0), 0);

  // PDF Export Function
  const handleExportPDF = () => {
    const element = document.createElement('div');
    
    // Trip Summary Header
    const packedCount = packingItems.filter((i) => i.packed).length;
    const totalItems = packingItems.length;
    const totalActivities = Object.values(activitiesByDay).flat().length;
    
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #333;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px;">
          <h1 style="color: #0ea5e9; margin: 0; font-size: 32px; font-weight: bold;">TripNest Travel Itinerary</h1>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Your complete travel planner summary</p>
        </div>

        <!-- Trip Summary -->
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #0ea5e9;">
          <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">Trip Summary</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div>
              <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: bold;">TOTAL BUDGET</p>
              <p style="margin: 5px 0 0 0; color: #0ea5e9; font-size: 24px; font-weight: bold;">$${totalBudget.toFixed(2)}</p>
            </div>
            <div>
              <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: bold;">DAYS PLANNED</p>
              <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">${days.length}</p>
            </div>
            <div>
              <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: bold;">TOTAL ACTIVITIES</p>
              <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">${totalActivities}</p>
            </div>
          </div>
        </div>

        <!-- Saved Destinations -->
        ${itinerary.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Saved Destinations</h2>
          <div style="display: grid; gap: 10px;">
            ${itinerary.map((dest, index) => `
              <div style="background: #fff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; align-items: center; gap: 15px;">
                <div style="background: #0ea5e9; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">${index + 1}</div>
                <div style="flex: 1;">
                  <p style="margin: 0; color: #1e293b; font-weight: bold; font-size: 16px;">${dest.name}</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">${dest.country}</p>
                </div>
                <span style="background: #dbeafe; color: #0ea5e9; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold;">${dest.category}</span>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Day-by-Day Itinerary -->
        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Day-by-Day Itinerary</h2>
          ${days.map(day => {
            const dayActivities = activitiesByDay[day] || [];
            if (dayActivities.length === 0) return '';
            return `
              <div style="margin-bottom: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #0ea5e9; font-size: 18px; font-weight: bold;">Day ${day}</h3>
                <div style="display: grid; gap: 10px;">
                  ${dayActivities.map(activity => `
                    <div style="background: #f8fafc; padding: 12px 15px; border-left: 3px solid #0ea5e9; border-radius: 4px;">
                      <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                          <p style="margin: 0; color: #1e293b; font-weight: bold; font-size: 15px;">${activity.title}</p>
                          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">📍 ${activity.location}</p>
                        </div>
                        <div style="text-align: right;">
                          <p style="margin: 0; color: #10b981; font-weight: bold; font-size: 15px;">$${(activity.cost || 0).toFixed(2)}</p>
                          <span style="background: #e0e7ff; color: #6366f1; padding: 2px 8px; border-radius: 8px; font-size: 10px; font-weight: bold;">${activity.category}</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
          ${Object.values(activitiesByDay).flat().length === 0 ? '<p style="color: #94a3b8; font-style: italic;">No activities planned yet.</p>' : ''}
        </div>

        <!-- Packing Checklist -->
        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Packing Checklist</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Progress: <strong>${packedCount}/${totalItems}</strong> items packed</p>
              <p style="margin: 0; color: #10b981; font-size: 14px; font-weight: bold;">${Math.round((packedCount / totalItems) * 100) || 0}% Complete</p>
            </div>
            <div style="display: grid; gap: 8px;">
              ${packingItems.map(item => `
                <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: ${item.packed ? '#10b981' : '#cbd5e1'}; font-size: 16px;">${item.packed ? '☑' : '☐'}</span>
                  <span style="flex: 1; color: ${item.packed ? '#94a3b8' : '#1e293b'}; text-decoration: ${item.packed ? 'line-through' : 'none'}; font-size: 14px;">${item.label}</span>
                  <span style="background: #e2e8f0; color: #64748b; padding: 2px 8px; border-radius: 4px; font-size: 11px;">${item.category}</span>
                </div>
              `).join('')}
            </div>
            ${packingItems.length === 0 ? '<p style="color: #94a3b8; font-style: italic;">No items in packing list.</p>' : ''}
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 5px 0 0 0;">Generated with TripNest - Your Smart Travel Companion</p>
        </div>
      </div>
    `;

    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'TripNest_Itinerary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    });
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
            <a href="#map" className="hover:text-sky-500 transition-colors">Live Map</a>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 transition-transform"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setItineraryDrawerOpen(true)}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:scale-105 transition-transform flex items-center gap-2 px-4"
          >
            <Bot className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold text-sm">Companion</span>
            {itinerary.length > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {itinerary.length}
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
          <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
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
                {["All", "Heritage", "Beaches", "Mountains", "Wildlife"].map((cat) => (
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
                onAddToItinerary={addToItinerary}
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

      {/* DETAIL MODAL */}
      <DestinationModal
        dest={selectedModalDest}
        onClose={() => setSelectedModalDest(null)}
        onAddToItinerary={addToItinerary}
      />

      {/* COMPARE DRAWER */}
      <CompareDrawer
        comparedItems={comparedObjects}
        onRemoveCompare={handleToggleCompare}
        onClearAll={() => setCompared([])}
        theme={theme}
      />

      {/* ITINERARY DRAWER */}
      <ItineraryDrawer
        open={itineraryDrawerOpen}
        onClose={() => setItineraryDrawerOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        days={days}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onAddDay={handleAddDay}
        onRemoveDay={handleRemoveDay}
        activitiesByDay={activitiesByDay}
        onAddActivity={handleAddActivity}
        onRemoveActivity={handleRemoveActivity}
        totalBudget={totalBudget}
        packingItems={packingItems}
        onTogglePacking={handleTogglePacking}
        onAddPacking={handleAddPacking}
        onRemovePacking={handleRemovePacking}
        onExportJSON={handleExportJSON}
        onExportPDF={handleExportPDF}
        onClearAll={handleClearAll}
        itinerary={itinerary}
        onRemoveFromItinerary={removeFromItinerary}
      />

    </div>
  );
}