import React from "react";
import { Link } from "react-router-dom";
import "./TraineeCard.css";
import { Trainee } from "../../interface"; // Adjust the path based on your file structure

interface TraineeCardProps {
  trainee: Trainee;
}

export const TraineeCard: React.FC<TraineeCardProps> = ({ trainee }) => {
  return (
    <div key={trainee.tag_id} className="person-card">
      <Link to={`/trainee/${trainee.tag_id}`} className="name-button">
        {trainee.name}
      </Link>
    </div>
  );
};
