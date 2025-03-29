import axios from "axios";
const URL = "http://localhost:8000/api/v1";
import { Trainee } from "./interface";
import { data } from "react-router-dom";

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
export const isTagExist = async (): Promise<string> => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/is-tag-exist`);
    return response.data.tad_id;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "null";
  }
};
