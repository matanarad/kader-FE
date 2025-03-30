import React from "react";
import "./ScanPage.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddForm from "../components/AddForm";
import { scanTag, fetchTraineeByTagID } from "../api";
// import { Trainee } from "../interface";
const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [tagId, setTagId] = useState<string | false>(
    "U3400300833B2DDD9014000000006A4D8"
  );
  // const [trainee, setTrainee] = useState<Trainee | false>(false);
  const [state, setState] = useState<string | false>("add");
  useEffect(() => {
    if (state === "update") navigate(`/trainee/${tagId}`);
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
            scanTag().then((data) => {
              setTagId(data?.trainee_info || false);
              if (data?.trainee_info) {
                fetchTraineeByTagID(data?.trainee_info).then((trainee) => {
                  // if (trainee) {
                  //   setTrainee(trainee);
                  // }
                  if (trainee?.name === "None") {
                    setState("add");
                  } else {
                    setState("update");
                  }
                });
              }
              setState("detected");
            });
          }}
          className="back-button"
        >
          הצמדתי את הצמיד
        </button>
      ) : state === "scanning" ? (
        <>Scanning</>
      ) : state === "add" ? (
        <AddForm tagId={tagId ? tagId : "000"} />
      ) : (
        <></>
      )}

      <button onClick={() => navigate("/")} className="back-button">
        חזרה לדף הראשי
      </button>
    </div>
  );
};

export default ScanPage;
