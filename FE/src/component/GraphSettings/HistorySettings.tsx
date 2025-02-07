import React from "react";
import "./Settings.css";
interface HistorySettingsProps {
  setDistance: (distance: number) => void;
  distance: number;
}

const HistorySettings: React.FC<HistorySettingsProps> = ({
  setDistance,
  distance,
}) => {
  return (
    <div className="history-settings">
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
    </div>
  );
};

export default HistorySettings;
