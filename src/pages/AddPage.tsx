import React from "react";
import "./AddPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddForm from "../components/AddForm";
import { isTagExist } from "../api";
const AddPage: React.FC = () => {
  const navigate = useNavigate();
  const [TagId, setTagId] = useState<string | false>(false);
  return (
    <div className="add-page">
      <div className="content-after-logo">
        <h2>הוספה של מתאמן</h2>
        {TagId ? (
          <p>צמיד זוהה, הכנס את הפרטים של המתאמן</p>
        ) : (
          <p>הצמד את הצמיד למכשיר ולחץ להמשך התהליך</p>
        )}
      </div>
      {TagId ? (
        <AddForm />
      ) : (
        <>
          <button
            onClick={() => {
              let res = isTagExist();
              console.log(res);

              // .then((data) => {
              //   console.log(data);
              //   setTagId(data);
              // });
            }}
            className="back-button"
          >
            הצמדתי את הצמיד
          </button>
          <button onClick={() => navigate("/")} className="back-button">
            חזרה לדף הראשי
          </button>
        </>
      )}
    </div>
  );
};

export default AddPage;
