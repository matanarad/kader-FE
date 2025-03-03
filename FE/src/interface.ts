interface Pace {
  time: string;
  sensor: number;
}

interface SidebarProps {
  participants: string[];
  setActiveParticipants: (participants: string[]) => void;
  activeParticipants: string[] | [];
  activeButton: string;
}
interface DataPoint {
  distance: number;
  [key: string]: number | undefined; // Allows dynamic time properties
}

interface PacePoint {
  distance: number;
  [key: string]: number; // pace_0, pace_1, etc.
}

interface PaceDataPoint {
  distance: number;
  pace: number;
}
export type { Pace, SidebarProps, DataPoint, PaceDataPoint, PacePoint };
