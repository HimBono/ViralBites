import React from 'react';
import { Place } from '../types';
import { X, Star, MapPin, ExternalLink, Clock, Tag } from 'lucide-react';

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
}

export const PlaceDetail: React.FC<PlaceDetailProps> = ({ place, onClose }) => {
  const aggregateRating = ((place.googleRating + place.webRating) / 2).toFixed(1);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white overflow-y-auto animate-in slide-in-from-bottom-10 md:static md:h-full md:rounded-xl md:shadow-lg">
      <div className="relative h-64 w-full shrink-0">
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <X size={20} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
            <h1 className="text-2xl font-bold text-white mb-1">{place.name}</h1>
            <p className="text-white/90 text-sm flex items-center gap-1">
                <MapPin size={14} /> {place.address}
            </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Ratings Section */}
        <div className="flex gap-4">
            <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Viral Score</span>
                <div className="flex items-center gap-1 mt-1">
                    <Star className="fill-orange-500 text-orange-500" size={20} />
                    <span className="text-2xl font-bold text-gray-900">{aggregateRating}</span>
                </div>
                <span className="text-xs text-gray-500">Google + Web</span>
            </div>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                 <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Google</span>
                 <span className="text-lg font-bold text-gray-700 mt-1">{place.googleRating}</span>
            </div>
             <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                 <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Web</span>
                 <span className="text-lg font-bold text-gray-700 mt-1">{place.webRating}</span>
            </div>
        </div>

        {/* Must Try */}
        <div className="bg-gradient-to-r from-orange-50 to-rose-50 p-4 rounded-xl border border-orange-100">
             <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                🔥 Must Try Recommendation
             </h3>
             <p className="text-gray-700 text-sm italic">
                "{place.mustTryItem}"
             </p>
             <p className="text-xs text-gray-500 mt-2">
                "Highly recommended by food bloggers and viral on TikTok."
             </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase">
                    <Clock size={12} /> Hours
                </div>
                <p className={`text-sm font-medium ${place.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {place.isOpen ? 'Open Now' : 'Closed'}
                </p>
            </div>
             <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase">
                    <Tag size={12} /> Price
                </div>
                <p className="text-sm font-medium text-gray-900">
                    {place.priceLevel}
                </p>
            </div>
        </div>

        {/* Tags */}
        <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Vibe & Categories</h4>
            <div className="flex flex-wrap gap-2">
                {place.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Description */}
        <div>
             <h4 className="text-sm font-semibold text-gray-900 mb-2">Why it's Viral</h4>
             <p className="text-sm text-gray-600 leading-relaxed">
                 {place.description}
             </p>
        </div>
      </div>
    </div>
  );
};
