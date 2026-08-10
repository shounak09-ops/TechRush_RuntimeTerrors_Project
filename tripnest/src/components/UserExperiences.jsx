import React from "react";
import { Star, Quote, MapPin } from "lucide-react";

export default function UserExperiences() {
  const experiences = [
    {
      id: 1,
      name: "Aarav Sharma",
      location: "Leh Ladakh",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "The insider packing list and temperature details saved our Ladakh trip! Booking through the platform was seamless."
    },
    {
      id: 2,
      name: "Sophia Chen",
      location: "Tokyo",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Found incredible ramen spots using the Local Insights feature. This site made planning our 7-day Tokyo itinerary effortless!"
    },
    {
      id: 3,
      name: "Rohan Patel",
      location: "Goa",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Loved the itinerary builder! Saved hours of research finding non-touristy seafood places in South Goa."
    },
    {
      id: 4,
      name: "Emily Watson",
      location: "Paris",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "The seasonal 'Best Time to Visit' tips were spot on. Paris was absolute magic thanks to this guide."
    },
    {
      id: 5,
      name: "Vikram Nair",
      location: "Munnar & Alleppey",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Super clean layout and helpful local food recommendations. Combining houseboats and tea gardens in Kerala was a breeze!"
    },
    {
      id: 6,
      name: "Ananya Roy",
      location: "Sikkim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "The modal highlights gave us realistic trip expectations. Perfect platform for discovering hidden Himalayan gems."
    },
    {
      id: 7,
      name: "David Miller",
      location: "Rome",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Booked in two clicks and used the favorite list to organize our daily walks around Rome. Highly recommended!"
    }
  ];

  // Duplicate list to ensure an infinite seamless continuous marquee loop
  const infiniteExperiences = [...experiences, ...experiences];

  return (
    <section className="py-12 bg-slate-100/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Quote className="h-3.5 w-3.5" />
          Real Traveler Stories
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Loved by Explorers Worldwide
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-lg mx-auto">
          See how our platform helped travelers plan seamless journeys across top destinations.
        </p>
      </div>

      {/* Infinite Horizontal Marquee Track */}
      <div className="relative w-full flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-4 sm:gap-6 animate-infinite-scroll hover:[animation-play-state:paused] whitespace-nowrap py-2">
          {infiniteExperiences.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[280px] sm:w-[320px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header: User Info & Location */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-sky-500 dark:text-sky-400 font-medium">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Short Review Text */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-normal line-clamp-3">
                  "{item.review}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}