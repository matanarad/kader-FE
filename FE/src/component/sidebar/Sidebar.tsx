import "./Sidebar.css";
import { useState, useEffect } from "react";
import { SidebarProps } from "../../interface";
import SearchBox from "./SearchBox";
import ParticipantList from "./ParticipantList";
import { getParticipantByTagNumber } from "../../utils/utils";

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
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParticipants(filtered);
    setActiveParticipants(
      activeParticipants.filter((p) =>
        filtered.some((fp) => fp.tagNumber === p.tagNumber)
      )
    );
  }, [searchTerm, participants, setActiveParticipants]);

  return (
    <div className="sidebar">
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ParticipantList
        participants={filteredParticipants}
        activeParticipants={activeParticipants}
        setActiveParticipants={setActiveParticipants}
        getParticipantByTagNumber={(tagNumber) =>
          getParticipantByTagNumber(tagNumber, activeParticipants)
        }
      />
    </div>
  );
};

export default Sidebar;
