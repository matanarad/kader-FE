import React from "react";

interface ParticipantListProps {
  participants: string[];
  activeParticipants: string[];
  setActiveParticipants: (participants: string[]) => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  activeParticipants,
  setActiveParticipants,
}) => {
  return (
    <div className="participant-list">
      {participants.map((p, index) => {
        return (
          <div
            className="participant"
            style={{
              backgroundColor: p === activeParticipants[0] ? "#444" : "",
            }}
            key={index}
            onClick={() => {
              setActiveParticipants([p]);
            }}
          >
            <div>
              <div>{p}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantList;
