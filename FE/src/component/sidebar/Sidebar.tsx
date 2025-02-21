import "./Sidebar.css";
import { useState, useEffect } from "react";
import { SidebarProps } from "../../interface";
import SearchBox from "./SearchBox";
import ParticipantList from "./ParticipantList";
import logo from "../../img/Logo.png";
import { getActiveSensor } from "../../api";
const Sidebar = ({
  participants,
  setActiveParticipants,
  activeParticipants,
  activeButton,
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
  const [activeSensors, setActiveSensors] = useState([]);

  // Fetch active sensors from the server
  const fetchActiveSensors = async () => {
    try {
      getActiveSensor().then((res) => {
        setActiveSensors(res);
      });
    } catch (error) {
      console.error("Error fetching active sensors:", error);
    }
  };

  useEffect(() => {
    // Fetch the active sensors when the component mounts
    fetchActiveSensors();
  }, []);
  return (
    <div className="sidebar">
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ParticipantList
        activeButton={activeButton}
        participants={filteredParticipants}
        activeParticipants={activeParticipants}
        setActiveParticipants={setActiveParticipants}
      />
      {/* Footer with copyright */}
      <div className="footer">
        <div className="sensor-list">
          {activeSensors?.length > 0 ? (
            activeSensors.map((sensor, index) => (
              <div key={index} className="sensor-item">
                Sensor {sensor}
              </div>
            ))
          ) : (
            <p style={{ color: "#f44336" }}>No active sensors found</p>
          )}
        </div>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <p>© 2025 Kader</p>
        <p>Eden&Matan</p>
      </div>
    </div>
  );
};

export default Sidebar;
