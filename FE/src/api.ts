import axios from "axios";

const getUserData = async (name: string) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`http://localhost:8000/data?name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const getUserHistoryData = async (name: string) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(
      `http://localhost:8000/dataHistory?name=${name}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
export { getUserData, getUserHistoryData };
