import { useState, useEffect } from "react";
import Map from "../components/Map/Map.jsx";
import Header from "../components/Header/Header.jsx";
import SearchSidebar from "../components/SearchPanel/SearchSidebar.jsx";
import ProducerDetail from "../components/SearchPanel/ProducerDetail.jsx";
import Checkout from "../components/SearchPanel/Checkout.jsx";
import { api } from "../utils/api.js";

export default function MapView() {
    const [producers, setProducers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProducer, setSelectedProducer] = useState(null);
    const [checkoutInfo, setCheckoutInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const response = await api.get("/users");

                const mappedProducers = response.users
                    .filter(user => user.user_type === "producer")
                    .map(p => ({
                        id: p.id,
                        name: p.company_name || "Unknown Company",
                        type: "Producer",
                        lat: p.lat || 49.8625,
                        lng: p.lng || -119.4625,
                        address: p.primary_address || "Address not provided",

                        products: p.inventory ? p.inventory.map(item => item.name) : [],
                        fullProducts: p.inventory || []
                    }));

                setProducers(mappedProducers);
            } catch (error) {
                console.error("Failed to fetch producers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducers();
    }, []);

    const filteredProducers = producers.filter(p => {
        const searchLower = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(searchLower) ||
               (p.products && p.products.some(prod => prod.toLowerCase().includes(searchLower)));
    });

    return (
        <div style={{ height: "100vh", width: "100vw", display: "flex", overflow: "hidden", backgroundColor: "#faf6ef" }}>

            <SearchSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                producers={filteredProducers}
                onSelect={(dist) => setSelectedProducer(dist)}
            />

            {selectedProducer && (
                <ProducerDetail
                    producer={selectedProducer}
                    onClose={() => setSelectedProducer(null)}
                    onOrder={(product, dist, mode) => setCheckoutInfo({ product, producer: dist, mode })}
                />
            )}

            <div style={{ flex: 1, position: "relative", height: "100%" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
                    <Header />
                </div>

                {isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <h2>Loading Map Data...</h2>
                    </div>
                ) : (
                    <Map pins={filteredProducers} selectedId={selectedProducer?.id} />
                )}
            </div>

            {checkoutInfo && (
                <Checkout
                    product={checkoutInfo.product}
                    producer={checkoutInfo.producer}
                    mode={checkoutInfo.mode}
                    onClose={() => setCheckoutInfo(null)}
                />
            )}
        </div>
    )
}
