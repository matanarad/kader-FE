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

export const convertSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds to be two digits (e.g., "01:02" instead of "1:2")
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
};
