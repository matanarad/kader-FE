import axios from "axios";
const URL = "http://localhost:8000";

const getUsersList = async () => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/usersList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const getUserData = async (name: string) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/data?name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const getUserHistoryData = async (name: string) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/dataHistory?name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const getLiveBaseData = async (name: string) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/live?name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export { getUserData, getUserHistoryData, getLiveBaseData, getUsersList };
