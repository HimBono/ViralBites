import React from 'react';
import { Place } from '../types';
import { X, MapPin, ExternalLink, Clock, Phone, Utensils, Globe } from 'lucide-react';

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
}

const formatCuisine = (cuisine: string): string => {
  if (!cuisine) return 'Food & Dining';
  return cuisine.split(';').map(c =>
    c.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  ).join(', ');
};

export const PlaceDetail: React.FC<PlaceDetailProps> = ({ place, onClose }) => {
  const osmUrl = `https://www.openstreetmap.org/node/${place.osmId}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white overflow-y-auto animate-in slide-in-from-bottom-10 md:static md:h-full md:rounded-xl md:shadow-lg">
      {/* Image Header */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-200">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/400/300?random=${place.osmId}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <X size={20} className="text-white" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl font-bold text-white mb-1">{place.name}</h1>
          {place.address && (
            <div className="flex items-center gap-2 text-white/90">
              <MapPin size={16} />
              <span className="text-sm">{place.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <MapPin size={16} />
              <span className="text-xs font-semibold uppercase">Distance</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{place.distance} km</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Utensils size={16} />
              <span className="text-xs font-semibold uppercase">Category</span>
            </div>
            <p className="text-lg font-bold text-gray-900 capitalize">{place.category.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Cuisine */}
        {place.cuisine && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Cuisine</h3>
            <p className="text-gray-600">{formatCuisine(place.cuisine)}</p>
          </div>
        )}

        {/* Opening Hours */}
        {place.openingHours && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock size={16} />
              <h3 className="font-semibold text-gray-900">Opening Hours</h3>
            </div>
            <p className="text-sm text-gray-600">{place.openingHours}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3">
          {place.phone && (
            <a href={`tel:${place.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Phone size={18} className="text-gray-500" />
              <span className="text-gray-700">{place.phone}</span>
            </a>
          )}
          {place.website && (
            <a href={place.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Globe size={18} className="text-gray-500" />
              <span className="text-blue-600 truncate">{place.website}</span>
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            <MapPin size={18} />
            Get Directions
          </a>
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <ExternalLink size={18} />
            View on OpenStreetMap
          </a>
        </div>
      </div>
    </div>
  );
};
