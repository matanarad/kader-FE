import React from "react";
import { TraineeCard } from "../components/TraineeCard/TraineeCard"; // Adjust the path based on your file structure
import { Trainee } from "../interface"; // Adjust the path based on your file structure
import "./HomePage.css";
import plusIcon from "../img/plus.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTraineeData } from "../api"; // Adjust the path based on your file structure

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  useEffect(() => {
    const getTraineeData = async () => {
      const data = await fetchTraineeData();
      if (data) {
        setTrainees(data);
      }
    };
    getTraineeData();
  }, []);
  return (
    <div className="home-page">
      <div className="content-after-logo">
        <h2>ברוכים הבאים למערכת קד"ר</h2>
        <p>
          כאן ניתן לראות את רשימת המשתתפים שהגיעו לאימון היום. ניתן ללחוץ על כל
          אחד מהמשתתפים כדי לראות עוד פרטים עליו.
        </p>
      </div>
      <div className="person-list-container">
        {trainees.map((trainee) => (
          <TraineeCard key={trainee.tag_id} trainee={trainee} />
        ))}
      </div>
      <div className="floating-plus-button" onClick={() => navigate("/scan")}>
        <img src={plusIcon} style={{ width: "50%" }} />
      </div>
    </div>
  );
};

export default HomePage;
