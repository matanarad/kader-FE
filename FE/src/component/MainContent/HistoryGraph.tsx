import React, { useEffect, useState } from "react";
import { getUserHistoryData } from "../../api";
import {
  LineChart,
  Line,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./MainContent.css";
interface Entry {
  time: string;
  distance: number;
}

interface DistanceGraph {
  name: string;
  tagId: number;
}

const HistoryGraph: React.FC<DistanceGraph> = ({ name }) => {
  const [dataDict, setDataDict] = useState<{ [key: string]: Entry[] }>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data using axios based on name and tagId
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getUserHistoryData(name);
        if (data !== null) {
          setDataDict(data);
          console.log(data);
        } else {
          setDataDict({});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setDataDict({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);
  interface ChartData {
    distance: number[];
    [key: string]: string[] | number[]; // This allows for other dates as keys with an array of strings (times)
  }
  const data: ChartData = {
    distance: [
      0, 200, 300, 500, 600, 800, 900, 1100, 1200, 1400, 1500, 1700, 1800, 2000,
    ],
    "01/01/2024": [
      "0:00",
      "0:40",
      "1:00",
      "1:40",
      "2:00",
      "2:40",
      "3:00",
      "3:40",
      "4:00",
      "4:40",
      "5:00",
      "5:40",
      "6:00",
      "6:40",
    ],
    "01/02/2024": [
      "0:00",
      "0:37",
      "0:57",
      "1:33",
      "1:54",
      "2:30",
      "2:51",
      "3:20",
      "3:48",
      "4:20",
      "4:45",
      "5:28",
      "5:50",
      "6:30",
    ],
  };

  // Convert time to seconds for better charting
  const convertTimeToSeconds = (time: string): number => {
    // Ensure that the time is a valid string before attempting to split
    if (time && typeof time === "string") {
      const [minutes, seconds] = time.split(":").map(Number);
      return minutes * 60 + seconds;
    }
    // If time is invalid, return 0 as a fallback
    return 0;
  };

  // Preparing the data for the chart
  const chartData = Object.keys(dataDict)
    .filter((key) => key !== "distance")
    .map((date) => {
      dataDict[date].map((d) => {
        console.log(d);
      });

      return {
        date,
        times: dataDict[date].map((entry: Entry) =>
          convertTimeToSeconds(entry)
        ), // map Entry[] to time and convert to seconds
      };
    });
  console.log(chartData);

  if (loading) {
    return <div>Loading...</div>;
  }
  const lineColors = ["#4bc0c0", "#ff7300", "#f00000", "#6a5acd", "#32cd32"]; // Add as many colors as you need

  return (
    <>
      {Object.keys(dataDict).length > 0 ? (
        <>
          <div className="distance-graph">
            <h3>Person Over Time</h3>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart
                data={data.distance.map((distance: number, index: number) => ({
                  ...chartData.reduce(
                    (acc: { [key: string]: number }, { date, times }) => {
                      acc[date] = times[index]; // Assign time value based on the distance index
                      return acc;
                    },
                    { distance }
                  ),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="distance" />
                <YAxis />
                <Tooltip />
                {chartData.map(({ date }, index) => (
                  <Line
                    key={date}
                    type="monotone"
                    dataKey={date}
                    stroke={lineColors[index % lineColors.length]} // Alternating line colors
                    fillOpacity={0.2}
                    strokeWidth={3}
                  >
                    <Label
                      value={date}
                      position="top"
                      offset={10}
                      fontSize={14}
                      fill="#333"
                    />{" "}
                    {/* Label above each line */}
                  </Line>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <h3>User not found</h3>
      )}
    </>
  );
};

export default HistoryGraph;
