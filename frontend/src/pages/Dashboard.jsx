import Orders from "../components/Orders/Orders.jsx";
import "./Dashboard.css";
import Header from "../components/Header/Header.jsx";
import { useAuth } from "../contexts/useAuth";

function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <Header />
            <main className="dashboard-main">
                <div className="orders-section">
                    <Orders />
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
