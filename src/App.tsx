import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import TraineePage from "./pages/TraineePage";
import logo from "./img/Logo.png"; // Adjust the path according to your project structure

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <div className="logo-container">
          <img src={logo} alt="Workout Arrivals Logo" className="logo" />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trainee/:id" element={<TraineePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
