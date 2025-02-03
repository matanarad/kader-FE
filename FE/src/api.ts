import axios from "axios";

const getUserData = async (name: string, tagId: number) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(
      `http://localhost:8000/data?name=${name}&tagId=${tagId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export { getUserData };
