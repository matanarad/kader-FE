import axios from "axios";
const URL = "http://localhost:8000";
import { PeopleState } from "./interface";

export const fetchTraineeData = async (): Promise<PeopleState | null> => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/trainees`);
    return { people: response.data };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
