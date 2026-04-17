"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

// ✅ Fix 1: gunakan _getIconUrl dengan cast as any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function PenangananMapPage() {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(false);

    const getUserLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLoading(false);
                },
                (error) => {
                    alert("Error mendapatkan lokasi: " + error.message);
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation tidak didukung oleh browser ini.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Peta Sederhana</h1>

                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <button
                        onClick={getUserLocation}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Mendapatkan Lokasi..." : "Dapatkan Lokasi Saya"}
                    </button>

                    {userLocation && (
                        <p className="mt-2 text-gray-600">
                            Lokasi Anda: Latitude {userLocation[0].toFixed(4)}, Longitude {userLocation[1].toFixed(4)}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* ✅ Fix 2: cast as [number, number] & Fix 3: attribution dipindah ke sini */}
                    <MapContainer
                        center={[-2.5489, 118.0149] as [number, number]}
                        zoom={5}
                        style={{ height: "500px", width: "100%" }}
                    >
                        {/* ✅ Fix 3: attribution dihapus dari TileLayer */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>Lokasi Anda</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}