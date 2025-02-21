import "./App.css";
import { useState, useEffect } from "react";
import Sidebar from "./component/sidebar/Sidebar";
import MainContent from "./component/MainContent/MainContent";
import { getUsersList } from "./api";

function App() {
  useEffect(() => {
    const getUsers = async () => {
      let data = await getUsersList();
      setParticipants(data);
      setActiveParticipants([data[0]]);
    };
    getUsers();
  }, []);

  const [participants, setParticipants] = useState<string[]>([]);
  const [activeParticipants, setActiveParticipants] = useState<string[]>([
    participants[0],
  ]);
  const filteredActiveParticipants = activeParticipants.filter(
    (participant): participant is string => participant !== undefined
  );
  const [activeButton, setActiveButton] = useState<"history" | "live">("live");
  useEffect(() => {
    if (activeButton === "history" && activeParticipants.length !== 1) {
      alert("Cant select more the one player when looking on history");
      setActiveParticipants(
        activeParticipants[0] ? [activeParticipants[0]] : []
      );
    }
  }, [activeButton]);
  return (
    <div className="container">
      <Sidebar
        participants={participants}
        setActiveParticipants={setActiveParticipants}
        activeParticipants={filteredActiveParticipants}
        activeButton={activeButton}
      />
      <div></div>
      <MainContent
        names={activeParticipants ? activeParticipants : ["None"]}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
    </div>
  );
}

export default App;
