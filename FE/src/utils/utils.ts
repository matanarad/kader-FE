import { Participant } from "../interface";

export function getParticipantByTagNumber(
  tagNumber: number,
  activeParticipants: Participant[]
): Participant | undefined {
  return activeParticipants.find(
    (participant) => participant.tagNumber === tagNumber
  );
}
