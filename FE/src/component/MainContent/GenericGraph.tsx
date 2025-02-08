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
  yAxisTicks?: number[];
}

const GenericGraph: React.FC<GenericGraphProps> = ({
  name,
  xAxisData,
  yAxisData,
  yAxisLabel,
  xAxisLabel,
  legendData,
  tickFormatter,
  yAxisTicks,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<object[]>([]);

  useEffect(() => {
    // console.log(xAxisData, yAxisData);

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
  // Helper function to generate a color based on the name
  const getColorForName = (name: string) => {
    name = name.split(" ")[0];
    // Simple hash function to map names to colors
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 6) - hash);
    }
    const color = (hash & 0x00ffffff).toString(16).padStart(6, "0");
    return `#${color}`; // Convert hash to a color
  };

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
            ticks={yAxisTicks} // Define fixed labels
          />
          <Legend verticalAlign="bottom" height={36} />

          {yAxisData?.map((_, index) => {
            // Get the name associated with this line
            const legendName = legendData?.[index] ?? `Line ${index + 1}`;

            // Use the same color for lines with the same name
            const color = getColorForName(legendName);

            return (
              <Line
                key={index}
                type="monotone"
                dataKey={`time_${index}`}
                stroke={color} // Use the calculated color
                fillOpacity={0.2}
                strokeWidth={3}
                name={legendName}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenericGraph;
