import React from 'react';
import { Place } from '../types';
import { Star, MapPin, Clock, DollarSign, Flame } from 'lucide-react';
import { clsx } from 'clsx';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
  isSelected: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick, isSelected }) => {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md active:scale-[0.98]",
        isSelected ? "ring-2 ring-orange-500 border-transparent scroll-mt-20" : ""
      )}
    >
      <div className="relative h-32 w-full overflow-hidden">
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          {((place.googleRating + place.webRating) / 2).toFixed(1)}
        </div>
        {!place.isOpen && (
            <div className="absolute top-2 left-2 bg-red-500/90 text-white px-2 py-1 rounded-full text-xs font-bold">
                Closed
            </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 leading-tight">{place.name}</h3>
        </div>
        
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{place.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
            {place.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="bg-orange-50 text-orange-600 text-[10px] px-2 py-1 rounded-full font-medium">
                    {tag}
                </span>
            ))}
        </div>

        <div className="flex items-center gap-2 mb-3 bg-rose-50 p-2 rounded-lg border border-rose-100">
             <Flame size={14} className="text-rose-500 shrink-0" />
             <span className="text-xs font-medium text-rose-700 truncate">
                Must Try: <span className="font-bold">{place.mustTryItem}</span>
             </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-2 border-t pt-2 border-gray-100">
          <div className="flex items-center gap-1">
             <MapPin size={12} />
             <span>{place.distance}km</span>
          </div>
          <div className="flex items-center gap-1">
              <DollarSign size={12} />
              <span className="text-gray-600 font-medium">{place.priceLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
