export function getParticipantByTagNumber(
  name: string,
  activeParticipants: string[]
): string | undefined {
  return activeParticipants.find((participant) => participant === name);
}

export const generateTimeList = (
  maxTimePerKm: number,
  totalDistance: number
): number[] => {
  const kmDistance = totalDistance / 1000; // Convert meters to km
  let maxTime = maxTimePerKm * kmDistance; // Calculate max time in seconds

  // Round up to the nearest 60
  maxTime = Math.ceil(maxTime / 60) * 60 + 60;

  const result: number[] = [];
  for (let i = 0; i <= maxTime; i += 60) {
    result.push(i);
  }
  return result;
};
