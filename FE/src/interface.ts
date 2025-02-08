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
export type { Pace, SidebarProps };
