import React, { useState } from "react";
import DistanceGraph from "./DistanceGraph";
import HistoryGraph from "./HistoryGraph";
import "./MainContent.css";
interface DistanceGraphProps {
  name: string;
  tagId: number;
}

const MainContent: React.FC<DistanceGraphProps> = ({ name, tagId }) => {
  const [activeButton, setActiveButton] = useState<"history" | "current">(
    "history"
  );

  return (
    <div className="main-content">
      {activeButton === "current" ? (
        <DistanceGraph name={name} tagId={tagId} />
      ) : (
        <HistoryGraph name={name} tagId={tagId} />
      )}

      {/* Toggle Buttons at the bottom */}
      <div className="button-container">
        <button
          className={`toggle-button ${
            activeButton === "history" ? "active" : ""
          }`}
          onClick={() => setActiveButton("history")}
          disabled={activeButton === "history"} // Disable when active
        >
          History
        </button>
        <button
          className={`toggle-button ${
            activeButton === "current" ? "active" : ""
          }`}
          onClick={() => setActiveButton("current")}
          disabled={activeButton === "current"} // Disable when active
        >
          Current Workout
        </button>
      </div>
    </div>
  );
};

export default MainContent;
