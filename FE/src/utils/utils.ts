export function getParticipantByTagNumber(
  name: string,
  activeParticipants: string[]
): string | undefined {
  return activeParticipants.find((participant) => participant === name);
}
