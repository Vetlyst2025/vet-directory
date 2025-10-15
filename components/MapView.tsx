'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Clinic {
  id: number;
  clinic_name: string;
  latitude: number;
  longitude: number;
  full_address: string;
  phone: string;
  rating: number;
}

interface MapViewProps {
  clinics: Clinic[];
}

export default function MapView({ clinics }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-[500px] bg-slate-100 rounded-lg animate-pulse" />;
  }

  const validClinics = clinics.filter(c => c.latitude && c.longitude);
  
  if (validClinics.length === 0) {
    return (
      <div className="h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
        <p className="text-slate-500">No clinics with location data to display</p>
      </div>
    );
  }

  // Center on Madison, WI
  const center: [number, number] = [43.0731, -89.4012];

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '500px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validClinics.map((clinic) => (
        <Marker
          key={clinic.id}
          position={[clinic.latitude, clinic.longitude]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm">{clinic.clinic_name}</h3>
              <p className="text-xs text-slate-600 mt-1">{clinic.full_address}</p>
              {clinic.phone && (
                <p className="text-xs mt-1">
                  <a href={`tel:${clinic.phone}`} className="text-blue-600 hover:underline">
                    {clinic.phone}
                  </a>
                </p>
              )}
              {clinic.rating && (
                <p className="text-xs mt-1">⭐ {clinic.rating}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
