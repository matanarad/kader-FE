import axios from "axios";
const URL = "http://localhost:8000";

const Temp = async () => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/temp`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
