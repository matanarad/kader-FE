import "./App.css";
import { useState } from "react";
import Sidebar from "./component/sidebar/Sidebar";
import { Participant } from "./interface";
import MainContent from "./component/MainContent/MainContent";
// Sample participant data
const participants = [
  {
    name: "Matan",
    age: 22,
    tagNumber: 1,
    paceData: [
      { time: "0:00", sensor: 1 },
      { time: "0:53", sensor: 2 },
      { time: "1:11", sensor: 1 },
      { time: "2:02", sensor: 2 },
      { time: "2:27", sensor: 1 },
      { time: "3:11", sensor: 2 },
      { time: "3:45", sensor: 1 },
      { time: "4:38", sensor: 2 },
      { time: "5:00", sensor: 1 },
      { time: "5:57", sensor: 2 },
      { time: "6:20", sensor: 1 },
      { time: "7:15", sensor: 2 },
      { time: "7:41", sensor: 1 },
      { time: "9:20", sensor: 2 },
    ],
  },
  {
    name: "Eden",
    age: 22,
    tagNumber: 2,
    paceData: [
      { time: "0:00", sensor: 1 },
      { time: "0:40", sensor: 2 },
      { time: "1:00", sensor: 1 },
      { time: "1:40", sensor: 2 },
      { time: "2:00", sensor: 1 },
      { time: "2:40", sensor: 2 },
      { time: "3:00", sensor: 1 },
      { time: "3:40", sensor: 2 },
      { time: "4:00", sensor: 1 },
      { time: "4:40", sensor: 2 },
      { time: "5:00", sensor: 1 },
      { time: "5:40", sensor: 2 },
      { time: "6:00", sensor: 1 },
      { time: "6:40", sensor: 2 },
    ],
  },
  {
    name: "Alon",
    age: 53,
    tagNumber: 3,
    paceData: [
      { time: "0:00", sensor: 1 },
      { time: "0:32", sensor: 2 },
      { time: "1:06", sensor: 1 },
      { time: "2:01", sensor: 2 },
      { time: "2:30", sensor: 1 },
      { time: "3:27", sensor: 2 },
      { time: "3:50", sensor: 1 },
      { time: "4:41", sensor: 2 },
      { time: "5:08", sensor: 1 },
      { time: "6:04", sensor: 2 },
      { time: "6:21", sensor: 1 },
      { time: "7:20", sensor: 2 },
      { time: "7:45", sensor: 1 },
      { time: "8:34", sensor: 2 },
    ],
  },
];

function App() {
  function getParticipantByTagNumber(
    tagNumber: number
  ): Participant | undefined {
    return participants.find(
      (participant) => participant.tagNumber === tagNumber
    );
  }
  const [activeParticipants, setActiveParticipants] = useState([
    getParticipantByTagNumber(1),
  ]);
  const filteredActiveParticipants = activeParticipants.filter(
    (participant): participant is Participant => participant !== undefined
  );
  return (
    <div className="container">
      <Sidebar
        participants={participants}
        setActiveParticipants={setActiveParticipants}
        activeParticipants={filteredActiveParticipants}
      />
      <div></div>
      <MainContent
        name={activeParticipants[0]?.name}
        tagId={`${activeParticipants[0]?.tagNumber}`}
      />
    </div>
  );
}

export default App;
