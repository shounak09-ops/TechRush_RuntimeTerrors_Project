export const DESTINATIONS = [
  // ==========================================
  // 🇮🇳 INDIA - NORTH REGION
  // ==========================================
  {
    id: 101,
    name: "Taj Mahal, Agra",
    country: "India",
    region: "North",
    category: "Heritage",
    lat: 27.1751, lon: 78.0421,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe707?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "32°C", budget: "$",
    description: "Iconic ivory-white marble mausoleum on the Yamuna River.",
    suggestedDays: 2,
    recommendedPacking: ["Sunscreen SPF 50+", "Comfortable walking shoes", "Light breathable clothing", "Camera", "Hat/cap for sun protection"],
    bestTime: "Oct - Mar",
    highlights: [
      "Sunrise viewing of changing marble hues",
      "Explore Agra Fort and Mehtab Bagh gardens",
      "Taste authentic Agra Petha in local bazaars"
    ],
    insiderTip: "Arrive 30 minutes before sunrise at the East Gate for the shortest lines and softest lighting."
  },
  {
    id: 102,
    name: "Jaipur City Palace",
    country: "India",
    region: "North",
    category: "Heritage",
    lat: 26.9258, lon: 75.8237,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "31°C", budget: "$",
    description: "Royal pink sandstone architecture and forts in the heart of Rajasthan.",
    suggestedDays: 3,
    recommendedPacking: ["Sunscreen SPF 50+", "Comfortable walking shoes", "Light cotton clothing", "Camera", "Sunglasses", "Hat/cap"],
    bestTime: "Nov - Feb",
    highlights: [
      "Photograph the 953 carved honeycomb windows of Hawa Mahal",
      "Jeep or elephant ride up to the hilltops of Amber Fort",
      "Savor an authentic Rajasthani Thali at Chokhi Dhani"
    ],
    insiderTip: "Buy a composite ticket at Amber Fort to save money across all major city heritage monuments."
  },
  {
    id: 103,
    name: "Leh-Ladakh",
    country: "India",
    region: "North",
    category: "Mountains",
    lat: 34.1526, lon: 77.5771,
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "12°C", budget: "$$",
    description: "High-altitude Himalayan mountain passes and glacial lakes.",
    suggestedDays: 5,
    recommendedPacking: ["Thermal base layers", "Warm jacket", "Windproof outer layer", "Sunscreen SPF 50+", "Lip balm", "Sunglasses", "Comfortable hiking boots"],
    bestTime: "May - Sep",
    highlights: [
      "Drive across Khardung La pass toward Nubra Valley",
      "Overnight camping along the turquoise waters of Pangong Tso",
      "Explore the cliffside monastic architecture of Thiksey"
    ],
    insiderTip: "Rest completely for your first 36 hours in Leh to avoid severe High Altitude Sickness (AMS)."
  },
  {
    id: 104,
    name: "Manali & Solang",
    country: "India",
    region: "North",
    category: "Mountains",
    lat: 32.2432, lon: 77.1892,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "15°C", budget: "$",
    description: "Snowy peaks, pine forests, and mountain valley adventures.",
    suggestedDays: 4,
    recommendedPacking: ["Warm jacket", "Thermal wear", "Waterproof boots", "Gloves", "Beanie/hat", "Sunscreen", "Sunglasses"],
    bestTime: "Oct - Jun",
    highlights: [
      "Paragliding and zorbing in Solang Valley",
      "Drive through Atal Tunnel toward Lahaul Valley",
      "Café hopping and wooden handicrafts in Old Manali"
    ],
    insiderTip: "Book Rohtang Pass permits online 2 days in advance as daily vehicle counts are strictly capped."
  },
  {
    id: 105,
    name: "Jim Corbett National Park",
    country: "India",
    region: "North",
    category: "Wildlife",
    lat: 29.5300, lon: 78.7747,
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "26°C", budget: "$$",
    description: "India's oldest national park famous for Bengal Tigers and sal forests.",
    suggestedDays: 3,
    recommendedPacking: ["Binoculars", "Camera with zoom lens", "Earth-toned clothing", "Insect repellent", "Comfortable walking shoes", "Flashlight"],
    bestTime: "Nov - Jun",
    highlights: [
      "Open-top 4x4 Jeep safaris through Dhikala and Bijrani zones",
      "Birdwatching along the Ramganga River banks",
      "Stay in historic British-era forest rest houses"
    ],
    insiderTip: "Reserve safari slots on the official portal 45 days prior, especially for the popular Dhikala zone."
  },

  // ==========================================
  // 🇮🇳 INDIA - SOUTH REGION
  // ==========================================
  {
    id: 201,
    name: "Hampi Monuments",
    country: "India",
    region: "South",
    category: "Heritage",
    lat: 15.3350, lon: 76.4600,
    image: "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "30°C", budget: "$",
    description: "UNESCO World Heritage site with ancient Vijayanagara empire ruins.",
    suggestedDays: 3,
    recommendedPacking: ["Comfortable walking shoes", "Sunscreen SPF 50+", "Light breathable clothing", "Camera", "Hat/cap", "Water bottle"],
    bestTime: "Oct - Feb",
    highlights: [
      "Marvel at the stone chariot inside Vittala Temple",
      "Watch the sunset from atop boulder-strewn Matanga Hill",
      "Take a traditional coracle boat ride across Tungabhadra River"
    ],
    insiderTip: "Rent a scooter or bicycle on the Anegundi side to cover distant ruins efficiently."
  },
  {
    id: 202,
    name: "Mahabalipuram Temples",
    country: "India",
    region: "South",
    category: "Heritage",
    lat: 12.6269, lon: 80.1927,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "31°C", budget: "$",
    description: "7th-century rock-cut coastal Shore Temple and monolithic rathas.",
    suggestedDays: 2,
    recommendedPacking: ["Sunscreen SPF 50+", "Comfortable walking shoes", "Light cotton clothing", "Camera", "Beach wear", "Hat/cap"],
    bestTime: "Nov - Feb",
    highlights: [
      "Explore the 7th-century rock-cut Shore Temple by the ocean",
      "Inspect the giant open-air relief carving of Arjuna's Penance",
      "Try fresh catch of the day at seaside seafood shacks"
    ],
    insiderTip: "Visit Arjuna's Penance late in the afternoon when sunlight highlights the stone detail."
  },
  {
    id: 203,
    name: "Alleppey Backwaters",
    country: "India",
    region: "South",
    category: "Beaches",
    lat: 9.4981, lon: 76.3388,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "28°C", budget: "$",
    description: "Serene network of palm-fringed coastal backwater canals.",
    suggestedDays: 3,
    recommendedPacking: ["Light breathable clothing", "Sunscreen SPF 50+", "Insect repellent", "Camera", "Waterproof bag", "Comfortable sandals"],
    bestTime: "Sep - Mar",
    highlights: [
      "Overnight houseboat cruise along Punnamada Lake",
      "Shallow canal country-canoe trips through paddy fields",
      "Sample authentic Karimeen Pollichathu (pearl spot fish) on banana leaf"
    ],
    insiderTip: "Book a small non-motorized canoe ride to explore narrow interior canals where houseboats can't go."
  },
  {
    id: 204,
    name: "Varkala Cliff Beach",
    country: "India",
    region: "South",
    category: "Beaches",
    lat: 8.7379, lon: 76.7163,
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "29°C", budget: "$",
    description: "Dramatic red cliffs adjacent to the Arabian Sea coastline.",
    suggestedDays: 3,
    recommendedPacking: ["Beach wear", "Sunscreen SPF 50+", "Comfortable walking shoes", "Camera", "Light cover-up", "Sunglasses"],
    bestTime: "Oct - Mar",
    highlights: [
      "Sunset dining along the cliffside cafes overlooking Papanasam Beach",
      "Ayurvedic massage treatments at cliffside wellness retreats",
      "Surfing lessons along North Cliff beach swells"
    ],
    insiderTip: "Papanasam Beach is considered holy; dress modestly near the main temple entry path."
  },
  {
    id: 205,
    name: "Munnar Hills",
    country: "India",
    region: "South",
    category: "Mountains",
    lat: 10.0889, lon: 77.0595,
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "20°C", budget: "$",
    description: "Rolling tea garden estates nestled in Western Ghats mountain ranges.",
    suggestedDays: 3,
    recommendedPacking: ["Light jacket", "Comfortable walking shoes", "Rain jacket/umbrella", "Camera", "Insect repellent", "Sunscreen"],
    bestTime: "Sep - May",
    highlights: [
      "Tour tea plantations and sample freshly brewed orthodox teas",
      "Spot endangered Nilgiri Tahr goats at Eravikulam National Park",
      "Boating at Mattupetty Dam surrounded by tea slopes"
    ],
    insiderTip: "Book Eravikulam National Park bus tickets online early in the morning to avoid long queues."
  },
  {
    id: 206,
    name: "Kabini Forest Reserve",
    country: "India",
    region: "South",
    category: "Wildlife",
    lat: 11.9169, lon: 76.3333,
    image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "25°C", budget: "$$$",
    description: "Premier leopard and black panther habitat along Kabini river backwaters.",
    suggestedDays: 3,
    recommendedPacking: ["Binoculars", "Camera with zoom lens", "Earth-toned clothing", "Insect repellent", "Comfortable walking shoes", "Flashlight"],
    bestTime: "Oct - May",
    highlights: [
      "Boat safari along the reservoir to see large herds of Asian elephants",
      "Spot leopards and rare black panthers in Nagarhole zone",
      "Guided nature walks with resident naturalists"
    ],
    insiderTip: "Summer months (March to May) yield the best big cat and elephant sightings around receding waters."
  },

  // ==========================================
  // 🇮🇳 INDIA - WEST REGION
  // ==========================================
  {
    id: 301,
    name: "North Goa Beaches",
    country: "India",
    region: "West",
    category: "Beaches",
    lat: 15.2993, lon: 74.1240,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "29°C", budget: "$",
    description: "Golden sand beaches, palm groves, and energetic coastline vibes.",
    suggestedDays: 4,
    recommendedPacking: ["Beach wear", "Sunscreen SPF 50+", "Sunglasses", "Flip-flops", "Light cover-up", "Camera", "Insect repellent"],
    bestTime: "Nov - Feb",
    highlights: [
      "Water sports like parasailing and jet skiing at Calangute & Baga",
      "Explore Portuguese heritage at Aguada Fort and Old Goa churches",
      "Sunset flea market shopping at Anjuna Beach"
    ],
    insiderTip: "Head to Ashwem or Morjim Beach further north for cleaner sands and quieter crowds."
  },
  {
    id: 302,
    name: "Ajanta & Ellora Caves",
    country: "India",
    region: "West",
    category: "Heritage",
    lat: 20.5519, lon: 75.7033,
    image: "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "30°C", budget: "$",
    description: "Ancient rock-cut cave monuments and the massive monolithic Kailasa Temple.",
    suggestedDays: 3,
    recommendedPacking: ["Comfortable walking shoes", "Sunscreen SPF 50+", "Light breathable clothing", "Camera", "Flashlight", "Water bottle"],
    bestTime: "Nov - Mar",
    highlights: [
      "Behold Cave 16 (Kailasa Temple), carved top-down from a single rock mass",
      "Study ancient Buddhist frescoes inside Ajanta's horseshoe ravine",
      "Explore Hindu, Jain, and Buddhist rock carving styles side-by-side"
    ],
    insiderTip: "Ajanta Caves are closed on Mondays; Ellora Caves are closed on Tuesdays."
  },
  {
    id: 303,
    name: "Gir National Park",
    country: "India",
    region: "West",
    category: "Wildlife",
    lat: 21.1243, lon: 70.8242,
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "33°C", budget: "$$",
    description: "The sole wild sanctuary for majestic Asiatic Lions in Gujarat.",
    suggestedDays: 3,
    recommendedPacking: ["Binoculars", "Camera with zoom lens", "Earth-toned clothing", "Insect repellent", "Comfortable walking shoes", "Sunscreen SPF 50+", "Hat/cap"],
    bestTime: "Dec - Apr",
    highlights: [
      "Open jeep safari tracking wild Asiatic Lion prides",
      "Spot chinkara gazelles, spotted deer, and marsh crocodiles",
      "Visit the Maldhari tribal settlements inside the buffer forest"
    ],
    insiderTip: "The park remains completely closed during monsoon season (June 16 to October 15)."
  },
  {
    id: 304,
    name: "Ranthambore Tiger Reserve",
    country: "India",
    region: "West",
    category: "Wildlife",
    lat: 26.0173, lon: 76.5026,
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "31°C", budget: "$$",
    description: "Royal hunting grounds turned wildlife reserve dominated by historic fort ruins.",
    suggestedDays: 3,
    recommendedPacking: ["Binoculars", "Camera with zoom lens", "Earth-toned clothing", "Insect repellent", "Comfortable walking shoes", "Sunscreen SPF 50+", "Flashlight"],
    bestTime: "Oct - Apr",
    highlights: [
      "Safari through ancient fort ruins where tigers freely roam",
      "Climb up Ranthambore Fort for panoramic park views",
      "Birdwatching around Padam Talao and Raj Bagh lakes"
    ],
    insiderTip: "Zones 1 through 5 offer higher tiger activity compared to peripheral outer zones 6 through 10."
  },

  // ==========================================
  // 🇮🇳 INDIA - EAST REGION
  // ==========================================
  {
    id: 401,
    name: "Darjeeling Hills",
    country: "India",
    region: "East",
    category: "Mountains",
    lat: 27.0410, lon: 88.2663,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "16°C", budget: "$",
    description: "Famed tea gardens with views of Kangchenjunga peak.",
    suggestedDays: 3,
    recommendedPacking: ["Light jacket", "Comfortable walking shoes", "Rain jacket/umbrella", "Camera", "Warm layers", "Sunscreen"],
    bestTime: "Mar - May, Oct - Nov",
    highlights: [
      "Early morning sunrise over Mt. Kangchenjunga at Tiger Hill",
      "Ride the UNESCO World Heritage Darjeeling Himalayan Toy Train",
      "Tour Happy Valley Tea Estate and sip freshly plucked First Flush tea"
    ],
    insiderTip: "Leave for Tiger Hill by 3:30 AM to secure a front-row view before sunrise crowds arrive."
  },
  {
    id: 402,
    name: "Konark Sun Temple",
    country: "India",
    region: "East",
    category: "Heritage",
    lat: 19.8876, lon: 86.0945,
    image: "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
    ],
    temp: "31°C", budget: "$",
    description: "13th-century stone chariot architecture dedicated to the Sun God.",
    suggestedDays: 2,
    recommendedPacking: ["Sunscreen SPF 50+", "Comfortable walking shoes", "Light breathable clothing", "Camera", "Hat/cap", "Water bottle"],
    bestTime: "Oct - Feb",
    highlights: [
      "Examine the 24 carved stone wheels functioning as accurate sundials",
      "Attend the evening Light and Sound show illuminating temple history",
      "Visit nearby Chandrabhaga Beach for clean coastal views"
    ],
    insiderTip: "Hire an ASI-certified local guide at the gate to fully appreciate the complex astronomical symbolism."
  }
];
