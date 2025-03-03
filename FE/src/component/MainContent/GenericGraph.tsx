import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./MainContent.css";
import {
  convertToPace,
  formatSecondsToTime,
  getPaceTicks,
  formatSecondsToPace,
} from "../../utils/utils";

interface GenericGraphProps {
  name: string;
  xAxisData: number[] | undefined;
  yAxisData: number[][] | undefined;
  legendData?: string[];
  yAxisLabel?: string;
  xAxisLabel?: string;
  yAxisTicks?: number[];
}

const GenericGraph: React.FC<GenericGraphProps> = ({
  name,
  xAxisData,
  yAxisData,
  yAxisLabel,
  xAxisLabel,
  legendData,
  yAxisTicks,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<object[]>([]);
  const [graphType, setGraphType] = useState<"pace" | "time">("pace"); // Toggle state

  useEffect(() => {
    if (xAxisData && yAxisData && yAxisData.length > 0) {
      const formattedData = xAxisData.map((distance, index) => {
        const entry: any = { distance };
        yAxisData.forEach((yData, i) => {
          entry[`time_${i}`] = yData[index];
        });
        return entry;
      });
      if (graphType == "pace") {
        setChartData(convertToPace(formattedData));
      } else {
        setChartData(formattedData);
      }

      setLoading(false);
    }
  }, [xAxisData, yAxisData, graphType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            textAlign: "left",
          }}
        >
          {payload.map((entry: any, index: number) => {
            let { name, value } = entry;
            const minutes = Math.floor(value); // Get the integer part (minutes)
            const seconds = Math.round((value - minutes) * 60); // Get the fractional part and convert to seconds

            // Format minutes and seconds as two digits
            const formattedMinutes = minutes.toString().padStart(2, "0");
            const formattedSeconds = seconds.toString().padStart(2, "0");
            if (formattedMinutes !== "NaN") {
              if (graphType === "pace") {
                return (
                  <p key={index} style={{ color: "black" }}>
                    {name} - {formattedMinutes}:{formattedSeconds}m/km
                  </p>
                );
              } else {
                return (
                  <p key={index} style={{ color: "black" }}>
                    {name}: {formatTime(Number(value))}
                  </p>
                );
              }
            } else {
              return "";
            }
          })}
        </div>
      );
    }
  };

  const getColorForName = (name: string) => {
    name = name.split(" ")[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 6) - hash);
    }

    // Increase the range of color values by applying a larger mask and adding some randomness
    const randomFactor = Math.floor(Math.random() * 0x1000000); // Adds more randomness
    const color = ((hash ^ randomFactor) & 0x00ffffff)
      .toString(16)
      .padStart(6, "0");

    return `#${color}`;
  };

  return (
    <div className="distance-graph">
      {/* Header container for title and toggle button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ margin: 0 }}>{name}</h3>
        <button
          onClick={() => setGraphType(graphType == "pace" ? "time" : "pace")}
        >
          {graphType == "pace" ? "Time graph" : "Pace graph"}
        </button>
      </div>

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
            tickFormatter={
              graphType == "pace" ? formatSecondsToPace : formatSecondsToTime
            }
            ticks={
              graphType == "pace"
                ? getPaceTicks(convertToPace(chartData))
                : yAxisTicks
            }
          />
          <Tooltip content={<CustomTooltip />} />

          <Legend verticalAlign="bottom" height={36} />

          {yAxisData?.map((_, index) => {
            const legendName = legendData?.[index] ?? `Line ${index + 1}`;
            const color = getColorForName(legendName);

            return (
              <Line
                key={index}
                type="monotone"
                dataKey={
                  graphType == "pace" ? `pace_${index}` : `time_${index}`
                }
                stroke={color}
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
