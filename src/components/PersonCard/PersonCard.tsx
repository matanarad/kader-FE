import React from "react";
import { Link } from "react-router-dom";
import "./PersonCard.css";
type Person = {
  id: number;
  name: string;
};

interface PersonCardProps {
  person: Person;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <div key={person.id} className="person-card">
      <Link to={`/trainee/${person.id}`} className="name-button">
        {person.name}
      </Link>
    </div>
  );
};
