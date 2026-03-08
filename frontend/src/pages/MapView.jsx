import { useState, useEffect } from "react";
import Map from "../components/Map/Map.jsx";
import Header from "../components/Header/Header.jsx";
import SearchSidebar from "../components/SearchPanel/SearchSidebar.jsx";
import ProducerDetail from "../components/SearchPanel/ProducerDetail.jsx";
import Checkout from "../components/SearchPanel/Checkout.jsx";
import { api, inventoryAPI } from "../utils/api.js";
import { useAuth } from "../contexts/useAuth.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MapView() {
  const { user } = useAuth();
  const [producers, setProducers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [producerStocks, setProducerStocks] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await api.get("/users?type=producer");
        const mappedProducers = response.users.map((p) => ({
          id: p.id,
          name: p.company_name || "Unknown Company",
          type: "Producer",
          lat: p.lat || 49.8625,
          lng: p.lng || -119.4625,
          address: p.primary_address || "Address not provided",
          inventory_id: p.inventory_id,
          products: (p.inventory || []).map((item) => item.name),
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

  useEffect(() => {
    if (!selectedProducer?.inventory_id) { setProducerStocks([]); return; }
    inventoryAPI.getStocks(selectedProducer.inventory_id)
      .then(data => setProducerStocks(data.stocks || []))
      .catch(() => setProducerStocks([]));
  }, [selectedProducer]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = e.clientX;
      if (newWidth > 250 && newWidth < 600) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const filteredProducers = producers.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchLower) ||
      p.address.toLowerCase().includes(searchLower) ||
      p.products.some((prod) => prod.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#faf6ef",
      }}
    >
      <Header />

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: isSidebarOpen ? `${sidebarWidth}px` : "0px",
            height: "100%",
            flexShrink: 0,
            transition: isDragging ? "none" : "width 0.3s ease-in-out",
            overflow: "hidden",
            position: "relative",
            zIndex: 6,
            borderRight: isSidebarOpen ? "1px solid #e0d7c6" : "none",
          }}
        >
          <div style={{ width: `${sidebarWidth}px`, height: "100%" }}>
            <SearchSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              producers={filteredProducers}
              onSelect={(dist) => setSelectedProducer(dist)}
            />
          </div>
        </div>

        <div
          onMouseDown={isSidebarOpen ? handleMouseDown : undefined}
          style={{
            width: isSidebarOpen ? "4px" : "0px",
            backgroundColor: isDragging ? "#4a7c59" : "transparent",
            cursor: isSidebarOpen ? "col-resize" : "default",
            position: "relative",
            display: "flex",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: isSidebarOpen ? "-12px" : "10px",
              top: "20px",
              width: "24px",
              height: "40px",
              backgroundColor: "#fffdf7",
              border: "1px solid #c4a882",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              color: "#3e2f1c",
              padding: 0,
            }}
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {selectedProducer && (
          <div
            style={{
              width: "350px",
              height: "100%",
              flexShrink: 0,
              backgroundColor: "#fffdf7",
              borderRight: "1px solid #e0d7c6",
              zIndex: 5,
              boxShadow: "4px 0 10px rgba(0,0,0,0.03)",
              overflowY: "auto",
            }}
          >
            <ProducerDetail
              producer={selectedProducer}
              stocks={producerStocks}
              onClose={() => setSelectedProducer(null)}
              onOrder={(stock, dist, mode) =>
                setCheckoutInfo({ stock, producer: dist, mode })
              }
            />
          </div>
        )}

        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <h2>Loading Map Data...</h2>
            </div>
          ) : (
            <Map pins={filteredProducers} selectedId={selectedProducer?.id} />
          )}
        </div>
      </div>

      {checkoutInfo && (
        <div style={{ position: "fixed", zIndex: 5001, inset: 0 }}>
          <Checkout
            stock={checkoutInfo.stock}
            producer={checkoutInfo.producer}
            mode={checkoutInfo.mode}
            user={user}
            onClose={() => setCheckoutInfo(null)}
          />
        </div>
      )}
    </div>
  );
}
