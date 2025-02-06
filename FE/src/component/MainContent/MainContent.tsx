import React, { useState, useEffect } from "react";
import { getUserData, getUserHistoryData, getLiveBaseData } from "../../api";
import GenericGraph from "./GenericGraph";
import "./MainContent.css";
interface MainContentProps {
  name: string;
}
const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
const MainContent: React.FC<MainContentProps> = ({ name }) => {
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
  const [distance, setDistance] = useState<number>(200);

  // Fetch data using axios based on name and tagId
  useEffect(() => {
    if (activeButton == "history") {
      const fetchHistoryByName = async () => {
        try {
          let data = await getUserHistoryData(name, distance);
          if (data !== null) {
            console.log(data);
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
      fetchHistoryByName();
    } else if (activeButton == "current") {
      const fetchByName = async () => {
        try {
          let data = await getUserData(name, distance);

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
      };
      fetchByName();
    } else if (activeButton == "live") {
      const fetchLiveData = async () => {
        try {
          let data = await getLiveBaseData(name);
          if (data !== null) {
            setDistanceGraphYAxis([[]]);
            setDistanceGraphXAxis(data);
          } else {
            setDistanceGraphXAxis(undefined);
          }
        } catch (error) {
          console.error("Error fetching distance data:", error);
          setDistanceGraphXAxis(undefined);
        }
      };
      fetchLiveData();
      // WebSocket Logic
      const ws = new WebSocket(`ws://localhost:8000/ws?name=${name}`);

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.YAxis !== undefined) {
          setDistanceGraphYAxis(message.YAxis);
          // setDistanceGraphXAxis(message.XAxis);

          setHistoryGraphDates(message.names);
        } else {
          console.error("WebSocket Error:", message.error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      return () => {
        ws.close(); // Cleanup WebSocket when component updates/unmounts
      };
    }
  }, [name, activeButton]);

  return (
    <div className="main-content">
      {/* <input className={`toggle-button`}>Current Workout</input> */}
      <div style={{ textAlign: "start" }}>
        <div>distance to sensor:</div>
        <input
          type="number"
          value={distance}
          onChange={(e) => {
            setDistance(Number(e.target.value));
          }}
          placeholder={"Enter distance..."}
          className="toggle-button"
          style={{ margin: "0" }}
        />
      </div>
      {activeButton === "current" ? (
        <GenericGraph
          name="Distance Over Time"
          xAxisData={distanceGraphXAxis}
          yAxisData={distanceGraphYAxis}
          legendData={[name]}
          tickFormatter={formatSecondsToTime}
        />
      ) : activeButton === "history" ? (
        <GenericGraph
          name={`${name} Over Time`}
          xAxisData={historyGraphXAxis}
          yAxisData={historyGraphYAxis}
          legendData={historyGraphDates}
          tickFormatter={formatSecondsToTime}
        />
      ) : (
        <GenericGraph
          name={`live view`}
          xAxisData={distanceGraphXAxis}
          yAxisData={distanceGraphYAxis}
          legendData={historyGraphDates}
          yAxisTicks={[0, 60, 120, 180, 240, 300, 360]}
          tickFormatter={formatSecondsToTime}
        />
      )}

      {/* Toggle Buttons at the bottom */}
      <div className="button-container">
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
          className={`toggle-button ${
            activeButton === "history" ? "active" : ""
          }`}
          onClick={() => setActiveButton("history")}
          disabled={activeButton === "history"} // Disable when active
        >
          History
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
