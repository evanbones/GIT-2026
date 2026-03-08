import Header from "../components/Header/Header.jsx";
import ProducerDashboard from "../components/ProducerDashboard/ProducerDashboard.jsx";
import RetailerDashboard from "../components/RetailerDashboard/RetailerDashboard.jsx";
import { useAuth } from "../contexts/useAuth";
import "./Dashboard.css";

function Dashboard() {
    const { isProducer, isRetailer } = useAuth();

    const renderDashboard = () => {
        if (isProducer) return <ProducerDashboard />;
        if (isRetailer) return <RetailerDashboard />;
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#7a5c3e' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#3e2f1c' }}>Finish setting up your account</h2>
                <p>You haven't set up a business profile yet.</p>
                <a href="/onboard" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.25rem', background: '#4a7c59', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>
                    Set up your business →
                </a>
            </div>
        );
    };

    return (
        <div className="dashboard">
            <Header />
            <main className="dashboard-main">
                {renderDashboard()}
            </main>
        </div>
    );
}

export default Dashboard;
