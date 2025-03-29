import React from "react";
import { TraineeCard } from "../components/TraineeCard/TraineeCard"; // Adjust the path based on your file structure
import { Trainee } from "../interface"; // Adjust the path based on your file structure
import "./HomePage.css";
import plusIcon from "../img/plus.svg";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
  trainees: Trainee[];
}

const HomePage: React.FC<HomePageProps> = ({ trainees }) => {
  const navigate = useNavigate();

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
