import React from "react";
import "./Settings.css";
interface LiveSettingsProps {
  totalDistance: number;
  setTotalDistance: (totalDistance: number) => void;
  setDistance: (distance: number) => void;
  distance: number;
}

const LiveSettings: React.FC<LiveSettingsProps> = ({
  totalDistance,
  setTotalDistance,
  setDistance,
  distance,
}) => {
  return (
    <div className="live-settings">
      <div>
        <div className="label">{"Distance to sensor [meters]"}</div>
        <input
          type="number"
          value={distance}
          onChange={(e) => {
            setDistance(Number(e.target.value));
          }}
          placeholder={"Enter distance..."}
          className="input-style"
        />
      </div>
      <div>
        <div className="label">{"Total running distance [meters]"}</div>
        <input
          type="number"
          value={totalDistance}
          onChange={(e) => {
            setTotalDistance(Number(e.target.value));
          }}
          placeholder={"Enter Total distance..."}
          className="input-style"
        />
      </div>
    </div>
  );
};

export default LiveSettings;
