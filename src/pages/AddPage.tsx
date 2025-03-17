import React from "react";
import "./AddPage.css";
import { useNavigate } from "react-router-dom";

const AddPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="add-page">
      <button onClick={() => navigate("/")} className="back-button">
        חזרה לדף הראשי
      </button>
    </div>
  );
};

export default AddPage;
