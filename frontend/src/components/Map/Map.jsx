import { useEffect, useRef } from "react";
import './Map.css';

const pins = [{ lat: 49.939995, lng: -119.397187, name: "graeme" }]; // put pins here

function Map() {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return; // prevent double init in StrictMode

        mapRef.current = L.map('map').setView([49.939995, -119.397187], 19);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapRef.current);

        for (const pin of pins) {
            var marker = L.marker([pin.lat, pin.lng]).addTo(mapRef.current);
            marker.bindPopup(pin.name);
            marker.on('click', () => {
                console.log(pin.name); // expand their business or something like that
            })
        }
    }, []);

    return (
        <div className="map">
            <div id="map"></div>
        </div>
    );
}

export default Map;