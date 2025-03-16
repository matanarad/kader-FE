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
  run_result: number[];
  run_dates: string[];
}

const GenericGraph: React.FC<LineGraphProps> = ({ run_result, run_dates }) => {
  const data = {
    labels: run_dates,
    datasets: [
      {
        data: run_result,
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
