import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/useAuth";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Map from "./components/Map/Map.jsx";
import { Sprout, Handshake, TrendingUp } from "lucide-react";
import "./Home.css";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-wrapper">
      <Header />

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Rooted in community. Sourced locally.</h1>
          <p className="hero-subtitle">
            Connect your business or non-profit directly with local farms and producers.
            Build sustainable partnerships and keep value right here in our local economy.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            ) : (
              <Link to="/sign-up" className="btn-primary">Get Started</Link>
            )}
            <Link to="/map" className="btn-secondary">Explore the Map</Link>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <Sprout size={40} strokeWidth={1.5} />
          </div>
          <h3>Fresh & Local</h3>
          <p>Source directly from producers in your community, reducing food miles and ensuring peak freshness.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Handshake size={40} strokeWidth={1.5} />
          </div>
          <h3>Direct Connections</h3>
          <p>Cut out the middleman. Build meaningful, transparent relationships with the people who grow your food.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <TrendingUp size={40} strokeWidth={1.5} />
          </div>
          <h3>Empower Economy</h3>
          <p>Keep your purchasing power local and help independent farms and local producers thrive.</p>
        </div>
      </section>

      <section className="map-preview-section">
        <h2 className="section-title">Discover Producers Near You</h2>
        <div className="map-container-wrapper">
          <Map />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
