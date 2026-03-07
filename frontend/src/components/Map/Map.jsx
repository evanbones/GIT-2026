import { useEffect, useRef } from "react";
import './Map.css';

function Map({ pins = [], selectedId = null }) {
    const mapRef = useRef(null);
    const markersRef = useRef({});

    useEffect(() => {
        // Initialize map only once
        if (mapRef.current) return;

        // Default to the first pin or Kelowna, BC
        const startPos = pins.length > 0 ? [pins[0].lat, pins[0].lng] : [49.8880, -119.4960];
        mapRef.current = L.map('map', { zoomControl: false }).setView(startPos, 12);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapRef.current);
        
        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // update markers when pins change
    useEffect(() => {
        if (!mapRef.current) return;

        // clear existing markers
        Object.values(markersRef.current).forEach(m => m.remove());
        markersRef.current = {};

        // add new markers
        pins.forEach(pin => {
            const marker = L.marker([pin.lat, pin.lng]).addTo(mapRef.current);
            
            // custom popup styling can go here
            marker.bindPopup(`<strong>${pin.name}</strong><br/>${pin.type}`);
            
            marker.on('click', () => {
            });

            markersRef.current[pin.id] = marker;
        });

        // if there's exactly one pin (e.g. from search), zoom to it
        if (pins.length === 1) {
            mapRef.current.flyTo([pins[0].lat, pins[0].lng], 15);
        }
    }, [pins]);

    // handle selection from sidebar
    useEffect(() => {
        if (selectedId && markersRef.current[selectedId]) {
            const marker = markersRef.current[selectedId];
            mapRef.current.flyTo(marker.getLatLng(), 15);
            marker.openPopup();
        }
    }, [selectedId]);

    return (
        <div className="map" style={{ height: "100%", width: "100%" }}>
            <div id="map" style={{ height: "100%", width: "100%" }}></div>
        </div>
    );
}

export default Map;
