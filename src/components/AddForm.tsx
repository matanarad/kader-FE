import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./AddForm.css";
import { useNavigate } from "react-router-dom";
import { addTrainee } from "../api";
import { toast } from "react-toastify";

// Define the form data types
interface FormValues {
  fullName: string;
  phoneNumber: string;
  birthday: string;
}

const AddForm: React.FC<{ tagId: string }> = ({ tagId }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>(); // Using generics for type safety

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addTrainee(data.fullName, data.phoneNumber, data.birthday, tagId).then(
      (res) => {
        if ("error" in res && res.error === 400) {
          toast.error(res.detail as string); // Toast notification for error
        } else {
          toast.success("מתאמן נוסף בהצלחה!"); // Toast notification for success
          navigate(`/`);
        }
      }
    );
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
          <label htmlFor="phoneNumber">מספר טלפון:</label>
          <input
            className="form-input"
            type="text"
            id="phoneNumber"
            {...register("phoneNumber", {
              required: "חובה להזין מספר טלפון",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "מספר טלפון לא תקין",
              },
            })}
          />
          {errors.phoneNumber && <label>{errors.phoneNumber.message}</label>}
        </div>

        <div className="form-group">
          <label htmlFor="birthday">תאריך לידה:</label>
          <input
            className="form-input"
            type="date"
            id="birthday"
            {...register("birthday", { required: "חובה להזין תאריך לידה" })}
          />
          {errors.birthday && <label>{errors.birthday.message}</label>}
        </div>

        <button type="submit" className="back-button">
          עדכן משתמש
        </button>
      </div>
    </form>
  );
};

export default AddForm;
