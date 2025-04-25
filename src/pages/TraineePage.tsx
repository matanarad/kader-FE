import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenericGraph from "../components/GenericGraph/GenericGraph";
import "./TraineePage.css";
import { fetchTraineeByTagID, addRunToTrainee, getArrivalTime } from "../api"; // Adjust the path based on your file structure
import { toast } from "react-toastify";

import { Trainee } from "../interface"; // Adjust the path based on your file structure
import whatsappIcon from "../img/WhatsApp.svg";
const TraineePage: React.FC = () => {
  const { tag_id, date } = useParams<{ tag_id: string; date: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = React.useState<Trainee | null | false>(null); // Adjust the type based on your data structure
  const [arrivalTime, setArrivalTime] = React.useState<string | null>(null);
  useEffect(() => {
    fetchTraineeByTagID(tag_id!).then((data) => {
      if (data) {
        setTrainee(data);
      } else {
        console.error("No data found for the given tag_id");
        setTrainee(false);
      }
    });
  }, []);
  function convertToIsraelTime(inputDateString: string): string {
    // Ensure the date string is treated as UTC by appending "Z"
    const date = new Date(inputDateString + "Z");

    // Convert to Israel time, considering daylight saving
    const israelTime = new Intl.DateTimeFormat("en-IL", {
      timeZone: "Asia/Jerusalem",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);

    return israelTime;
  }
  useEffect(() => {
    const trimmedDate = date!.slice(0, 10); // "2025-03-30"
    const trimmedChar = date!.slice(10); // "F"
    getArrivalTime(tag_id!, trimmedChar === "F" ? trimmedDate : date!).then(
      (data) => {
        setArrivalTime(convertToIsraelTime(data!));
      }
    );
  }, [trainee]);
  if (trainee === null) {
    return <div>מחפש את המתאמן</div>;
  } else if (trainee === false) {
    return <div>לא נמצא מתאמן עם הצמיד הזה</div>;
  }

  return (
    <div className="trainee-page" dir="rtl">
      <div className="content-after-logo">
        <h2 style={{ marginBottom: 0 }}>{trainee.name}</h2>
        <h4 style={{ marginTop: 0 }}>
          {date!.slice(10) === "F"
            ? date!.slice(0, 10)
              ? date!.slice(0, 10).split("-").reverse().join("/")
              : "תאריך לא זמין"
            : date
            ? date.split("-").reverse().join("/")
            : "תאריך לא זמין"}
        </h4>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2rem",
        }}
      >
        <div className="arrival-time-container">
          <div>
            <strong>זמן הגעה לאימון</strong>
          </div>
          <div dir="ltr">
            <div>{arrivalTime !== null ? arrivalTime : "לא זוהה זמן הגעה"}</div>
          </div>
        </div>
        <div className="birthday-container">
          <div>
            <strong>תאריך לידה</strong>
          </div>
          <div dir="ltr">
            <div>
              {trainee.birthday
                ? new Date(trainee.birthday).toLocaleDateString("he-IL")
                : "תאריך לידה לא נמצא"}
            </div>
          </div>
        </div>
      </div>
      <div className="whatsapp-container">
        {trainee?.phone_number ? (
          <img
            src={whatsappIcon}
            style={{ width: "15vw", cursor: "pointer" }}
            onClick={() => {
              if (trainee?.phone_number) {
                const countryCode = "+972"; // Change to your country's code
                const formattedNumber = trainee.phone_number.replace(/^0/, ""); // Remove leading zero
                window.open(
                  `https://wa.me/${countryCode}${formattedNumber}?text=${encodeURIComponent(
                    "אהלן גבר מה קורה?\nחסרת לי השבוע הכל טוב?"
                  )}`,
                  "_blank"
                );
              } else {
                alert("מספר טלפון לא נמצא");
              }
            }}
          />
        ) : null}
      </div>
      <div className="graph-container">
        {trainee.runs.length > 0 ? (
          <>
            <div>
              <strong>גרף ריצות 2000</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2rem",
              }}
            >
              <GenericGraph runs={trainee.runs} />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="add-run-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const runTime = formData.get("runTime");
            if (runTime) {
              addRunToTrainee(tag_id!, Number(runTime)).then((data) => {
                if (data) {
                  toast.success("ריצה נוספה בהצלחה!"); // Toast notification for success
                  fetchTraineeByTagID(tag_id!).then((updatedTrainee) => {
                    if (updatedTrainee) {
                      setTrainee(updatedTrainee);
                    } else {
                      toast.error("שגיאה בעדכון פרטי המתאמן.");
                    }
                  });
                } else {
                  toast.error("שגיאה בהוספת הריצה. נסה שוב."); // Toast notification for error
                }
              });
            } else {
              toast.warn("אנא הזן זמן ריצה"); // Toast notification for warning
            }
          }}
        >
          <input
            type="number"
            name="runTime"
            placeholder="זמן ריצה (שניות)"
            className="run-input"
          />
          <button type="submit" className="add-button">
            הוסף ריצת 2000
          </button>
        </form>
      </div>
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

export default TraineePage;
