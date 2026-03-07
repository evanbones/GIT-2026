import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import "./App.css";
import Home from "./Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const [account, setAccount] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
