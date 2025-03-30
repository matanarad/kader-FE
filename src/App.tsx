import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import TraineePage from "./pages/TraineePage";
import ScanPage from "./pages/ScanPage";
import logo from "./img/Logo.png"; // Adjust the path according to your project structure

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App: React.FC = () => {
  return (
    <Router basename="/kader-FE">
      <div className="App">
        <div className="logo-container">
          <img src={logo} alt="Workout Arrivals Logo" className="logo" />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trainee/:tag_id" element={<TraineePage />} />
          <Route path="/scan" element={<ScanPage />} />
        </Routes>
        <ToastContainer rtl />
      </div>
    </Router>
  );
};

export default App;
