import Orders from "../components/Orders/Orders.jsx";
import "./Dashboard.css";
import Header from "../components/Header/Header.jsx";

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="header">
                <Header />
            </div>
            <div className="dashboard-bottom-left">
                <Orders />
            </div>
        </div>
    );
}

export default Dashboard;
