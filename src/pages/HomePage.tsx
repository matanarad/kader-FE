import React from "react";
import { PersonCard } from "../components/PersonCard/PersonCard"; // Assuming this is a component displaying individual person's details
import { RootState } from "../store"; // Adjust the path based on your file structure
import { useSelector } from "react-redux";
import logo from "../img/Logo.png"; // Adjust the path according to your project structure
import "./HomePage.css";
const HomePage: React.FC = () => {
  const people = useSelector((state: RootState) => state.people.people);
  return (
    <div className="home-page">
      <div className="logo-container">
        <img src={logo} alt="Workout Arrivals Logo" className="logo" />
      </div>
      <div className="content-between-logo-and-list">
        <h2>ברוכים הבאים למערכת קד"ר</h2>
        <p>
          כאן ניתן לראות את רשימת המשתתפים שהגיעו לאימון היום ניתן ללחות על כל
          אל כל אחד מהמשתתפים כדי לראות עוד פרטים עליו
        </p>
      </div>
      <div className="person-list-container">
        {people.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
