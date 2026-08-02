import { useCallback, useEffect, useState } from "react"
import { 
  MapPin, Search, Moon, Sun, Menu, X, Compass, Calendar, Bookmark, 
  SunMedium, CloudRain, Snowflake, Sparkles, Plus, Trash2, CheckCircle2, DollarSign
} from "lucide-react"

/* ---------------------------------------------------------------------------
 * Sample Destination Data (Student 2's Module)
 * ------------------------------------------------------------------------- */
const DESTINATIONS = [
  {
    id: 1,
    name: "Santorini",
    country: "Greece",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    temp: "26°C",
    weather: "Sunny",
    budget: "$$",
    description: "Iconic white buildings, crystal blue waters, and breathtaking Aegean sunsets."
  },
  {
    id: 2,
    name: "Banff National Park",
    country: "Canada",
    category: "Mountains",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80",
    temp: "14°C",
    weather: "Cool",
    budget: "$$$",
    description: "Turquoise glacial lakes, snow-capped peaks, and endless mountain adventure."
  },
  {
    id: 3,
    name: "Kyoto Temples",
    country: "Japan",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    temp: "21°C",
    weather: "Pleasant",
    budget: "$$",
    description: "Ancient wooden temples, bamboo groves, and peaceful traditional gardens."
  },
  {
    id: 4,
    name: "Bali Coastal Escape",
    country: "Indonesia",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    temp: "29°C",
    weather: "Humid",
    budget: "$",
    description: "Lush tropical beaches, vibrant reefs, and spiritual clifftop sanctuaries."
  },
  {
    id: 5,
    name: "Swiss Alps (Zermatt)",
    country: "Switzerland",
    category: "Mountains",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    temp: "4°C",
    weather: "Snowy",
    budget: "$$$",
    description: "World-class skiing, scenic mountain railways, and views of the Matterhorn."
  },
  {
    id: 6,
    name: "Machu Picchu",
    country: "Peru",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    temp: "18°C",
    weather: "Cloudy",
    budget: "$$",
    description: "Mist-shrouded Incan citadel nestled high in the Andean cloud forest."
  }
]

/* ---------------------------------------------------------------------------
 * Theme Hook
 * ------------------------------------------------------------------------- */
function useTheme() {
  const [theme, setThemeState] = useState("light")

  useEffect(() => {
    const stored = window.localStorage.getItem("tripnest-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = stored || (prefersDark ? "dark" : "light")
    setThemeState(initial)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem("tripnest-theme", theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  return { theme, toggleTheme }
}

/* ---------------------------------------------------------------------------
 * Main App
 * ------------------------------------------------------------------------- */
export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [itinerary, setItinerary] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Filter Logic
  const filteredDestinations = DESTINATIONS.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.country.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToItinerary = (dest) => {
    if (!itinerary.find((i) => i.id === dest.id)) {
      setItinerary([...itinerary, dest])
    }
  }

  const removeFromItinerary = (id) => {
    setItinerary(itinerary.filter((i) => i.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ---------------- NAVIGATION BAR ---------------- */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-tr from-sky-500 to-emerald-400 text-white rounded-xl shadow-md">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Trip<span className="text-sky-500">Nest</span>
            </span>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-slate-600 dark:text-slate-300">
            <a href="#explore" className="hover:text-sky-500 transition-colors">Explore</a>
            <a href="#map" className="hover:text-sky-500 transition-colors">Interactive Map</a>
            <a href="#itinerary" className="hover:text-sky-500 transition-colors flex items-center gap-1">
              Itinerary
              {itinerary.length > 0 && (
                <span className="bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {itinerary.length}
                </span>
              )}
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 transition-transform"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold text-sm px-5 py-2 rounded-full shadow-md hover:opacity-90 transition-opacity">
              <Sparkles className="h-4 w-4" />
              Plan Trip
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-sky-100/60 via-slate-50 to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold text-xs uppercase tracking-wider">
            <Compass className="h-3.5 w-3.5 animate-spin-slow" /> AI-Powered Itinerary Planner
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Discover Your Next <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">Great Adventure</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Explore seasonal weather trends, dodge overcrowded hotspots with real-time map data, and customize day-by-day itineraries instantly.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center shadow-lg rounded-full overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5">
              <Search className="h-5 w-5 ml-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to go? (e.g., Bali, Canada...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm px-6 py-2.5 rounded-full transition-colors shrink-0">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

        {/* SECTION 1: DESTINATIONS & FILTERS (Student 2) */}
        <section id="explore" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Trending Destinations</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time weather and budget filters</p>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {["All", "Beaches", "Mountains", "Heritage"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-sky-500"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <div 
                key={dest.id}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image & Weather Tag */}
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    <SunMedium className="h-3.5 w-3.5 text-amber-400" />
                    <span>{dest.temp}</span>
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold px-2.5 py-1 rounded-md">
                    {dest.budget}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{dest.name}</h3>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{dest.country}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  {/* Add to Itinerary Button */}
                  <button
                    onClick={() => addToItinerary(dest)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sky-500/30 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 font-semibold text-xs hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 transition-all"
                  >
                    <Plus className="h-4 w-4" /> Add to Itinerary
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: MAP CONTAINER PLACEHOLDER (Student 3) */}
        <section id="map" className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Student 3 Component</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Interactive Live Weather & Traffic Map</h2>
            <p className="text-slate-300 text-sm">
              Avoid overcrowded tourist traps. View live crowd status, weather alerts, and navigation routes on an interactive Leaflet map.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" /> Low Traffic
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded-full border border-amber-500/30">
                <SunMedium className="h-3.5 w-3.5" /> Live Weather Feeds
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: ITINERARY DRAWER (Student 4) */}
        <section id="itinerary" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-sky-500" />
                Your Custom Itinerary
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Added destinations and activity planner</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              {itinerary.length} Saved
            </span>
          </div>

          {itinerary.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-slate-400 text-sm">No destinations added yet. Click "Add to Itinerary" on any place above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-xs">
                      Day {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.country} • {item.weather}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromItinerary(item.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}