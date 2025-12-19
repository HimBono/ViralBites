import React from 'react';
import { Place } from '../types';
import { MapPin, Utensils } from 'lucide-react';
import { clsx } from 'clsx';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
  isSelected: boolean;
}

// Format cuisine for display
const formatCuisine = (cuisine: string): string => {
  if (!cuisine) return 'Food & Dining';
  return cuisine.split(';')[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md active:scale-[0.98]",
        isSelected ? "ring-2 ring-orange-500 border-transparent scroll-mt-20" : ""
      )}
    >
      {/* Image */}
      <div className="relative h-32 w-full overflow-hidden bg-gray-100">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback to a generic food placeholder
            (e.target as HTMLImageElement).src = `https://picsum.photos/400/300?random=${place.osmId}`;
          }}
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm capitalize">
          {place.category.replace('_', ' ')}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 leading-tight text-lg">{place.name}</h3>
        </div>

        {place.cuisine && (
          <div className="flex items-center gap-2 mb-2">
            <Utensils size={14} className="text-orange-500" />
            <span className="text-sm text-gray-600">{formatCuisine(place.cuisine)}</span>
          </div>
        )}

        {place.address && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <MapPin size={14} className="shrink-0" />
            <span className="line-clamp-1">{place.address}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mt-2 border-t pt-3 border-gray-100">
          <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium">
            <MapPin size={12} />
            <span>{place.distance} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};
