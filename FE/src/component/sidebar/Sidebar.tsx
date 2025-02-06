import "./Sidebar.css";
import { useState, useEffect } from "react";
import { SidebarProps } from "../../interface";
import SearchBox from "./SearchBox";
import ParticipantList from "./ParticipantList";

const Sidebar = ({
  participants,
  setActiveParticipants,
  activeParticipants,
}: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredParticipants, setFilteredParticipants] =
    useState(participants);

  useEffect(() => {
    const filtered = participants.filter((p) =>
      p.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParticipants(filtered);
  }, [searchTerm, participants, setActiveParticipants]);

  return (
    <div className="sidebar">
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ParticipantList
        participants={filteredParticipants}
        activeParticipants={activeParticipants}
        setActiveParticipants={setActiveParticipants}
      />
    </div>
  );
};

export default Sidebar;
