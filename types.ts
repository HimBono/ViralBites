export interface Place {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  cuisine: string;
  phone: string;
  website: string;
  openingHours: string;
  distance?: number;
  osmId: number;
  imageUrl: string;
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
  { id: 'cafe', label: 'Cafes', icon: '☕' },
  { id: 'dessert', label: 'Desserts', icon: '🍰' },
  { id: 'fine_dining', label: 'Restaurants', icon: '✨' },
];

export const PRICE_RANGES = [
  { id: 'any', label: 'Any Price' },
  { id: 'cheap', label: '$' },
  { id: 'moderate', label: '$$' },
  { id: 'expensive', label: '$$$' },
];
