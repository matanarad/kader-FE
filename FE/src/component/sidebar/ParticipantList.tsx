import { FC, useState } from "react";
import { Participant } from "../../interface";

interface ParticipantListProps {
  participants: Participant[];
  activeParticipants: Participant[];
  setActiveParticipants: (participants: Participant[]) => void;
  getParticipantByTagNumber: (tagNumber: number) => Participant | undefined;
}

const ParticipantList: FC<ParticipantListProps> = ({
  participants,
  activeParticipants,
  setActiveParticipants,
  getParticipantByTagNumber,
}) => {
  return (
    <div className="participant-list">
      {participants.map((p, index) => {
        return (
          <div
            className="participant"
            style={{
              backgroundColor:
                getParticipantByTagNumber(p.tagNumber) !== undefined
                  ? "#444"
                  : "",
            }}
            key={index}
            onClick={() => {
              if (getParticipantByTagNumber(p.tagNumber) === undefined) {
                // setActiveParticipants([...(activeParticipants || []), p]);
                setActiveParticipants([p]);
              } else {
                setActiveParticipants(
                  activeParticipants.filter(
                    (participant) => participant.tagNumber !== p.tagNumber
                  )
                );
              }
            }}
          >
            <div>
              <div>{p.name}</div>
              <small>
                Age {p.age}, tag #{p.tagNumber}
              </small>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantList;
