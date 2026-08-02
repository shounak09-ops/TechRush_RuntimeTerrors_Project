import { useCallback, useEffect, useState } from "react"
import { 
  MapPin, Search, Moon, Sun, Menu, X, Compass, Calendar, 
  SunMedium, Plus, Trash2, CheckCircle2, Sparkles, Navigation
} from "lucide-react"

/* ---------------------------------------------------------------------------
 * Sample Destinations
 * ------------------------------------------------------------------------- */
const DESTINATIONS = [
  {
    id: 1,
    name: "Santorini",
    country: "Greece",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    temp: "26°C",
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
    budget: "$$",
    description: "Mist-shrouded Incan citadel nestled high in the Andean cloud forest."
  }
]

export default function App() {
  const [theme, setTheme] = useState("light")
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [itinerary, setItinerary] = useState([])

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light")

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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      
      {/* ---------------- CENTERED HEADER ---------------- */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
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
            <a href="#itinerary" className="hover:text-sky-500 transition-colors flex items-center gap-1.5">
              Itinerary
              {itinerary.length > 0 && (
                <span className="bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {itinerary.length}
                </span>
              )}
            </a>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 transition-transform"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ---------------- CENTERED HERO SECTION ---------------- */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs tracking-wider uppercase">
          <Compass className="h-4 w-4" /> Smart Travel Planner
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Explore the World with <br className="hidden sm:inline"/>
          <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
            Perfect Clarity
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Discover handpicked destinations, live weather updates, and personalized itineraries in one beautifully clean dashboard.
        </p>

        {/* Centered Search Bar */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg p-2">
            <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search destinations, countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors shrink-0 shadow-md">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- MAIN CONTAINER (MAX WIDTH + CENTERED) ---------------- */}
      <main className="max-w-6xl mx-auto px-6 pb-24 space-y-20">

        {/* SECTION 1: DESTINATION GRID */}
        <section id="explore" className="space-y-8">
          
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Trending Destinations</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Filtered by weather and budget ratings</p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {["All", "Beaches", "Mountains", "Heritage"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-sky-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid: 3 columns with even gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <div 
                key={dest.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                      <SunMedium className="h-3.5 w-3.5 text-amber-400" />
                      {dest.temp}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{dest.name}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{dest.budget}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => addToItinerary(dest)}
                    className="w-full py-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold text-xs border border-sky-200 dark:border-sky-800/50 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add to Itinerary
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: MAP BANNER (CENTERED CARD) */}
        <section id="map" className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Interactive Map Preview</span>
            <h2 className="text-3xl font-extrabold">Real-Time Traffic & Crowd Map</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Plan smarter routes around crowded tourist hotspots using real-time GPS density data.
            </p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 shrink-0 flex items-center gap-2 text-sm">
            <Navigation className="h-4 w-4" /> Open Map View
          </button>
        </section>

        {/* SECTION 3: CENTERED ITINERARY PLANNER */}
        <section id="itinerary" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-sky-500" />
              <div>
                <h2 className="text-xl font-bold">Your Saved Itinerary</h2>
                <p className="text-xs text-slate-500">Day-by-day trip breakdown</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
              {itinerary.length} Items Selected
            </span>
          </div>

          {itinerary.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Your itinerary is currently empty. Add places from the destinations above to start building your trip!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      D{index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500">{item.country}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromItinerary(item.id)} className="text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg">
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