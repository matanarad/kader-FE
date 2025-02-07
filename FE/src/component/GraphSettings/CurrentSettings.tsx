import React from "react";
import "./Settings.css";
interface CurrentSettingsProps {
  dateToView: string;
  setDateToView: (date: Date) => void;
  setDistance: (distance: number) => void;
  distance: number;
}

const CurrentSettings: React.FC<CurrentSettingsProps> = ({
  dateToView,
  setDateToView,
  setDistance,
  distance,
}) => {
  return (
    <div className="current-settings">
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
        <div>Set view date</div>
        <input
          type="date"
          value={dateToView}
          onChange={(e) => {
            setDateToView(new Date(e.target.value));
          }}
          className="toggle-button"
          style={{ margin: "0" }}
        />
      </div>
    </div>
  );
};

export default CurrentSettings;
