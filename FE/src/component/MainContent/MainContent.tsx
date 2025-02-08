import React, { useState, useEffect, useRef } from "react";
import { getUserData, getUserHistoryData, closeSSE, openSSE } from "../../api";
import LiveSettings from "../GraphSettings/LiveSettings";
import HistorySettings from "../GraphSettings/HistorySettings";
import CurrentSettings from "../GraphSettings/CurrentSettings";
import GenericGraph from "./GenericGraph";
import "./MainContent.css";
interface MainContentProps {
  names: string[];
  activeButton: string;
  setActiveButton: (activeButton: "history" | "current" | "live") => void;
}
const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
const MainContent: React.FC<MainContentProps> = ({
  names,
  activeButton,
  setActiveButton,
}) => {
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
  const [dateToView, setDateToView] = useState<Date>(new Date());
  const [namesPerLine, setNamesPerLine] = useState<string[]>([]);

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
            let data = await getUserHistoryData(names[0], distance);
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
            let data = await getUserData(names, distance, dateToView);

            let flattenedYAxis: number[][] = []; // Keep the original 2D array structure
            let participantNames: string[] = []; // Array to store the name associated with each YAxis
            let nameCounts: Record<string, number> = {}; // To keep track of name occurrences

            Object.keys(data).forEach((name) => {
              const participantData = data[name];

              // Initialize count for this name if not already present
              if (!nameCounts[name]) {
                nameCounts[name] = 0;
              }

              // Add each YAxis to flattenedYAxis and keep track of the name with index
              participantData.YAxis.forEach((yAxis: number[]) => {
                flattenedYAxis.push(yAxis);

                // Increment the count for this name before appending it
                nameCounts[name] += 1;

                // Append the name with its count (index) to differentiate between multiple entries of the same name
                // participantNames.push(`${name}`);
                participantNames.push(`${name} (${nameCounts[name]})`);
              });
            });

            if (data) {
              setDistanceGraphYAxis(flattenedYAxis); // Set the YAxis data
              setDistanceGraphXAxis(data[names[0]].XAxis); // Set the XAxis data
              setNamesPerLine(participantNames);
              // You can also use participantNames to keep track of the names linked to YAxis data
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
  }, [names, activeButton, distance, totalDistance, dateToView]);

  return (
    <div className="main-content">
      {activeButton === "live" ? (
        <LiveSettings
          setTotalDistance={setTotalDistance}
          totalDistance={totalDistance}
          distance={distance}
          setDistance={setDistance}
        />
      ) : activeButton === "current" ? (
        <CurrentSettings
          distance={distance}
          setDistance={setDistance}
          setDateToView={setDateToView}
          dateToView={dateToView.toISOString().split("T")[0]}
        />
      ) : activeButton === "history" ? (
        <HistorySettings distance={distance} setDistance={setDistance} />
      ) : (
        ""
      )}
      {activeButton === "current" ? (
        (distanceGraphXAxis ?? []).length > 0 &&
        (distanceGraphYAxis?.[0]?.length ?? 0) > 0 ? (
          <GenericGraph
            name="Distance Over Time"
            xAxisData={distanceGraphXAxis}
            yAxisData={distanceGraphYAxis}
            legendData={namesPerLine}
            tickFormatter={formatSecondsToTime}
          />
        ) : (
          "Data not found Try different date"
        )
      ) : activeButton === "history" ? (
        (historyGraphXAxis ?? []).length > 0 &&
        (historyGraphYAxis?.[0]?.length ?? 0) > 0 ? (
          <GenericGraph
            name={`${name} Over Time`}
            xAxisData={historyGraphXAxis}
            yAxisData={historyGraphYAxis}
            legendData={historyGraphDates}
            tickFormatter={formatSecondsToTime}
          />
        ) : (
          "Data not found"
        )
      ) : (distanceGraphXAxis ?? []).length > 0 &&
        (distanceGraphYAxis?.[0]?.length ?? 0) > 0 ? (
        <GenericGraph
          name={`live view`}
          xAxisData={distanceGraphXAxis}
          yAxisData={distanceGraphYAxis}
          legendData={historyGraphDates}
          yAxisTicks={[0, 60, 120, 180, 240, 300, 360]}
          tickFormatter={formatSecondsToTime}
        />
      ) : (
        "Data not found"
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
