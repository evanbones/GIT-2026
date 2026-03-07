import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import "./App.css";
import Home from "./Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import MapView from "./pages/MapView.jsx";

function App() {
  const [account, setAccount] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home account={account} setAccount={setAccount} />} />
          <Route path="/dashboard" element={<Dashboard account={account} setAccount={setAccount} />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
