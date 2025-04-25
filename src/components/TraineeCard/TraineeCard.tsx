import React from "react";
import { Link } from "react-router-dom";
import "./TraineeCard.css";
import { Trainee } from "../../interface"; // Adjust the path based on your file structure

interface TraineeCardProps {
  trainee: Trainee;
  date?: string; // Optional date prop for the trainee
  lastArrival?: string; // New prop for last arrival date
}

export const TraineeCard: React.FC<TraineeCardProps> = ({ trainee, date }) => {
  // Determine the badge class based on days passed
  const getBadgeClass = (): string => {
    if (trainee.days_since_last_log <= 7) return "days-badge-recent";
    if (trainee.days_since_last_log <= 30) return "days-badge-warning";
    return "days-badge-alert";
  };

  // Get appropriate message in Hebrew
  const getDaysMessage = (): string => {
    if (trainee.days_since_last_log === 0) return "היום";
    if (trainee.days_since_last_log === 1) return "אתמול";
    return `לפני ${trainee.days_since_last_log} ימים`;
  };

  return (
    <div key={trainee.tag_id} className="person-card">
      <Link to={`/trainee/${trainee.tag_id}/${date}`} className="name-button">
        {trainee.name}
      </Link>

      {trainee.days_since_last_log >= 0 && (
        <div className={`days-badge ${getBadgeClass()}`}>
          <div>נראה לאחרונה: {getDaysMessage()}</div>
        </div>
      )}
    </div>
  );
};
