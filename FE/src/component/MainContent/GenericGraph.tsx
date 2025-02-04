import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./MainContent.css";

interface GenericGraphProps {
  name: string;
  xAxisData: number[] | undefined;
  yAxisData: number[][] | undefined;
  legendData?: string[];
  yAxisLabel?: string;
  xAxisLabel?: string;
  tickFormatter?: (value: number) => string;
}

const GenericGraph: React.FC<GenericGraphProps> = ({
  name,
  xAxisData,
  yAxisData,
  yAxisLabel,
  xAxisLabel,
  legendData,
  tickFormatter,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<object[]>([]);

  useEffect(() => {
    console.log(xAxisData, yAxisData);

    if (xAxisData && yAxisData && yAxisData.length > 0) {
      // Format data to match Recharts' expectations
      const formattedData = xAxisData.map((distance, index) => {
        const entry: any = { distance }; // X-axis values
        yAxisData.forEach((yData, i) => {
          entry[`time_${i}`] = yData[index]; // Create unique keys for each line
        });
        return entry;
      });

      setChartData(formattedData);
      setLoading(false);
    }
  }, [xAxisData, yAxisData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="distance-graph">
      <h3>{name}</h3>
      <ResponsiveContainer width="100%" height={600}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="distance"
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
            tickFormatter={tickFormatter}
          />
          <Legend verticalAlign="bottom" height={36} />

          {yAxisData?.map((_, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={`time_${index}`}
              stroke={["#4bc0c0", "#ff7300", "#8884d8", "#82ca9d"][index % 4]} // Multiple colors
              fillOpacity={0.2}
              strokeWidth={3}
              name={legendData?.[index] ?? `Line ${index + 1}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenericGraph;
