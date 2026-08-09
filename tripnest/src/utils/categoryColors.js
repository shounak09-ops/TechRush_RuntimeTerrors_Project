// Category → badge color, used on destination cards to visually group
// place types (matches the app's brand palette rather than one flat color).
export const CATEGORY_COLORS = {
  Heritage: "bg-indigo-900",
  Beaches: "bg-orange-500",
  Mountains: "bg-teal-600",
  Wildlife: "bg-green-700",
  Metropolis: "bg-blue-600",
  Nature: "bg-emerald-600",
  Culture: "bg-purple-800",
};

export const CATEGORY_FALLBACK_COLOR = "bg-slate-800";

export function categoryBadgeColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_FALLBACK_COLOR;
}
