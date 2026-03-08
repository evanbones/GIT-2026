import { useState, useEffect } from "react";
import Map from "../components/Map/Map.jsx";
import Header from "../components/Header/Header.jsx";
import SearchSidebar from "../components/SearchPanel/SearchSidebar.jsx";
import ProducerDetail from "../components/SearchPanel/ProducerDetail.jsx";
import Checkout from "../components/SearchPanel/Checkout.jsx";
import { api } from "../utils/api.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MapView() {
  const [producers, setProducers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducer, setSelectedProducer] = useState(null);
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
          products: p.inventory ? p.inventory.map((item) => item.name) : [],
          fullProducts: p.inventory || [],
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

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = e.clientX;
      if (newWidth > 250 && newWidth < 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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
      (p.products &&
        p.products.some((prod) => prod.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#faf6ef",
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
          width: isSidebarOpen ? "6px" : "0px",
          backgroundColor: isDragging ? "#4a7c59" : "transparent",
          cursor: isSidebarOpen ? "col-resize" : "default",
          position: "relative",
          display: "flex",
          alignItems: "center",
          transition: "background-color 0.2s ease",
        }}
      >
        {isSidebarOpen && (
          <div
            style={{
              width: "2px",
              height: "100%",
              backgroundColor: "#c4a882",
              position: "absolute",
              left: "2px",
            }}
          />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarOpen(!isSidebarOpen);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            left: isSidebarOpen ? "-16px" : "0px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "32px",
            height: "48px",
            backgroundColor: "#fffdf7",
            border: "2px solid #c4a882",
            borderLeft: isSidebarOpen ? "2px solid #c4a882" : "none",
            borderRadius: isSidebarOpen ? "8px 0 0 8px" : "0 8px 8px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2001,
            boxShadow: isSidebarOpen
              ? "-2px 0 5px rgba(0,0,0,0.1)"
              : "2px 0 5px rgba(0,0,0,0.1)",
            color: "#3e2f1c",
            padding: 0,
            outline: "none",
          }}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </div>

      {selectedProducer && (
        <ProducerDetail
          producer={selectedProducer}
          onClose={() => setSelectedProducer(null)}
          onOrder={(product, dist, mode) =>
            setCheckoutInfo({ product, producer: dist, mode })
          }
        />
      )}

      <div style={{ flex: 1, position: "relative", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            pointerEvents: "none",
            paddingTop: "10px",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            <Header />
          </div>
        </div>

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

      {checkoutInfo && (
        <div style={{ position: "relative", zIndex: 5001 }}>
          {" "}
          <Checkout
            product={checkoutInfo.product}
            producer={checkoutInfo.producer}
            mode={checkoutInfo.mode}
            onClose={() => setCheckoutInfo(null)}
          />
        </div>
      )}
    </div>
  );
}
