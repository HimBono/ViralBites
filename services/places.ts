import { Place, SearchFilters } from "../types";

// Haversine formula to calculate distance in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
};

// Map category filter to OSM amenity types
const getCategoryAmenities = (category: string): string[] => {
  switch (category) {
    case 'street_food':
      return ['fast_food', 'food_court'];
    case 'cafe':
      return ['cafe'];
    case 'dessert':
      return ['ice_cream', 'cafe'];
    case 'fine_dining':
      return ['restaurant'];
    default:
      return ['restaurant', 'cafe', 'fast_food', 'food_court'];
  }
};

// Get placeholder image based on category
const getPlaceholderImage = (category: string, id: number): string => {
  const categoryImages: Record<string, string> = {
    restaurant: 'restaurant,food,dining',
    cafe: 'coffee,cafe,latte',
    fast_food: 'burger,fries,fastfood',
    food_court: 'food,meal,dining',
    ice_cream: 'icecream,dessert,sweet'
  };
  const keywords = categoryImages[category] || 'food,restaurant';
  // Use Unsplash source for category-relevant images
  return `https://source.unsplash.com/400x300/?${keywords}&sig=${id}`;
};

// Build address from available OSM tags
const buildAddress = (tags: any): string => {
  const parts: string[] = [];

  // Try full address first
  if (tags['addr:full']) return tags['addr:full'];

  // Build from components
  if (tags['addr:unit']) parts.push(tags['addr:unit']);
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);

  if (parts.length > 0) return parts.join(', ');

  // Fallback to other location info
  if (tags.address) return tags.address;
  if (tags['addr:place']) return tags['addr:place'];
  if (tags.operator) return `At ${tags.operator}`;
  if (tags.brand) return `${tags.brand} location`;

  return '';
};

export const searchPlaces = async (
  userLat: number,
  userLng: number,
  filters: SearchFilters
): Promise<Place[]> => {
  const { query, category } = filters;
  const amenities = getCategoryAmenities(category);
  const radius = 10000; // 10km search radius

  // Build Overpass API query - include ways too for larger establishments
  const amenityFilter = amenities.map(a =>
    `node["amenity"="${a}"](around:${radius},${userLat},${userLng});
     way["amenity"="${a}"](around:${radius},${userLat},${userLng});`
  ).join('\n');

  const overpassQuery = `
    [out:json][timeout:30];
    (
      ${amenityFilter}
    );
    out center 50;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(overpassQuery)}`
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();

    let places: Place[] = data.elements
      .filter((el: any) => el.tags?.name)
      .map((el: any, idx: number) => {
        const tags = el.tags || {};
        // For ways, use center coordinates
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;

        if (!lat || !lon) return null;

        const address = buildAddress(tags);
        const amenityType = tags.amenity || 'restaurant';

        return {
          id: `osm-${el.id}`,
          name: tags.name || 'Unknown Place',
          category: amenityType,
          latitude: lat,
          longitude: lon,
          address: address,
          cuisine: tags.cuisine || '',
          phone: tags.phone || tags['contact:phone'] || '',
          website: tags.website || tags['contact:website'] || '',
          openingHours: tags.opening_hours || '',
          distance: calculateDistance(userLat, userLng, lat, lon),
          osmId: el.id,
          imageUrl: getPlaceholderImage(amenityType, el.id)
        };
      })
      .filter((p: Place | null) => p !== null);

    // Filter by query if provided
    if (query && query.trim()) {
      const q = query.toLowerCase();
      places = places.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.cuisine.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      );
    }

    // Sort by distance
    places.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return places.slice(0, 25);
  } catch (error) {
    console.error("Overpass API Error:", error);
    throw error;
  }
};
