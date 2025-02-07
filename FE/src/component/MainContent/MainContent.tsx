import React, { useState, useEffect, useRef } from "react";
import { getUserData, getUserHistoryData, closeSSE, openSSE } from "../../api";
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
  const [totalDistance, setTotalDistance] = useState<number>(2000);

  const sseRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (activeButton === "live") {
      setDistanceGraphXAxis(
        Array.from(
          { length: Math.floor(totalDistance / distance) + 1 },
          (_, i) => i * distance
        )
      );

      // Open SSE connection when live is selected
      openSSE(distance, totalDistance, (data) => {
        setDistanceGraphXAxis(data["XAxis"]);
        setDistanceGraphYAxis(data["YAxis"]);
        setHistoryGraphDates(data["names"]);
      }).then((sse) => {
        // Store SSE connection in ref
        sseRef.current = sse;
      });

      // Cleanup function: Close SSE when component unmounts or when the button is switched
      return () => {
        if (sseRef.current) {
          closeSSE(sseRef.current); // Close the SSE connection on cleanup
          sseRef.current = null; // Reset ref
        }
      };
    } else {
      // Close SSE when switching away from "live"
      if (sseRef.current) {
        closeSSE(sseRef.current);
        sseRef.current = null;
      }

      // Fetch history or current data based on the selected button
      const fetchData = async () => {
        try {
          if (activeButton === "history") {
            let data = await getUserHistoryData(name, distance);
            if (data) {
              setHistoryGraphYAxis(data.YAxis);
              setHistoryGraphXAxis(data.XAxis);
              setHistoryGraphDates(data.dates);
            } else {
              setHistoryGraphYAxis(undefined);
              setHistoryGraphXAxis(undefined);
              setHistoryGraphDates(undefined);
            }
          } else if (activeButton === "current") {
            let data = await getUserData(name, distance);
            if (data) {
              setDistanceGraphYAxis(data.YAxis);
              setDistanceGraphXAxis(data.XAxis);
            } else {
              setDistanceGraphYAxis(undefined);
              setDistanceGraphXAxis(undefined);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [name, activeButton, distance, totalDistance]);
  useEffect(() => {
    if (sseRef.current) {
      closeSSE(sseRef.current);
      openSSE(distance, totalDistance, (data) => {
        setDistanceGraphXAxis(data["XAxis"]);
        setDistanceGraphYAxis(data["YAxis"]);
        setHistoryGraphDates(data["names"]);
      }).then((sse) => {
        sseRef.current = sse;
      });
    }
  }, [totalDistance]); // This effect will run when totalDistance changes

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
        {activeButton === "live" ? (
          <>
            <div>distance to sensor:</div>
            <input
              type="number"
              value={totalDistance}
              onChange={(e) => {
                setTotalDistance(Number(e.target.value));
              }}
              placeholder={"Enter Total distance..."}
              className="toggle-button"
              style={{ margin: "0" }}
            />
          </>
        ) : (
          ""
        )}
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
