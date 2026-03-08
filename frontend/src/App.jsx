import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import MapView from "./pages/MapView.jsx";
import Onboard from "./pages/Onboard.jsx";
import Clippy from "./components/Clippy/Clippy.jsx";
import AuthHandler from "./components/AuthHandler.jsx";
import ProducerDashboard from "./components/ProducerDashboard/ProducerDashboard.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AuthHandler />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute redirectTo="/login">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/onboard"
              element={
                <PrivateRoute>
                  <Onboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute allowedRoles={["producer"]}>
                  <ProducerDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Clippy />
    </>
  );
}

export default App;
