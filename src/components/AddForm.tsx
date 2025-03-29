import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./AddForm.css";
import { useNavigate } from "react-router-dom";

// Define the form data types
interface FormValues {
  fullName: string;
  best2000mRunResult: number;
  results: {
    date: string;
    min: number;
    sec: number;
  }[];
}

const AddForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>(); // Using generics for type safety

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="fullName">שם מלא:</label>
          <input
            className="form-input"
            type="text"
            id="fullName"
            {...register("fullName", { required: "חובה לכתוב שם מלא" })}
          />
          {errors.fullName && <label>{errors.fullName.message}</label>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">תוצאת שיא ריצת 2000:</label>
          <input
            className="form-input"
            type="number"
            id="best2000mRunResult"
            {...register("best2000mRunResult", {
              required: "חובה להזין תוצאת שיא לריצת 2000",
            })}
          />
          {errors.best2000mRunResult && (
            <label>{errors.best2000mRunResult.message}</label>
          )}
        </div>
        <button type="submit" className="back-button">
          עדכן משתמש
        </button>
        <button onClick={() => navigate("/")} className="back-button">
          חזרה לדף הראשי
        </button>
      </div>
    </form>
  );
};

export default AddForm;
