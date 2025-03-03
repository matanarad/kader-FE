import { PacePoint } from "../interface";

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
  console.log(result);

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

export const convertToPace = (data: any[]): PacePoint[] => {
  let paceData: PacePoint[] = [];

  for (let i = 0; i < data.length - 1; i++) {
    const point1 = data[i];
    const point2 = data[i + 1];

    let paceEntry: PacePoint = { distance: point2.distance };

    // Get all unique time keys from both points
    const timeKeys = [
      ...new Set([
        ...Object.keys(point1).filter((key) => key.startsWith("time_")),
        ...Object.keys(point2).filter((key) => key.startsWith("time_")),
      ]),
    ];

    for (const key of timeKeys) {
      if (point1[key] !== undefined && point2[key] !== undefined) {
        const time1 = point1[key] as number;
        const time2 = point2[key] as number;
        const timeDifference = Math.abs(time2 - time1);
        const distanceDifference = Math.abs(point2.distance - point1.distance);

        if (timeDifference > 0 && distanceDifference > 0) {
          const paceMinPerKm =
            ((timeDifference / distanceDifference) * 1000) / 60; // min/km
          paceEntry[`pace_${key.split("_")[1]}`] = paceMinPerKm;
        }
      }
    }

    paceData.push(paceEntry);
  }

  return paceData;
};

export const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatSecondsToPace = (seconds: number): string => {
  return `${seconds}m/km`;
};
type PaceData = {
  distance: number;
  [key: string]: number | null; // Dynamic pace keys like "pace_0", "pace_1"
};

function generatePaceTicks(data: (number | null)[]): number[] {
  // Filter out null and NaN values
  const validData = data.filter(
    (pace): pace is number => pace !== null && !isNaN(pace)
  );
  const ticks: number[] = [];
  // Return an empty array if no valid data
  if (validData.length === 0) return [];

  // Find the minimum and maximum pace directly within the valid data
  const minPace = Math.min(...validData);
  const maxPace = Math.max(...validData);
  for (let i = minPace; i <= maxPace; i += 1) {
    ticks.push(i);
  }
  // Generate evenly spaced ticks between min and max pace

  return ticks;
}

export const getPaceTicks = (data: PaceData[]): number[] => {
  let temp: number[] = [];

  // Iterate through each entry and its pace_ keys
  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key.startsWith("pace_") && entry[key] !== null) {
        const paceValue = entry[key] as number;
        temp.push(paceValue);
      }
    });
  });

  // Call generatePaceTicks with the populated temp array
  return generatePaceTicks(temp);
};
