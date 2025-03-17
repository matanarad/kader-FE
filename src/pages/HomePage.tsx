import React from "react";
import { PersonCard } from "../components/PersonCard/PersonCard"; // Assuming this is a component displaying individual person's details

import { Person } from "../interface"; // Adjust the path based on your file structure
import "./HomePage.css";
interface HomePageProps {
  trainees: Person[];
}

const HomePage: React.FC<HomePageProps> = ({ trainees }) => {
  return (
    <div className="home-page">
      <div className="content-after-logo">
        <h2>ברוכים הבאים למערכת קד"ר</h2>
        <p>
          כאן ניתן לראות את רשימת המשתתפים שהגיעו לאימון היום ניתן ללחות על כל
          אל כל אחד מהמשתתפים כדי לראות עוד פרטים עליו
        </p>
      </div>
      <div className="person-list-container">
        {trainees.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
