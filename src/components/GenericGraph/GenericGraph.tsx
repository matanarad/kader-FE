import React from "react";
import { Line } from "react-chartjs-2";
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
import { Run } from "../../interface"; // Adjust the path based on your file structure
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  runs: Run[];
}

const GenericGraph: React.FC<LineGraphProps> = ({ runs }) => {
  const data = {
    labels: runs.map((run) => run.date),
    datasets: [
      {
        data: runs.map((run) => run.time),
        borderColor: "#88a371",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 20 } },
      y: { ticks: { font: { size: 10 } } },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default GenericGraph;
