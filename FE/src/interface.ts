interface Participant {
  name: string;
  age: number;
  tagNumber: number;
  paceData: Pace[];
}
interface Pace {
  time: string;
  sensor: number;
}

interface MainContentProps {
  activeParticipants: Participant[] | [];
}

interface SidebarProps {
  participants: Participant[];
  setActiveParticipants: (participants: Participant[]) => void;
  activeParticipants: Participant[] | [];
}
export type { Participant, Pace, MainContentProps, SidebarProps };
