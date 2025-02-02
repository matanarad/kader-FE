import React, { useEffect, useState } from "react";
import axios from "axios";
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
  name: string | undefined;
  tagId: string | undefined;
}

const MainContent: React.FC<MainContentProps> = ({ name, tagId }) => {
  const [dataDict, setDataDict] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data using axios based on name and tagId
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:8000/data?name=${name}&tagId=${tagId}`
        );

        setDataDict(response.data); // Assuming the response returns the dataDict array
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

  return (
    <div className="main-content">
      {dataDict.length > 0 ? (
        <>
          <div className="distance-graph">
            <h3>Distance Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="distance"
                  stroke="#4bc0c0"
                  fill="#4bc0c0"
                  fillOpacity={0.2}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pace-graph">
            <h3>{"Pace Over Time (min/km)"}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pace"
                  stroke="#9966ff"
                  fill="#9966ff"
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
