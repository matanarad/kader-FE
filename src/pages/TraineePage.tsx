import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenericGraph from "../components/GenericGraph/GenericGraph";
import "./TraineePage.css";
import { fetchTraineeByTagID, addRunToTrainee, getArrivalTime } from "../api"; // Adjust the path based on your file structure
import { toast } from "react-toastify";

import { Trainee } from "../interface"; // Adjust the path based on your file structure
import whatsappIcon from "../img/WhatsApp.svg";
const TraineePage: React.FC = () => {
  const { tag_id } = useParams<{ tag_id: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = React.useState<Trainee | null>(null); // Adjust the type based on your data structure
  const [arrivalTime, setArrivalTime] = React.useState<string | null>(null);
  useEffect(() => {
    fetchTraineeByTagID(tag_id!).then((data) => {
      if (data) {
        setTrainee(data);
      } else {
        console.error("No data found for the given tag_id");
      }
    });
  }, []);
  useEffect(() => {
    getArrivalTime(tag_id!).then((data) => {
      console.log(arrivalTime);

      setArrivalTime(
        data
          ? new Date(data).toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null
      );
    });
  }, [trainee]);
  if (trainee === null) {
    return <div>Trainee not found.</div>;
  }

  return (
    <div className="trainee-page" dir="rtl">
      <div className="content-after-logo">
        <h2>{trainee.name}</h2>
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
                // window.open(`https://wa.me/${trainee.phone_number}`, "_blank");
                const countryCode = "+972"; // Change to your country's code
                const formattedNumber = trainee.phone_number.replace(/^0/, ""); // Remove leading zero
                window.open(
                  `https://wa.me/${countryCode}${formattedNumber}`,
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
            הוסף ריצה
          </button>
        </form>
      </div>
      <button onClick={() => navigate("/")} className="back-button">
        חזרה לדף הראשי
      </button>
    </div>
  );
};

export default TraineePage;
