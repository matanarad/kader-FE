import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import TraineePage from "./pages/TraineePage";
import logo from "./img/Logo.png"; // Adjust the path according to your project structure
import { useEffect, useState } from "react";
import { fetchTraineeData } from "./api";
import { Person } from "./interface";
const App: React.FC = () => {
  const [trainees, setTrainees] = useState<Person[]>([]);
  useEffect(() => {
    const getTraineeData = async () => {
      const data = await fetchTraineeData();
      if (data) {
        setTrainees(data.people);
      }
    };
    getTraineeData();
  }, []);
  return (
    <Router>
      <div className="App">
        <div className="logo-container">
          <img src={logo} alt="Workout Arrivals Logo" className="logo" />
        </div>
        <Routes>
          <Route path="/" element={<HomePage trainees={trainees} />} />
          <Route
            path="/trainee/:id"
            element={<TraineePage trainees={trainees} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
