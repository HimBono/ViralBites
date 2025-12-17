import React, { useState, useEffect, useRef } from 'react';
import { Map } from './components/Map';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetail } from './components/PlaceDetail';
import { Place, SearchFilters, CATEGORIES, PRICE_RANGES } from './types';
import { searchViralSpots } from './services/gemini';
import { Search, Compass, Map as MapIcon, List, LocateFixed, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map'); // Mobile view toggle
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    priceRange: 'any',
    openNow: false,
    sortBy: 'trending'
  });

  // Fetch user location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchPlaces(latitude, longitude, filters);
      },
      (err) => {
        console.error(err);
        // Default to San Francisco if location denied
        const defaultLat = 37.7749;
        const defaultLng = -122.4194;
        setUserLocation({ lat: defaultLat, lng: defaultLng });
        fetchPlaces(defaultLat, defaultLng, filters);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPlaces = async (lat: number, lng: number, currentFilters: SearchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchViralSpots(lat, lng, currentFilters);
      if (results.length === 0) {
        setError("No viral spots found. Try adjusting filters.");
      }
      setPlaces(results);
    } catch (err) {
      setError("Failed to fetch places. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (userLocation) {
      fetchPlaces(userLocation.lat, userLocation.lng, filters);
    }
  };

  const selectedPlace = places.find(p => p.id === selectedPlaceId);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header / Search Bar */}
      <div className="z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
            <div className="flex items-center gap-3">
                 <div className="bg-orange-500 p-2 rounded-lg">
                    <Compass className="text-white" size={20} />
                 </div>
                 <h1 className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">
                    Viral<span className="text-orange-500">Bites</span>
                 </h1>
                 
                 <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search area or food..." 
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            value={filters.query}
                            onChange={(e) => setFilters({...filters, query: e.target.value})}
                        />
                    </div>
                 </form>

                 <button 
                    onClick={() => {
                         if (userLocation) fetchPlaces(userLocation.lat, userLocation.lng, filters);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                    title="Refresh near me"
                 >
                    <LocateFixed size={20} />
                 </button>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            const newFilters = {...filters, category: cat.id};
                            setFilters(newFilters);
                            if (userLocation) fetchPlaces(userLocation.lat, userLocation.lng, newFilters);
                        }}
                        className={`
                            whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors
                            ${filters.category === cat.id 
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                        `}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                {PRICE_RANGES.map(price => (
                    <button
                        key={price.id}
                        onClick={() => {
                            const newFilters = {...filters, priceRange: price.id};
                            setFilters(newFilters);
                            if (userLocation) fetchPlaces(userLocation.lat, userLocation.lng, newFilters);
                        }}
                        className={`
                            whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                            ${filters.priceRange === price.id 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}
                        `}
                    >
                        {price.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Desktop Sidebar (List) */}
        <div className={`
            hidden md:flex flex-col w-96 bg-white border-r border-gray-200 z-10 shadow-lg shrink-0 transition-transform duration-300
            ${selectedPlaceId ? 'translate-x-0' : 'translate-x-0'} 
        `}>
           {selectedPlaceId ? (
               <PlaceDetail 
                 place={selectedPlace!} 
                 onClose={() => setSelectedPlaceId(null)} 
               />
           ) : (
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {loading ? (
                   <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                       <Loader2 className="animate-spin mb-2" size={32} />
                       <p className="text-sm">Finding viral spots...</p>
                   </div>
               ) : error ? (
                   <div className="text-center py-10 text-gray-500 px-4">
                       <p>{error}</p>
                   </div>
               ) : (
                   places.map(place => (
                       <PlaceCard 
                           key={place.id} 
                           place={place} 
                           isSelected={selectedPlaceId === place.id}
                           onClick={() => setSelectedPlaceId(place.id)}
                       />
                   ))
               )}
               {!loading && places.length > 0 && (
                   <div className="text-center text-xs text-gray-400 pb-4 pt-2">
                       Showing {places.length} viral spots
                   </div>
               )}
             </div>
           )}
        </div>

        {/* Map Area */}
        <div className={`flex-1 relative transition-all duration-300 ${selectedPlaceId ? 'md:w-[calc(100%-24rem)]' : 'w-full'}`}>
           <Map 
                places={places} 
                selectedPlaceId={selectedPlaceId} 
                onPlaceSelect={(p) => {
                    setSelectedPlaceId(p.id);
                    setViewMode('list'); // On mobile, switch to detail view
                }}
                userLocation={userLocation}
           />
           
           {/* Mobile List Toggle & Bottom Sheet */}
           <div className="md:hidden">
              {/* Floating Toggle Button */}
              <button 
                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                className="absolute bottom-6 right-6 z-[1000] bg-gray-900 text-white p-4 rounded-full shadow-xl flex items-center gap-2 hover:bg-gray-800 transition-transform active:scale-95"
              >
                 {viewMode === 'map' ? <List size={24} /> : <MapIcon size={24} />}
                 <span className="font-bold">{viewMode === 'map' ? 'List' : 'Map'}</span>
              </button>

              {/* Mobile List/Detail Overlay */}
              {viewMode === 'list' && (
                  <div className="absolute inset-0 bg-white z-[999] flex flex-col animate-in slide-in-from-bottom-5">
                      {selectedPlaceId ? (
                           <PlaceDetail 
                                place={selectedPlace!} 
                                onClose={() => {
                                    setSelectedPlaceId(null);
                                    setViewMode('map');
                                }} 
                            />
                      ) : (
                          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                              {loading ? (
                                   <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                       <Loader2 className="animate-spin mb-2" size={32} />
                                       <p className="text-sm">Finding viral spots...</p>
                                   </div>
                               ) : (
                                   places.map(place => (
                                       <PlaceCard 
                                           key={place.id} 
                                           place={place} 
                                           isSelected={selectedPlaceId === place.id}
                                           onClick={() => setSelectedPlaceId(place.id)}
                                       />
                                   ))
                               )}
                          </div>
                      )}
                  </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;
