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
  time_0: number;
}

interface PaceDataPoint {
  distance: number;
  pace: number;
}
export type { Pace, SidebarProps, DataPoint, PaceDataPoint };
