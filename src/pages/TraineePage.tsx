import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../store"; // Adjust the path based on your file structure
import { useSelector } from "react-redux";

import GenericGraph from "../components/GenericGraph/GenericGraph";
import "./TraineePage.css";

type Person = {
  id: number;
  name: string;
  arrivalTime: string;
  best2000mRunResult: string;
  runResults: number[];
  runDates: string[];
};

const TraineePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const people = useSelector((state: RootState) => state.people.people);
  const peopleData = people as Person[];
  const person = peopleData.find((p) => p.id === Number(id));

  if (!person) {
    return <div>Trainee not found.</div>;
  }

  return (
    <div className="trainee-page" dir="rtl">
      <div className="content-after-logo">
        <h2>{person.name}</h2>
      </div>
      <div className="arrival-time-container">
        <div>
          <strong>זמן הגעה לאימון</strong>
        </div>
        <div dir="ltr">
          <div>{person.arrivalTime}</div>
        </div>
      </div>
      <div className="record-time-container">
        <div>
          <strong>זמן שיא בריצת 2000</strong>
        </div>
        <div dir="ltr">
          <div>{person.best2000mRunResult}</div>
        </div>
      </div>
      <div className="graph-container">
        <div>
          <strong>גרף ריצות 2000</strong>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <GenericGraph
            run_dates={person.runDates}
            run_result={person.runResults}
          />
        </div>
      </div>
      <button onClick={() => navigate("/")} className="back-button">
        חזרה לדף הראשי
      </button>
    </div>
  );
};

export default TraineePage;
