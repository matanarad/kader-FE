import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserData } from "../../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./MainContent.css";

// Define types for the data structure
interface DataItem {
  time: string;
  distance: number;
}

interface MainContentProps {
  name: string;
  tagId: number;
}

const MainContent: React.FC<MainContentProps> = ({ name, tagId }) => {
  const [dataDict, setDataDict] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data using axios based on name and tagId
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getUserData(name, tagId);
        if (data !== null) {
          setDataDict(data);
        } else {
          setDataDict([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setDataDict([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name, tagId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Extract distance data
  const distanceData = dataDict.map((item) => item.distance);

  // Calculate pace (time per km) - assuming time is in minutes
  const paceData = distanceData.map((dist, index) => {
    if (index === 0) return 0; // pace is undefined at 0 distance
    const timeInMinutes = (index * 40) / 60; // Convert the time from minutes and seconds (0:40 = 40 seconds)
    const pace = (timeInMinutes * 1000) / dist; // pace in minutes per kilometer
    return pace;
  });

  // Combine data for graph
  const data = dataDict.map((item, index) => ({
    time: item.time,
    distance: item.distance,
    pace: paceData[index],
  }));
  const formatTime = (seconds: string | number) => {
    const minutes = Math.floor(Number(seconds) / 60);
    const secs = Number(seconds) % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formattedData = data.map((item) => ({
    ...item,
    timeInSeconds:
      parseInt(item.time.split(":")[0]) * 60 +
      parseInt(item.time.split(":")[1]),
  }));
  return (
    <div className="main-content">
      {dataDict.length > 0 ? (
        <>
          <div className="distance-graph">
            <h3>Distance Over Time</h3>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="distance" />
                <YAxis
                  dataKey="timeInSeconds"
                  tickFormatter={formatTime}
                  tickCount={formattedData.length}
                />

                <Tooltip
                  labelFormatter={(label) => `Distance: ${label}m`}
                  formatter={(value: any) => [formatTime(value), "Time"]}
                />
                <Line
                  type="monotone"
                  dataKey="timeInSeconds"
                  stroke="#4bc0c0"
                  fill="#4bc0c0"
                  fillOpacity={0.2}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <h3>User not found</h3>
      )}
    </div>
  );
};

export default MainContent;
