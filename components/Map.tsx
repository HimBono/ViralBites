import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '../types';

// Fix for Leaflet default icons in React using CDN links
// Direct imports of images (e.g. .png) often fail in ESM/browser environments without specific bundler config
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconShadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const createCustomIcon = (isSelected: boolean, price: string) => {
    const color = isSelected ? '#f97316' : '#3b82f6'; // Orange if selected, Blue otherwise
    
    return L.divIcon({
        className: 'custom-icon',
        html: `
            <div style="
                background-color: ${color};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                color: white;
            ">
            ${price === 'Expensive' || price === 'Luxury' ? '$$$' : '$'}
            </div>
            <div style="
                width: 0; 
                height: 0; 
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 10px solid ${color};
                margin: -2px auto 0;
            "></div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    });
};

interface MapProps {
    places: Place[];
    selectedPlaceId: string | null;
    onPlaceSelect: (place: Place) => void;
    userLocation: { lat: number; lng: number } | null;
}

// Helper to center map on selection
const MapUpdater: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom ?? map.getZoom());
    }, [center, map, zoom]);
    return null;
};

export const Map: React.FC<MapProps> = ({ places, selectedPlaceId, onPlaceSelect, userLocation }) => {
    
    const center: [number, number] = userLocation 
        ? [userLocation.lat, userLocation.lng] 
        : [40.7128, -74.0060]; // Default NY

    // If a place is selected, center on it
    const selectedPlace = places.find(p => p.id === selectedPlaceId);
    const mapCenter = selectedPlace ? [selectedPlace.latitude, selectedPlace.longitude] as [number, number] : center;

    return (
        <MapContainer 
            center={center} 
            zoom={13} 
            scrollWheelZoom={true} 
            className="w-full h-full z-0"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {userLocation && (
                <Marker 
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.divIcon({
                        className: 'user-marker',
                        html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3);"></div>`,
                        iconSize: [20, 20]
                    })}
                />
            )}

            {places.map((place) => (
                <Marker
                    key={place.id}
                    position={[place.latitude, place.longitude]}
                    icon={createCustomIcon(place.id === selectedPlaceId, place.priceLevel)}
                    eventHandlers={{
                        click: () => onPlaceSelect(place),
                    }}
                >
                </Marker>
            ))}

            <MapUpdater center={mapCenter} zoom={selectedPlace ? 15 : undefined} />
        </MapContainer>
    );
};