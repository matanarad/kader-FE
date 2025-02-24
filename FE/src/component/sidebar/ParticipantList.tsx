import React from "react";

interface ParticipantListProps {
  participants: string[];
  activeParticipants: string[];
  setActiveParticipants: (participants: string[]) => void;
  activeButton: string;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  activeParticipants,
  setActiveParticipants,
  activeButton,
}) => {
  return (
    <div className="participant-list">
      {participants.map((p, index) => {
        return (
          <div
            className="participant"
            style={{
              backgroundColor:
                activeButton === "live"
                  ? "#444"
                  : activeParticipants.includes(p)
                  ? "#444"
                  : "",
            }}
            key={index}
            onClick={() => {
              if (activeButton !== "history") {
                setActiveParticipants(
                  activeParticipants.includes(p)
                    ? activeParticipants.filter((item: string) => item !== p) // Remove if exists
                    : [...activeParticipants, p] // Add if not exists
                );
              } else {
                setActiveParticipants([p]);
              }
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
