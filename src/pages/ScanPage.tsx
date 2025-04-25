import React from "react";
import "./ScanPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddForm from "../components/AddForm";
import { scanTag, fetchTraineeByTagID } from "../api";
import { toast } from "react-toastify";

// import { Trainee } from "../interface";
const ScanPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();

  const navigate = useNavigate();
  const [tagId, setTagId] = useState<string | false>(false);
  // const [trainee, setTrainee] = useState<Trainee | false>(false);
  const [state, setState] = useState<string | false>(false);
  useEffect(() => {
    if (state === "update") {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      navigate(`/trainee/${tagId}/${today}`);
    }
  }, [state]);
  return (
    <div className="add-page">
      <div className="content-after-logo">
        <h2>הוספה של מתאמן</h2>
        {tagId ? (
          <p>צמיד זוהה, הכנס את הפרטים של המתאמן</p>
        ) : (
          <p>הצמד את הצמיד למכשיר ולחץ להמשך התהליך</p>
        )}
      </div>
      {state === false ? (
        <button
          onClick={() => {
            setState("scanning");
            scanTag()
              .then((data) => {
                setTagId(data?.trainee_info || false);
                if (data?.trainee_info) {
                  fetchTraineeByTagID(data?.trainee_info).then((trainee) => {
                    if (trainee?.name === "None") {
                      setState("add");
                    } else {
                      setState("update");
                    }
                  });
                }
                setState("detected");
              })
              .catch((error) => {
                // If there's an error, alert the user
                toast.error(error.message || "An unexpected error occurred.");
                navigate("/");
              });
          }}
          className="back-button"
        >
          הצמדתי את הצמיד
        </button>
      ) : state === "scanning" ? (
        <div className="scanning-message">
          <p dir="rtl">סורק את הצמיד</p>
          <div className="dots-loader">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      ) : state === "add" ? (
        <AddForm tagId={tagId ? tagId : "000"} />
      ) : (
        <></>
      )}

      <button
        onClick={() => {
          const trimmedChar = date!.slice(10); // "F"
          if (trimmedChar === "F") {
            navigate(`/${date}`);
          } else {
            navigate("/");
          }
        }}
        className="back-button"
      >
        חזרה לדף הראשי
      </button>
    </div>
  );
};

export default ScanPage;
