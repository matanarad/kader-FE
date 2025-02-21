import React, { useState, useEffect, useRef } from "react";
import { getUserData, getUserHistoryData, closeSSE, openSSE } from "../../api";
import { generateTimeList } from "../../utils/utils";
import LiveSettings from "../GraphSettings/LiveSettings";
import HistorySettings from "../GraphSettings/HistorySettings";
import CurrentSettings from "../GraphSettings/CurrentSettings";
import GenericGraph from "./GenericGraph";
import "./MainContent.css";
interface MainContentProps {
  names: string[];
  activeButton: string;
  setActiveButton: (activeButton: "history" | "live") => void;
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
      interface Data {
        YAxis: number[][];
        XAxis: number[];
        names: string[];
      }

      function filterData(namesToKeep: string[], dataObject: Data): Data {
        let filteredData: Data = {
          YAxis: [],
          XAxis: [...dataObject.XAxis], // Copy XAxis array
          names: [],
        };

        // Filter YAxis and names based on names list
        namesToKeep.forEach((name) => {
          const index = dataObject.names.indexOf(name);
          if (index !== -1) {
            filteredData.YAxis.push(dataObject.YAxis[index]);
            filteredData.names.push(dataObject.names[index]);
          }
        });

        return filteredData;
      }
      // Open SSE connection when live is selected
      openSSE(distance, totalDistance, names, (data) => {
        data = filterData(names, data);
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
      ) : activeButton === "history" ? (
        <HistorySettings distance={distance} setDistance={setDistance} />
      ) : (
        ""
      )}
      {activeButton === "history" ? (
        (historyGraphXAxis ?? []).length > 0 &&
        (historyGraphYAxis?.[0]?.length ?? 0) > 0 ? (
          <GenericGraph
            name={`${names[0]} History`}
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
          legendData={names}
          yAxisTicks={generateTimeList(100, totalDistance)}
          tickFormatter={formatSecondsToTime}
        />
      ) : (
        "Data not found"
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
