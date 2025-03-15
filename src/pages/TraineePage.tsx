import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { RootState } from "../store"; // Adjust the path based on your file structure
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  const getChartData = (runResults: number[], runDates: string[]) => {
    return {
      labels: runDates,
      datasets: [
        {
          label: "2000m Run Results",
          data: runResults,
          borderColor: "#f8d91d",
          backgroundColor: "rgba(248, 217, 29, 0.2)",
          borderWidth: 2,
          pointBackgroundColor: "#f8d91d",
          tension: 0.4,
        },
      ],
    };
  };

  return (
    <div className="trainee-page">
      <h2>{person.name}</h2>
      <p>
        <strong>Arrival Time:</strong> {person.arrivalTime}
      </p>
      <p>
        <strong>Best 2000m Run Result:</strong> {person.best2000mRunResult}
      </p>
      <h3>2000m Run Results</h3>
      <div style={{ width: "100%", height: "400px" }}>
        <Line data={getChartData(person.runResults, person.runDates)} />
      </div>
      <button onClick={() => navigate("/")} className="back-button">
        Back
      </button>
    </div>
  );
};

export default TraineePage;
