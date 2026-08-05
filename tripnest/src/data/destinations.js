export const DESTINATIONS = [
  // --- FOREIGN / INTERNATIONAL DESTINATIONS ---
  {
    id: "paris-france",
    name: "Paris",
    category: "Culture",
    continent: "Europe",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    temp: "18°C",
    bestTime: "Apr - Oct",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The City of Light captivates with iconic architecture, world-class art collections, and charming cafe culture along the Seine.",
    highlights: [
      "Eiffel Tower sunset viewing & picnic",
      "Louvre Museum & Musée d'Orsay tours",
      "Strolling through Montmartre and Le Marais",
      "Seine River dinner cruise"
    ],
    suggestedDays: 5,
    recommendedPacking: ["Comfortable walking shoes", "Universal adapter", "Light raincoat", "Smart casual evening wear"],
    insiderTip: "Book Louvre tickets weeks in advance and enter via the Porte de Lille entrance to skip the glass pyramid line."
  },
  {
    id: "tokyo-japan",
    name: "Tokyo",
    category: "Metropolis",
    continent: "Asia",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503,
    temp: "22°C",
    bestTime: "Mar - May, Sep - Nov",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An extraordinary blend of ultra-modern skyscrapers, neon-lit alleys, ancient Shinto shrines, and world-renowned culinary experiences.",
    highlights: [
      "Shibuya Crossing & Harajuku street food",
      "Senso-ji Temple in historic Asakusa",
      "TeamLab Planets immersive digital art",
      "Day trip to Mount Fuji & Lake Kawaguchiko"
    ],
    suggestedDays: 6,
    recommendedPacking: ["Easy slip-on shoes", "Suica/Pasmo transit card", "Portable power bank", "Pocket Wi-Fi / eSIM"],
    insiderTip: "Convenience stores (7-Eleven, Lawson) have gourmet quality meals and low-fee ATMs for international card withdrawals."
  },
  {
    id: "bali-indonesia",
    name: "Bali",
    category: "Beaches",
    continent: "Asia",
    country: "Indonesia",
    lat: -8.3405,
    lon: 115.092,
    temp: "29°C",
    bestTime: "Apr - Oct",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Island of the Gods known for lush terraced rice paddies, volcanic mountains, vibrant coral reefs, and spiritual yoga retreats.",
    highlights: [
      "Tegallalang Rice Terraces in Ubud",
      "Uluwatu Temple sunset & Kecak Fire Dance",
      "Snorkeling and diving off Nusa Penida",
      "Sunrise trek up Mount Batur"
    ],
    suggestedDays: 7,
    recommendedPacking: ["Reef-safe sunscreen", "Lightweight cotton wear", "Temple cover-up sarong", "Insect repellent"],
    insiderTip: "Rent a scooter or hire a private driver for full-day excursions—local ride-hailing apps can be restricted in traditional villages."
  },
  {
    id: "rome-italy",
    name: "Rome",
    category: "Heritage",
    continent: "Europe",
    country: "Italy",
    lat: 41.9028,
    lon: 12.4964,
    temp: "24°C",
    bestTime: "Apr - Jun, Sep - Oct",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An open-air museum filled with nearly 3,000 years of globally influential art, architecture, and ancient Roman ruins.",
    highlights: [
      "Colosseum & Roman Forum underground tour",
      "Vatican Museums & Sistine Chapel",
      "Trevi Fountain throw-a-coin tradition",
      "Authentic pasta tasting in Trastevere"
    ],
    suggestedDays: 4,
    recommendedPacking: ["Refillable water bottle", "Sturdy walking shoes", "Modest clothing for churches", "Sunglasses"],
    insiderTip: "Drink from the public fountains (nasoni) for crisp, cold running spring water across the entire city."
  },
  {
    id: "swiss-alps",
    name: "Interlaken & Swiss Alps",
    category: "Mountains",
    continent: "Europe",
    country: "Switzerland",
    lat: 46.6863,
    lon: 7.8632,
    temp: "12°C",
    bestTime: "Dec - Mar (Ski) / Jun - Sep (Hike)",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Breathtaking alpine vistas, crystalline glacial lakes, high-altitude train journeys, and world-class hiking trails.",
    highlights: [
      "Jungfraujoch - Top of Europe railway",
      "Paragliding over Interlaken lakes",
      "Hiking First Cliff Walk in Grindelwald",
      "Scenic Lake Thun boat cruise"
    ],
    suggestedDays: 5,
    recommendedPacking: ["Thermal base layers", "Hiking boots", "Polarized sunglasses", "Windproof jacket"],
    insiderTip: "Purchase a Swiss Travel Pass—it grants unlimited rides on trains, buses, mountain boats, and discounts on cable cars."
  },
  {
    id: "dubai-uae",
    name: "Dubai",
    category: "Metropolis",
    continent: "Asia",
    country: "United Arab Emirates",
    lat: 25.2048,
    lon: 55.2708,
    temp: "33°C",
    bestTime: "Nov - Mar",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A futuristic desert oasis boasting ultra-tall skyscrapers, extravagant shopping malls, luxury beach resorts, and desert safaris.",
    highlights: [
      "Burj Khalifa observation deck view",
      "Desert dune bashing & Bedouin camp dinner",
      "Museum of the Future tour",
      "Dubai Fountain show & Mall shopping"
    ],
    suggestedDays: 4,
    recommendedPacking: ["Light breathable linen", "Sunglasses", "Sunscreen", "Smart evening attire"],
    insiderTip: "Use the clean and cheap Dubai Metro system to easily bypass heavy road traffic between major attractions."
  },
  {
    id: "new-york-usa",
    name: "New York City",
    category: "Metropolis",
    continent: "Americas",
    country: "United States",
    lat: 40.7128,
    lon: -74.006,
    temp: "20°C",
    bestTime: "Apr - Jun, Sep - Nov",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The global hub of culture, entertainment, and fashion—renowned for soaring skyscrapers, Broadway theatre, and vibrant neighborhoods.",
    highlights: [
      "Central Park bike ride & picnic",
      "Broadway show in Times Square",
      "Statue of Liberty & Ellis Island ferry",
      "Walking the Brooklyn Bridge at sunset"
    ],
    suggestedDays: 5,
    recommendedPacking: ["Comfortable walking sneakers", "Layered outerwear", "MetroCard / Contactless card", "Small crossbody bag"],
    insiderTip: "Tap to pay directly at subway turnstiles using your contactless bank card or smartphone wallet via OMNY."
  },
  {
    id: "singapore",
    name: "Singapore",
    category: "Metropolis",
    continent: "Asia",
    country: "Singapore",
    lat: 1.3521,
    lon: 103.8198,
    temp: "30°C",
    bestTime: "Year-round",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A lush garden city combining futuristic marvels, diverse cultures, botanical sanctuaries, and world-class street food.",
    highlights: [
      "Gardens by the Bay & Supertree Grove light show",
      "Marina Bay Sands skypark observation deck",
      "Hawker center food tour in Chinatown & Maxwell",
      "Sentosa Island beach resort day trip"
    ],
    suggestedDays: 4,
    recommendedPacking: ["Light cotton shirts", "Compact umbrella", "Refillable water bottle", "Walking sandals"],
    insiderTip: "Eat at Michelin-recognized hawker stalls like Lau Pa Sat or Chinatown Complex for top-tier local dishes under $10."
  },
  {
    id: "santorini-greece",
    name: "Santorini",
    category: "Beaches",
    continent: "Europe",
    country: "Greece",
    lat: 36.3932,
    lon: 25.4615,
    temp: "25°C",
    bestTime: "Late Apr - Oct",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An Aegean island dream characterized by cliffside whitewashed villages, iconic blue-domed churches, and stunning sunsets.",
    highlights: [
      "Sunset watching in Oia village",
      "Catamaran cruise around caldera volcanic springs",
      "Exploring Red Beach & Ancient Akrotiri ruins",
      "Wine tasting at cliffside vineyards"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Sun hat & sunglasses", "Grip-sole walking shoes for cobbles", "Swimwear", "Light jacket for windy nights"],
    insiderTip: "Avoid midday cruise crowds in Oia by exploring the narrow alleyways early in the morning before 10 AM."
  },
  {
    id: "cairo-egypt",
    name: "Cairo & Giza",
    category: "Heritage",
    continent: "Africa",
    country: "Egypt",
    lat: 30.0444,
    lon: 31.2357,
    temp: "27°C",
    bestTime: "Oct - Apr",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The gateway to antiquity, where ancient wonders like the Great Pyramids stand alongside the bustling life of the Nile valley.",
    highlights: [
      "Giza Pyramids & Great Sphinx guided tour",
      "Grand Egyptian Museum pharaonic treasures",
      "Sunset Felucca sailing boat ride on the Nile",
      "Khan el-Khalili historic bazaar shopping"
    ],
    suggestedDays: 4,
    recommendedPacking: ["Modest lightweight clothing", "Wide-brim hat", "Sunscreen", "Cash in local currency"],
    insiderTip: "Hire an official licensed Egyptologist guide for the Pyramids to ensure smooth entry and avoid aggressive street vendors."
  },
  {
    id: "sydney-australia",
    name: "Sydney",
    category: "Beaches",
    continent: "Oceania",
    country: "Australia",
    lat: -33.8688,
    lon: 151.2093,
    temp: "23°C",
    bestTime: "Sep - Nov, Feb - Apr",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523428096881-5bd79d04300f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A harbor metropolis where striking modern architecture meets world-famous surf beaches, national parks, and coastal walks.",
    highlights: [
      "Sydney Opera House guided tour & concert",
      "Bondi to Coogee coastal cliff walk",
      "Sydney Harbour ferry ride to Manly",
      "Day trip to the Blue Mountains"
    ],
    suggestedDays: 5,
    recommendedPacking: ["High-SPF broad spectrum sunscreen", "Beachwear", "Comfortable walking shoes", "Sunglasses"],
    insiderTip: "Take the public Manly Ferry from Circular Quay for harbor views at a fraction of the cost of commercial tour cruises."
  },
  {
    id: "queenstown-newzealand",
    name: "Queenstown",
    category: "Adventure",
    continent: "Oceania",
    country: "New Zealand",
    lat: -45.0312,
    lon: 168.6626,
    temp: "15°C",
    bestTime: "Dec - Feb (Summer) / Jun - Aug (Ski)",
    image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The adventure capital of the world, nestled along Lake Wakatipu with alpine peaks and thrill-seeking outdoor sports.",
    highlights: [
      "Milford Sound fjord scenic day cruise",
      "Skyline Gondola ride & Luge track",
      "Bungee jumping or Shotover Jet boat experience",
      "Wine tasting tours in Central Otago"
    ],
    suggestedDays: 5,
    recommendedPacking: ["Sturdy hiking shoes", "Windproof jacket", "Layered thermal clothing", "Camera"],
    insiderTip: "Book your Milford Sound excursion well in advance—choosing a small boat tour gets you much closer to the cliff waterfalls."
  },

  // --- INDIAN DESTINATIONS ---
  {
    id: "ladakh-india",
    name: "Leh Ladakh",
    category: "Mountains",
    region: "North",
    continent: "Asia",
    country: "India",
    lat: 34.1526,
    lon: 77.5771,
    temp: "10°C",
    bestTime: "May - Sep",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "High-altitude desert wonderland featuring azure lakes, rugged mountain passes, and historic Buddhist monasteries.",
    highlights: [
      "Pangong Tso & Nubra Valley double-humped camel safari",
      "Driving through Khardung La Pass",
      "Thiksey and Hemis Monastery spiritual tours",
      "Stargazing at Hanle Observatory reserve"
    ],
    suggestedDays: 7,
    recommendedPacking: ["Heavy thermals", "Hydration pack", "High-SPF sunscreen", "Diamox / Altitude medication"],
    insiderTip: "Dedicating the first 24 to 48 hours strictly to resting in Leh is essential for safe acclimatization."
  },
  {
    id: "kerala-backwaters",
    name: "Alleppey & Munnar",
    category: "Nature",
    region: "South",
    continent: "Asia",
    country: "India",
    lat: 9.4981,
    lon: 76.3388,
    temp: "26°C",
    bestTime: "Sep - Mar",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Tranquil tropical paradise known for emerald tea gardens, palm-fringed backwater canals, and luxury houseboat cruises.",
    highlights: [
      "Overnight houseboat stay through Punnamada Lake",
      "Munnar tea estate walks & museum tours",
      "Ayurvedic wellness therapy massages",
      "Kathakali cultural performance"
    ],
    suggestedDays: 5,
    recommendedPacking: ["Light cotton clothing", "Mosquito repellent", "Comfortable sandals", "Camera with extra batteries"],
    insiderTip: "Hire a traditional canoe or shikara through smaller inner canals where large houseboats cannot fit."
  },
  {
    id: "kaziranga-india",
    name: "Kaziranga National Park",
    category: "Wildlife",
    continent: "Asia",
    country: "India",
    lat: 26.5775,
    lon: 93.1711,
    temp: "24°C",
    bestTime: "Nov - Apr",
    image: "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A UNESCO World Heritage site home to two-thirds of the world's great one-horned rhinoceroses, sprawling across tall elephant grass and marshlands.",
    highlights: [
      "Jeep safari in Central Range",
      "Early morning elephant safari",
      "Birdwatching along Diphlu River",
      "Visiting the Kaziranga Orchid Park"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Neutral tone safari clothing", "Binoculars", "Insect repellent", "Telephoto lens camera"],
    insiderTip: "Book Kohora (Central) and Bagori (Western) ranges for the highest density of rhino sightings."
  },
  {
    id: "jim-corbett-india",
    name: "Jim Corbett National Park",
    category: "Wildlife",
    continent: "Asia",
    country: "India",
    lat: 29.5300,
    lon: 78.7747,
    temp: "22°C",
    bestTime: "Nov - Jun",
    image: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "India's oldest national park nestled in the Himalayan foothills, famed for Bengal tigers, wild elephants, and dense sal forests.",
    highlights: [
      "Dhikala zone overnight wilderness stay",
      "Safaris along the Kosi River",
      "Corbett Falls & Heritage Museum",
      "Birdwatching in Bijrani zone"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Sturdy boots", "Warm layers for early mornings", "Sun hat & UV sunglasses", "Safari dust mask"],
    insiderTip: "Stay overnight inside the Forest Rest House in the Dhikala zone for the rawest jungle experience."
  },
  {
    id: "gir-national-park-india",
    name: "Gir National Park",
    category: "Wildlife",
    continent: "Asia",
    country: "India",
    lat: 21.1243,
    lon: 70.8242,
    temp: "28°C",
    bestTime: "Dec - Mar",
    image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The sole remaining natural habitat of the Asiatic Lion, featuring rugged dry deciduous forests and rocky hill ridges.",
    highlights: [
      "Asiatic Lion tracking safari",
      "Devalia Safari Park zone tour",
      "Visiting Kamleshwar Dam for marsh crocodiles",
      "Interacting with local Maldhari tribes"
    ],
    suggestedDays: 2,
    recommendedPacking: ["Dust scarf or bandana", "Earthy colored cottons", "High SPF sunscreen", "Reusable water bottle"],
    insiderTip: "Permits open 90 days prior online—book early as daily vehicle slots are strictly capped."
  },
  {
    id: "kabini-india",
    name: "Kabini Forest Reserve",
    category: "Wildlife",
    continent: "Asia",
    country: "India",
    lat: 11.9261,
    lon: 76.2711,
    temp: "25°C",
    bestTime: "Oct - May",
    image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A premier wildlife sanctuary in Southern India famous for leopards, black panthers, and massive herds of Asian elephants along the Kabini River.",
    highlights: [
      "Kabini River boat safari",
      "Nagarhole National Park jeep drive",
      "Coracle ride at sunset",
      "Luxury jungle lodge stays"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Light jacket for boat trips", "Binoculars", "Neutral tone attire", "Moisturizer & lip balm"],
    insiderTip: "Take the morning boat safari along the backwaters to see massive elephant herds gathering at the water's edge."
  },
  {
    id: "mahabalipuram-india",
    name: "Mahabalipuram",
    category: "Heritage",
    continent: "Asia",
    country: "India",
    lat: 12.6269,
    lon: 80.1927,
    temp: "29°C",
    bestTime: "Nov - Feb",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A coastal town renowned for 7th and 8th-century Hindu monuments, monolithic rock-cut cave temples, and coastal relief sculptures.",
    highlights: [
      "Shore Temple sunrise view",
      "Pancha Rathas monolithic temples",
      "Descent of the Ganges relief",
      "Krishna's Butterball rock balance photo"
    ],
    suggestedDays: 2,
    recommendedPacking: ["Breathable cotton clothes", "Slip-on shoes for temple entry", "Sun hat & sunglasses", "Beachwear"],
    insiderTip: "Hire an ASI-registered guide at Pancha Rathas to unlock the intricate architectural stories etched into the granite."
  },
  {
    id: "hampta-pass-india",
    name: "Hampta Pass",
    category: "Mountains",
    continent: "Asia",
    country: "India",
    lat: 32.2227,
    lon: 77.3639,
    temp: "12°C",
    bestTime: "Jun - Sep",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A dramatic crossover trek in Himachal Pradesh connecting the lush green Kullu Valley to the stark, arid landscapes of Lahaul Valley.",
    highlights: [
      "Crossing the 14,000 ft Hampta Pass",
      "Camping under stars at Shea Goru",
      "Visiting pristine Chandratal Lake",
      "Trekking through flower-blooming valleys"
    ],
    suggestedDays: 5,
    recommendedPacking: ["Trekking poles", "Waterproof hiking boots", "Thermals & down jacket", "Personal medical kit"],
    insiderTip: "Monsoon months (July-August) bring lush valley blooms, but bring reliable rain cover for your gear."
  },
  {
    id: "sikkim-india",
    name: "Sikkim",
    category: "Mountains",
    continent: "Asia",
    country: "India",
    lat: 27.5330,
    lon: 88.5122,
    temp: "15°C",
    bestTime: "Mar - May, Oct - Dec",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A Himalayan haven framed by Mount Kanchenjunga, featuring high-altitude glacial lakes, ancient Buddhist monasteries, and organic alpine valleys.",
    highlights: [
      "Tsomgo Lake & Nathula Pass day trip",
      "Visiting Rumtek & Pemayangtse Monasteries",
      "Exploring Yumthang Valley of Flowers",
      "Sunrise views over Kanchenjunga from Pelling"
    ],
    suggestedDays: 7,
    recommendedPacking: ["Warm thermals & fleece", "ILP (Inner Line Permit) documents", "Motion sickness medicine", "Comfortable walking shoes"],
    insiderTip: "Nathula Pass requires a special Protected Area Permit (PAP); arrange this with your agent at least two days in advance."
  },
  {
    id: "puri-india",
    name: "Puri",
    category: "Heritage",
    continent: "Asia",
    country: "India",
    lat: 19.8135,
    lon: 85.8312,
    temp: "27°C",
    bestTime: "Oct - Feb",
    image: "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A sacred coastal city on the Bay of Bengal, world-renowned for the 12th-century Jagannath Temple and long golden sand beaches.",
    highlights: [
      "Darshan at Jagannath Temple",
      "Golden Beach relaxing & strolls",
      "Day trip to Konark Sun Temple",
      "Irrawaddy dolphin sighting at Chilika Lake"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Modest traditional clothing for temples", "Flip flops", "Sunscreen & hat", "Small cotton pouch for temple offerings"],
    insiderTip: "Non-Hindus cannot enter the inner sanctum of Jagannath Temple, but can view the complex from the nearby Raghunandan Library roof."
  },
  {
    id: "gujarat-india",
    name: "Gujarat",
    category: "Heritage",
    continent: "Asia",
    country: "India",
    lat: 22.2587,
    lon: 71.1924,
    temp: "26°C",
    bestTime: "Nov - Feb",
    image: "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A culturally vibrant western state known for historic stepwells, Mahatma Gandhi's legacy, intricate textiles, and distinct regional cuisine.",
    highlights: [
      "Sabarmati Ashram in Ahmedabad",
      "Rani ki Vav stepwell in Patan",
      "Statue of Unity visit in Kevadia",
      "Sun Temple of Modhera"
    ],
    suggestedDays: 6,
    recommendedPacking: ["Light cotton outfits", "Comfortable walking shoes", "Sun protection", "Extra luggage space for handicrafts"],
    insiderTip: "Combine Ahmedabad's heritage walking tour with a traditional Gujarati Thali lunch in the old city."
  },
  {
    id: "rann-of-kutch-india",
    name: "Rann of Kutch",
    category: "Desert & Culture",
    continent: "Asia",
    country: "India",
    lat: 23.7337,
    lon: 69.8597,
    temp: "20°C",
    bestTime: "Nov - Feb",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "One of the world's largest salt deserts, transforming into an ethereal white expanse under full moon nights and hosting the vibrant Rann Utsav.",
    highlights: [
      "Full moon night walk on the salt desert",
      "Rann Utsav tent city cultural performances",
      "Kalo Dungar (Black Hill) panoramic view",
      "Handicraft shopping in Bhujodi village"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Heavy jacket for cold desert nights", "Sunglasses for intense white salt glare", "Moisturizer", "Permit identification copy"],
    insiderTip: "Plan your trip specifically around the full moon night to watch the salt desert glow under natural moonlight."
  },
  {
    id: "moscow-russia",
    name: "Moscow",
    category: "Metropolis",
    continent: "Europe",
    country: "Russia",
    lat: 55.7558,
    lon: 37.6173,
    temp: "8°C",
    bestTime: "May - Sep",
    image: "https://images.unsplash.com/photo-1513326718677-b964603b136d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1513326718677-b964603b136d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Russia's iconic capital showcasing grand Red Square architecture, onion-domed cathedrals, underground palace-like metro stations, and rich history.",
    highlights: [
      "Red Square & St. Basil's Cathedral",
      "Kremlin & Armoury Museum tour",
      "Exploring decorated Moscow Metro stations",
      "Bolshoi Theatre ballet performance"
    ],
    suggestedDays: 4,
    recommendedPacking: ["Warm layers & coat", "Comfortable walking boots", "Power bank", "Translation app on phone"],
    insiderTip: "Buy a Troika card to easily hop between Moscow's underground metro stations, which double as underground art museums."
  },
  {
    id: "masai-mara-kenya",
    name: "Masai Mara",
    category: "Wildlife",
    continent: "Africa",
    country: "Kenya",
    lat: -1.4061,
    lon: 35.0085,
    temp: "25°C",
    bestTime: "Jul - Oct",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A world-famous savannah wilderness preserved for big cat sightings and the epic annual Great Migration of wildbeest and zebras.",
    highlights: [
      "Witnessing the Great Migration river crossing",
      "Hot air balloon safari over savannah",
      "Big Five wildlife game drives",
      "Cultural visit to a Maasai Village"
    ],
    suggestedDays: 4,
    recommendedPacking: ["Neutral canvas layers", "Good binoculars", "Telephoto lens kit", "Insect repellent & sun hat"],
    insiderTip: "Book a hot air balloon safari early morning for breathtaking sunrise views of game herds moving across the Mara plains."
  },
  {
    id: "jaipur-india",
    name: "Jaipur",
    category: "Heritage",
    region: "North",
    continent: "Asia",
    country: "India",
    lat: 26.9124,
    lon: 75.7873,
    temp: "28°C",
    bestTime: "Oct - Mar",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The Royal Pink City showcasing majestic hill forts, opulent royal palaces, and vibrant bazaar shopping.",
    highlights: [
      "Amber Fort grand ramparts & Sheesh Mahal",
      "Hawa Mahal (Palace of Winds) facade photo stop",
      "City Palace & Jantar Mantar observatory",
      "Bazaars shopping for textiles, jewelry & block prints"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Sun hat", "Breathable fabrics", "Comfortable walking shoes", "Extra bag for artisan shopping"],
    insiderTip: "Visit Nahargarh Fort right before sunset for a panoramic view of the entire city lighting up."
  },
  {
    id: "goa-india",
    name: "Goa",
    category: "Beaches",
    region: "West",
    continent: "Asia",
    country: "India",
    lat: 15.2993,
    lon: 74.124,
    temp: "31°C",
    bestTime: "Nov - Feb",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "India's coastal haven featuring golden beaches, Portuguese heritage architecture, water sports, and lively nightlife.",
    highlights: [
      "Water sports at Calangute & Baga beaches",
      "Exploring Fontainhas Portuguese Latin Quarter",
      "Dudhsagar Waterfalls jeep safari",
      "Sunset beach shacks & seafood dining"
    ],
    suggestedDays: 4,
    recommendedPacking: ["Swimwear", "Flip flops", "Waterproof phone pouch", "Sunscreen"],
    insiderTip: "Head to South Goa (Palolem, Agonda) for serene, quiet beaches, and North Goa for nightlife and water activities."
  },
  {
    id: "varanasi-india",
    name: "Varanasi",
    category: "Heritage",
    region: "North",
    continent: "Asia",
    country: "India",
    lat: 25.3176,
    lon: 82.9739,
    temp: "25°C",
    bestTime: "Oct - Mar",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "One of the world's oldest continually inhabited cities, renowned for spiritual ghats along the sacred Ganges river.",
    highlights: [
      "Evening Ganga Aarti ceremony at Dashashwamedh Ghat",
      "Sunrise wooden boat ride along the Ganges ghats",
      "Exploring narrow heritage alleys & Banarasi silk weaving",
      "Excursion to Sarnath Buddhist stupas"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Modest clothing", "Slip-on shoes for temple visits", "Hand sanitizer", "Camera"],
    insiderTip: "Take the sunrise boat ride from Assi Ghat to Manikarnika Ghat for the best photographic light and atmospheric tranquility."
  },
  {
    id: "taj-mahal-agra",
    name: "Agra & Taj Mahal",
    category: "Heritage",
    region: "North",
    continent: "Asia",
    country: "India",
    lat: 27.1751,
    lon: 78.0421,
    temp: "27°C",
    bestTime: "Oct - Mar",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Home to the world's grandest monument to love, surrounded by rich Mughal architectural landmarks.",
    highlights: [
      "Sunrise viewing of the Taj Mahal",
      "Exploring Agra Fort red sandstone palaces",
      "Sunset view across the Yamuna from Mehtab Bagh",
      "Day trip to Fatehpur Sikri ghost city"
    ],
    suggestedDays: 2,
    recommendedPacking: ["Sun hat", "Comfortable walking shoes", "Valid photo ID", "Water bottle"],
    insiderTip: "Arrive at the Taj Mahal East Gate 30 minutes before sunrise to be first in line and avoid long queues."
  },
  {
    id: "kashmir-valley",
    name: "Srinagar & Gulmarg",
    category: "Nature",
    region: "North",
    continent: "Asia",
    country: "India",
    lat: 34.0837,
    lon: 74.7973,
    temp: "14°C",
    bestTime: "Apr - Oct (Greenery) / Dec - Feb (Snow)",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617868186608-87ae598cb729?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Heaven on Earth featuring serene mirror lakes, wooden houseboats, lush alpine meadows, and world-class ski slopes.",
    highlights: [
      "Shikara ride on Dal Lake & floating vegetable market",
      "Gulmarg Gondola cable car ride to Apharwat Peak",
      "Strolling Shalimar & Nishat Bagh Mughal Gardens",
      "Overnight stay on a carved wooden houseboat"
    ],
    suggestedDays: 5,
    recommendedPacking: ["Warm woolens / layers", "Waterproof jacket", "Grip shoes", "Moisturizer"],
    insiderTip: "Book phase 2 Gulmarg Gondola tickets online well in advance as daily tickets are strictly limited."
  },
  {
    id: "andaman-islands",
    name: "Andaman Islands",
    category: "Beach",
    region: "South",
    continent: "Asia",
    country: "India",
    lat: 11.7401,
    lon: 92.6586,
    temp: "29°C",
    bestTime: "Oct - May",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Pristine tropical archipelago offering turquoise ocean waters, white sand beaches, coral reef diving, and dense rainforests.",
    highlights: [
      "Radhanagar Beach sunset walk on Havelock Island",
      "Scuba diving & bioluminescent night kayaking",
      "Cellular Jail light & sound historical show",
      "Elephant Beach water sports & sea walking"
    ],
    suggestedDays: 6,
    recommendedPacking: ["Reef-safe sunscreen", "Snorkel gear", "Waterproof phone case", "Light cotton clothes"],
    insiderTip: "Book inter-island private ferry tickets (Makruzz / Nautika) early to guarantee comfortable seating between islands."
  },
  {
    id: "meghalaya-shillong",
    name: "Shillong & Cherrapunji",
    category: "Nature",
    region: "East",
    continent: "Asia",
    country: "India",
    lat: 25.5788,
    lon: 91.8933,
    temp: "19°C",
    bestTime: "Oct - Apr",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The Abode of Clouds featuring living root bridges, cascading waterfalls, crystal-clear rivers, and limestone cave networks.",
    highlights: [
      "Trekking to the Double Decker Living Root Bridge in Nongriat",
      "Boating on the glass-like waters of Dawki River",
      "Nohkalikai & Seven Sisters Waterfalls viewing",
      "Exploring Mawsmai & Arwah limestone caves"
    ],
    suggestedDays: 5,
    recommendedPacking: ["Trekking shoes with good grip", "Rainwear / poncho", "Quick-dry clothing", "Bug spray"],
    insiderTip: "Start the Nongriat living root bridge trek early in the morning to beat the heat on the 3,000-step return climb."
  },
  {
    id: "hampi-karnataka",
    name: "Hampi",
    category: "Heritage",
    region: "South",
    continent: "Asia",
    country: "India",
    lat: 15.335,
    lon: 76.46,
    temp: "29°C",
    bestTime: "Nov - Feb",
    image: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609946782782-7771746f3a76?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A UNESCO World Heritage landscape of boulder-strewn hills dotted with magnificent 14th-century Vijayanagara Empire ruins.",
    highlights: [
      "Virupaksha Temple & Vijaya Vittala Stone Chariot",
      "Coracle boat ride across Tungabhadra River",
      "Sunset from Matanga Hill or Hemakuta Hill",
      "Bicycle tour through Lotus Mahal & Elephant Stables"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Sun hat & shades", "Light cotton wear", "Sturdy walking sandals", "Hydration bottle"],
    insiderTip: "Renting a bicycle or moped is the best way to comfortably explore the vast scattered ruins at your own pace."
  },
  {
    id: "darjeeling-westbengal",
    name: "Darjeeling",
    category: "Mountains",
    region: "East",
    continent: "Asia",
    country: "India",
    lat: 27.041,
    lon: 88.2663,
    temp: "15°C",
    bestTime: "Oct - Dec, Mar - May",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Queen of the Hills famous for world-class tea gardens, heritage Himalayan railways, and views of Mount Kanchenjunga.",
    highlights: [
      "Tiger Hill sunrise over Mount Kanchenjunga",
      "UNESCO Darjeeling Himalayan Railway (Toy Train) ride",
      "Tea tasting tour at Happy Valley Tea Estate",
      "Ghoom Monastery & Batasia Loop visit"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Warm woolens", "Comfortable walking shoes", "Camera", "Thermos bottle"],
    insiderTip: "Book the Steam Engine joyride between Darjeeling and Ghoom in advance for the authentic heritage Toy Train experience."
  },
  {
    id: "rishikesh-uttarakhand",
    name: "Rishikesh & Haridwar",
    category: "Heritage",
    region: "North",
    continent: "Asia",
    country: "India",
    lat: 30.0869,
    lon: 78.2676,
    temp: "22°C",
    bestTime: "Sep - Nov, Feb - May",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Yoga Capital of the World where the clear blue Ganges exits the Himalayas, blending adrenaline sports with spiritual peace.",
    highlights: [
      "White water river rafting from Shivpuri",
      "Evening Ganga Aarti at Parmarth Niketan & Triveni Ghat",
      "Exploring Lakshman Jhula, Ram Jhula & Beatles Ashram",
      "Bungee jumping at Jumpin Heights"
    ],
    suggestedDays: 3,
    recommendedPacking: ["Quick-dry shorts/t-shirts", "Waterproof shoes/sandals", "Yoga clothes", "Modest wear for ashrams"],
    insiderTip: "Visit the Beatles Ashram (Chaurasi Kutia) in the late afternoon for quiet forest walks and colorful graffiti art."
  }
];