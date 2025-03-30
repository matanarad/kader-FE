import axios from "axios";
// const URL = "http://192.168.1.71:8000/api/v1";
const URL = "https://kader-api-service-thwmc5pt7a-ue.a.run.app/api/v1";
import { Trainee } from "./interface";

export const fetchTraineeData = async (): Promise<Trainee[] | null> => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/trainees`);
    return response.data as Trainee[];
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchTraineeByTagID = async (
  tag_id: string
): Promise<Trainee | null> => {
  try {
    // Adjusted API endpoint to match the FastAPI route
    const response = await axios.get(`${URL}/trainees/${tag_id}`);
    return response.data as Trainee;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const addRunToTrainee = async (
  tag_id: string,
  run_time: number
): Promise<Trainee | null> => {
  try {
    // Adjusted API endpoint to match the FastAPI route
    const data = {
      run_date: new Date().toISOString().split("T")[0], // Ensure proper date format
      run_time: run_time,
    };
    const response = await axios.post(`${URL}/trainees/${tag_id}/runs`, data); // No `params`

    return response.data as Trainee;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getArrivalTime = async (
  tag_id: string
): Promise<string | null> => {
  try {
    // Adjusted API endpoint to match the FastAPI route
    const response = await axios.get(
      `${URL}/trainees/${tag_id}/first-log/?date=${
        new Date().toISOString().split("T")[0]
      }`
    );

    return response.data as string;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const scanTag = async (): Promise<{
  message: string;
  trainee_info: string;
} | null> => {
  try {
    // Adjusted API endpoint to match the FastAPI route
    const response = await axios.get(`${URL}/trainees/scan/`);

    return response.data as { message: string; trainee_info: string };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const addTrainee = async (
  name: string,
  phone_number: string,
  birthday: string,
  tag_id: string
): Promise<Trainee | { error: unknown; detail: unknown }> => {
  try {
    // Adjusted API endpoint to match the FastAPI route
    const data = {
      name: name,
      phone_number: phone_number,
      birthday: new Date(birthday).toISOString().split("T")[0],
      tag_id: tag_id,
    };
    const response = await axios.post(`${URL}/trainees/`, data);
    return response.data as Trainee;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        error: error.response.status,
        detail: error.response.data.detail,
      };
    }
    return { error: "Unknown error", detail: "" };
  }
};
