export interface Place {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  googleRating: number;
  webRating: number; // Aggregated from other sources like Yelp/TripAdvisor
  reviewCount: number;
  priceLevel: 'Cheap' | 'Moderate' | 'Expensive' | 'Luxury';
  tags: string[];
  mustTryItem: string;
  isOpen: boolean;
  imageUrl: string;
  sourceUrl?: string;
  distance?: number; // Calculated client-side
}

export interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  openNow: boolean;
  sortBy: 'trending' | 'distance' | 'rating';
}

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'street_food', label: 'Street Food', icon: '🌮' },
  { id: 'cafe', label: 'Viral Cafes', icon: '☕' },
  { id: 'dessert', label: 'Desserts', icon: '🍰' },
  { id: 'fine_dining', label: 'Aesthetics', icon: '✨' },
];

export const PRICE_RANGES = [
  { id: 'any', label: 'Any Price' },
  { id: 'cheap', label: '$' },
  { id: 'moderate', label: '$$' },
  { id: 'expensive', label: '$$$' },
];
