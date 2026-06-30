import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
 * LocationPicker — interactive Leaflet map for pinning small event locations.
 *
 * Props:
 *   initialPin  — [lat, lng] or null (pre-fill if editing)
 *   onLocationSelect(location) — called with { lat, lng, address }
 */
export default function LocationPicker({ initialPin = null, onLocationSelect }) {
  const [pin, setPin] = useState(initialPin);

  // Phnom Penh default center (per spec 8.3)
  const defaultCenter = [11.5564, 104.9282];
  const center = pin || defaultCenter;

  useEffect(() => {
    if (initialPin) setPin(initialPin);
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Click anywhere on the map to drop a pin.</p>
      <MapContainer
        key={center.toString()}
        center={center}
        zoom={13}
        style={{ height: '380px', width: '100%', borderRadius: '12px', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <PinHandler pin={pin} setPin={setPin} onLocationSelect={onLocationSelect} />
      </MapContainer>
      {pin && (
        <p className="text-xs text-gray-400">
          📍 {pin[0].toFixed(6)}, {pin[1].toFixed(6)}
        </p>
      )}
    </div>
  );
}
