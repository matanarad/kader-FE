import React, { useState, useEffect } from "react";
import { getUserData, getUserHistoryData } from "../../api";
import GenericGraph from "./GenericGraph";
import "./MainContent.css";
interface DistanceGraphProps {
  name: string;
  tagId: number;
}
const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
const MainContent: React.FC<DistanceGraphProps> = ({ name }) => {
  const [activeButton, setActiveButton] = useState<
    "history" | "current" | "live"
  >("current");
  const [distanceGraphYAxis, setDistanceGraphYAxis] = useState<
    number[][] | undefined
  >(undefined);
  const [distanceGraphXAxis, setDistanceGraphXAxis] = useState<
    number[] | undefined
  >(undefined);
  const [historyGraphYAxis, setHistoryGraphYAxis] = useState<
    number[][] | undefined
  >(undefined);
  const [historyGraphXAxis, setHistoryGraphXAxis] = useState<
    number[] | undefined
  >(undefined);
  const [historyGraphDates, setHistoryGraphDates] = useState<
    string[] | undefined
  >(undefined);
  // Fetch data using axios based on name and tagId
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getUserData(name);
        if (data !== null) {
          setDistanceGraphYAxis(data.YAxis);
          setDistanceGraphXAxis(data.XAxis);
        } else {
          setDistanceGraphYAxis(undefined);
          setDistanceGraphXAxis(undefined);
        }
      } catch (error) {
        console.error("Error fetching distance data:", error);
        setDistanceGraphYAxis(undefined);
        setDistanceGraphXAxis(undefined);
      }
      try {
        let data = await getUserHistoryData(name);
        if (data !== null) {
          setHistoryGraphYAxis(data.YAxis);
          setHistoryGraphXAxis(data.XAxis);
          setHistoryGraphDates(data.dates);
        } else {
          setHistoryGraphYAxis(undefined);
          setHistoryGraphXAxis(undefined);
          setHistoryGraphDates(undefined);
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
        setHistoryGraphYAxis(undefined);
        setHistoryGraphXAxis(undefined);
        setHistoryGraphDates(undefined);
      }
    };

    fetchData();
  }, [name]);

  return (
    <div className="main-content">
      {activeButton === "current" ? (
        <GenericGraph
          name="Distance Over Time"
          xAxisData={distanceGraphXAxis}
          yAxisData={distanceGraphYAxis}
          legendData={[name]}
          tickFormatter={formatSecondsToTime}
        />
      ) : (
        <GenericGraph
          name={`${name} Over Time`}
          xAxisData={historyGraphXAxis}
          yAxisData={historyGraphYAxis}
          legendData={historyGraphDates}
          tickFormatter={formatSecondsToTime}
        />
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
        <button
          className={`toggle-button ${activeButton === "live" ? "active" : ""}`}
          onClick={() => setActiveButton("live")}
          disabled={activeButton === "live"} // Disable when active
        >
          Live
        </button>
      </div>
    </div>
  );
};

export default MainContent;
