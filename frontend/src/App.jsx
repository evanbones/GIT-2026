import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import "./App.css";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import MapView from "./pages/MapView.jsx";
import Onboard from "./pages/Onboard.jsx"
import Clippy from "./components/Clippy/Clippy.jsx";
import AuthHandler from "./components/AuthHandler.jsx";

function App() {
  const [account, setAccount] = useState(false);

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AuthHandler />
          <Routes>
            <Route path="/" element={<Home account={account} setAccount={setAccount} />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard account={account} setAccount={setAccount} />
              </PrivateRoute>
            } />
            <Route path="/sign-up" element={<SignUp setAccount={setAccount} />} />
            <Route path="/sign-in" element={<SignIn setAccount={setAccount} />} />
            <Route path="/onboard" element={
              <PrivateRoute>
                <Onboard account={account} />
              </PrivateRoute>
            } />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Clippy />
    </>
  );
}

export default App;
