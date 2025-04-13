import React, { useEffect, useState } from "react";
import { TraineeCard } from "../components/TraineeCard/TraineeCard";
import { Trainee } from "../interface";
import "./HomePage.css";
import plusIcon from "../img/plus.svg";
import dateIcon from "../img/date.svg";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTraineeData } from "../api";

const HomePage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [filterTrainees, setFilterTrainees] = useState<Trainee[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
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
      }
    };
    getTraineeData();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    // setShowModal(false);
  };

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

      <div className="person-list-container">
        {filterTrainees.map((trainee) => (
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
        onClick={() =>
          navigate(
            `/scan/${
              selectedDate === ""
                ? new Date().toISOString().split("T")[0]
                : selectedDate + "F"
            }`
          )
        }
      >
        <img src={plusIcon} style={{ width: "50%" }} />
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
            {/* </div> */}
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
