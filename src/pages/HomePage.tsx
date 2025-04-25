import React, { useEffect, useState } from "react";
import { TraineeCard } from "../components/TraineeCard/TraineeCard";
import { Trainee } from "../interface";
import "./HomePage.css";
import downloadIcon from "../img/downloadIcon.svg";
import dateIcon from "../img/date.svg";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTraineeData, downloadPDF } from "../api";
import filterIcon from "../img/filter.svg";
const HomePage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [filterTrainees, setFilterTrainees] = useState<Trainee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // New states for days since last log filter
  const [showDaysFilter, setShowDaysFilter] = useState<boolean>(false);
  const [maxDaysSinceLog, setMaxDaysSinceLog] = useState<number>(30);
  const [daysFilterValue, setDaysFilterValue] = useState<number>(30);

  useEffect(() => {
    if (date !== undefined) {
      const trimmedDate = date!.slice(0, 10); // "2025-03-30"
      const trimmedChar = date!.slice(10); // "F"
      if (trimmedChar === "F") {
        setSelectedDate(trimmedDate);
      } else {
        setSelectedDate(date);
      }
    }
  }, [date]);

  function filterTraineesByLogDate(
    trainees: Trainee[],
    date: string
  ): Trainee[] {
    return trainees.filter((trainee) =>
      trainee.logs.some((log) => {
        const logDate = new Date(log).toISOString().split("T")[0]; // "YYYY-MM-DD"
        return logDate === date;
      })
    );
  }

  // Calculate days since last log for a trainee
  const getDaysSinceLastLog = (trainee: Trainee): number => {
    if (!trainee.logs || trainee.logs.length === 0) {
      return Infinity; // No logs
    }

    // Find the most recent log
    const lastLogDate = new Date(
      Math.max(...trainee.logs.map((log) => new Date(log).getTime()))
    );
    const today = new Date();

    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - lastLogDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  useEffect(() => {
    if (selectedDate !== "") {
      setFilterTrainees(filterTraineesByLogDate(trainees, selectedDate));
    } else {
      setFilterTrainees(trainees);
    }
  }, [selectedDate, trainees]);

  useEffect(() => {
    const getTraineeData = async () => {
      const data = await fetchTraineeData();
      if (data) {
        setTrainees(data);

        // Calculate the maximum days since last log for any trainee
        if (data.length > 0) {
          const maxDays = Math.max(
            ...data.map((trainee) => getDaysSinceLastLog(trainee))
          );

          setDaysFilterValue(7);
          setMaxDaysSinceLog(Math.min(maxDays, 31));
        }
      }
    };
    getTraineeData();
  }, []);
  const handleDownloadPDF = async () => {
    const pdf = await downloadPDF();

    return pdf;
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleDaysFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDaysFilterValue(Number(e.target.value));
  };

  // Updated filtering logic to include days since last log
  const filteredTrainees = filterTrainees.filter((trainee) => {
    const matchesSearch = trainee.name.toLowerCase().includes(searchQuery);
    let matchesDaysFilter = true; // Default to true if no filter is applied
    if (showDaysFilter) {
      matchesDaysFilter = getDaysSinceLastLog(trainee) >= daysFilterValue;
    }
    return matchesSearch && matchesDaysFilter;
  });

  return (
    <div className="home-page">
      <div className="content-after-logo">
        <h2>ברוכים הבאים למערכת קד"ר</h2>
        <div dir="rtl" className="welcome-text">
          כאן ניתן לראות את רשימת המתאמנים.
        </div>
        <div> לחץ על משתתף כדי לראות עוד פרטים עליו</div>
        <p style={{ marginTop: "0" }}>
          או ללחוץ על הלוח שנה למטה ולסנן על פי תאריך
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container" dir="rtl">
        <input
          type="text"
          className="search-bar"
          placeholder="חפש מתאמן לפי שם..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <img
          src={filterIcon}
          className="filter-icon"
          onClick={() => setShowDaysFilter(!showDaysFilter)}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Days Since Last Log Filter */}
      {showDaysFilter && (
        <div className="days-filter-container" dir="rtl">
          <label>
            סינון לפי ימים מאז אימון אחרון: {daysFilterValue} ימים
            <input
              type="range"
              min="1"
              max={maxDaysSinceLog}
              value={daysFilterValue}
              onChange={handleDaysFilterChange}
              className="days-filter-slider"
            />
          </label>
        </div>
      )}

      <div className="person-list-container">
        {filteredTrainees.map((trainee) => (
          <TraineeCard
            key={trainee.tag_id}
            trainee={trainee}
            date={
              selectedDate === ""
                ? new Date().toISOString().split("T")[0]
                : selectedDate + "F"
            }
          />
        ))}
      </div>

      <div
        className="floating-plus-button"
        onClick={() => {
          handleDownloadPDF();
          // navigate(
          //   `/scan/${
          //     selectedDate === ""
          //       ? new Date().toISOString().split("T")[0]
          //       : selectedDate + "F"
          //   }`
          // )
        }}
      >
        <img src={downloadIcon} style={{ width: "50%" }} />
      </div>
      <div className="floating-filter-container">
        <div
          className="floating-filter-button"
          onClick={() => setShowModal(true)}
        >
          <img src={dateIcon} style={{ width: "50%" }} />
        </div>
        <div>{selectedDate ? `${selectedDate}` : ""}</div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">בחר תאריך אימון</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label className="placeholder-text" htmlFor="dateInput">
                לחץ לבחירת תאריך
              </label>
              <input
                type="date"
                className="modal-date-input"
                onChange={handleDateChange}
                value={selectedDate}
                id="dateInput"
                placeholder=" " /* Required for placeholder to work */
              />
            </div>

            <button
              className="filter-button"
              style={{ width: "30%", margin: "0 auto", marginBottom: "3vh" }}
              onClick={() => setSelectedDate("")}
            >
              איפוס
            </button>
            <div className="modal-buttons">
              <button
                className="filter-button"
                onClick={() => setShowModal(false)}
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
