import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Fix default marker icon broken by webpack/vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Inner component — handles map click events and reverse geocoding.
 */
function PinHandler({ pin, setPin, onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPin([lat, lng]);

      // Reverse geocode via Nominatim (free, no API key)
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'User-Agent': 'HoopEventPlanner/1.0' } }
      )
        .then(res => res.json())
        .then(data => {
          onLocationSelect({
            lat,
            lng,
            address: data.display_name || 'Unknown location',
          });
        })
        .catch(() => {
          onLocationSelect({ lat, lng, address: 'Unable to fetch address' });
        });
    },
  });

  return pin ? <Marker position={pin} /> : null;
}

/**
 * Inner component — smoothly flies the map to a new search location
 */
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

/**
 * LocationPicker — interactive Leaflet map for pinning small event locations.
 */
export default function LocationPicker({ initialPin = null, onLocationSelect }) {
  const [pin, setPin] = useState(initialPin);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Phnom Penh default center (per spec 8.3)
  const defaultCenter = [11.5564, 104.9282];
  const [mapCenter, setMapCenter] = useState(initialPin || defaultCenter);

  useEffect(() => {
    if (initialPin) {
      setPin(initialPin);
      setMapCenter(initialPin);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`,
        { headers: { 'User-Agent': 'HoopEventPlanner/1.0' } }
      );
      const data = await res.json();
      
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchError("Location not found. Try a different search term.");
      }
    } catch (err) {
      setSearchError("Failed to search location.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    const { lat, lon, display_name } = result;
    setMapCenter([parseFloat(lat), parseFloat(lon)]);
    setSearchQuery(display_name);
    setSearchResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 relative">
        <p className="text-sm text-gray-500">Search for a city, landmark, or address to jump the map there, then click to drop your pin.</p>
        <form onSubmit={handleSearch} className="flex gap-2 relative z-10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              type="text" 
              placeholder="e.g. Times Square, New York" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (searchResults.length > 0) setSearchResults([]);
              }}
              className="pl-9 h-11 bg-gray-50"
            />
          </div>
          <Button type="submit" disabled={isSearching} className="h-11 px-6 bg-gray-900 hover:bg-gray-800 text-white">
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : "Search"}
          </Button>
        </form>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-[80px] left-0 right-[100px] bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                type="button"
                className="w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                onClick={() => handleResultClick(res)}
              >
                {res.display_name}
              </button>
            ))}
          </div>
        )}

        {searchError && <p className="text-xs text-red-500 font-medium">{searchError}</p>}
      </div>

      <div className="relative border border-gray-200 rounded-xl overflow-hidden shadow-sm z-0">
        <MapContainer
          center={defaultCenter} // initial center, updated by MapUpdater
          zoom={13}
          style={{ height: '380px', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapUpdater center={mapCenter} />
          <PinHandler pin={pin} setPin={setPin} onLocationSelect={onLocationSelect} />
        </MapContainer>
      </div>
      
      {pin && (
        <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-100">
          <p className="text-sm font-semibold">📍 Location Pinned Successfully!</p>
          <p className="text-xs opacity-70">
            {pin[0].toFixed(5)}, {pin[1].toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
}
