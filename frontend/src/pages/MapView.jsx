import { useState } from "react";
import Map from "../components/Map/Map.jsx";
import Header from "../components/Header/Header.jsx";
import SearchSidebar from "../components/SearchPanel/SearchSidebar.jsx";
import DistributorDetail from "../components/SearchPanel/DistributorDetail.jsx";
import Checkout from "../components/SearchPanel/Checkout.jsx";

const producers = [
    {
      id: 1,
      name: "Mission Creek Brewing",
      type: "Brewery",
      lat: 49.8625,
      lng: -119.4625,
      address: "123 Lakeshore Rd, Kelowna, BC",
      products: ["Okanagan IPA", "Lakeshore Lager"],
      fullProducts: [
        { name: "Okanagan IPA", basePrice: 48 },
        { name: "Lakeshore Lager", basePrice: 42 }
      ]
    },
    {
      id: 2,
      name: "Quails' Gate Winery",
      type: "Winery",
      lat: 49.843030,
      lng: -119.565626,
      address: "3303 Boucherie Rd, West Kelowna, BC",
      products: ["Pinot Noir", "Chardonnay"],
      fullProducts: [
        { name: "Pinot Noir", basePrice: 135 },
        { name: "Chardonnay", basePrice: 110 }
      ]
    },
    {
      id: 3,
      name: "Okanagan Spirits Distillery",
      type: "Distillery",
      lat: 49.8650,
      lng: -119.3800,
      address: "4400 Road road, Kelowna, BC",
      products: ["Rebel Vodka", "Forbidden Gin"],
      fullProducts: [
        { name: "Rebel Vodka", basePrice: 65 },
        { name: "Forbidden Gin", basePrice: 70 }
      ]
    }
];

export default function MapView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [checkoutInfo, setCheckoutInfo] = useState(null);

    const filteredProducers = producers.filter(p => {
        const searchLower = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(searchLower) ||
               p.products.some(prod => prod.toLowerCase().includes(searchLower));
    });

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#faf6ef" }}>
            <Header />
            <main style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
                {/* Search & Results Sidebar */}
                <SearchSidebar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    distributors={filteredProducers}
                    onSelect={(dist) => setSelectedDistributor(dist)}
                />

                {/* Distributor Detail Panel */}
                {selectedDistributor && (
                    <DistributorDetail
                        distributor={selectedDistributor}
                        onClose={() => setSelectedDistributor(null)}
                        onOrder={(product, dist, mode) => setCheckoutInfo({ product, distributor: dist, mode })}
                    />
                )}

                {/* Map */}
                <div style={{ flex: 1, position: "relative" }}>
                    <Map pins={filteredProducers} selectedId={selectedDistributor?.id} />
                </div>
            </main>

            {/* Checkout Overlay */}
            {checkoutInfo && (
                <Checkout
                    product={checkoutInfo.product}
                    distributor={checkoutInfo.distributor}
                    mode={checkoutInfo.mode}
                    onClose={() => setCheckoutInfo(null)}
                />
            )}
        </div>
    )
}
