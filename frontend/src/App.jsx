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
          <Route path="/" element={<Home account={account} setAccount={setAccount} />} />
          <Route path="/dashboard" element={<Dashboard account={account} setAccount={setAccount} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
