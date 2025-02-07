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

const getUserData = async (
  name: string,
  distance: number,
  dateToView: Date
) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(
      `${URL}/data?name=${name}&distance=${distance}&dateToView=${
        dateToView.toISOString().split("T")[0]
      }`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const getUserHistoryData = async (name: string, distance: number) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(
      `${URL}/dataHistory?name=${name}&distance=${distance}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// const getLiveBaseData = async (name: string) => {
//   try {
//     // Replace with your actual API endpoint
//     const response = await axios.get(`${URL}/live?name=${name}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// };

const openSSE = async (
  distance: number,
  totalDistance: number,
  onMessage: (data: any) => void
) => {
  try {
    const url = `${URL}/stream?distance=${distance}&totalDistance=${totalDistance}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close(); // Ensure connection is closed on error
    };

    eventSource.addEventListener("close", () => {
      console.log("SSE stream closed.");
      eventSource.close();
    });

    return eventSource;
  } catch (error) {
    console.error("Error opening SSE:", error);
    return null;
  }
};

const closeSSE = (eventSource: EventSource | null) => {
  if (eventSource) {
    eventSource.close();
    console.log("SSE connection closed.");
  }
};

export { getUserData, getUserHistoryData, getUsersList, openSSE, closeSSE };
