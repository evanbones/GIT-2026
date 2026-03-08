import { Link } from "react-router-dom";
import { useAuth } from "./contexts/useAuth";
import Header from "./components/Header/Header.jsx";
import Map from "./components/Map/Map.jsx";
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
            Connect your business or non-profit directly with local farms and producers. Build sustainable partnerships and keep value right here in our local economy..
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

      <section className="map-preview-section">
        <Map />
      </section>
    </div>
  );
}

export default Home;
