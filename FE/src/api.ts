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
  names: string[],
  distance: number,
  dateToView: Date
) => {
  try {
    const queryParams = new URLSearchParams({
      distance: distance.toString(),
      dateToView: dateToView.toISOString().split("T")[0],
    });

    // Append names as multiple parameters (if supported)
    names.forEach((name) => queryParams.append("name", name));

    const response = await axios.get(`${URL}/data?${queryParams.toString()}`);
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

const getActiveSensor = async () => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${URL}/active_sensors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const openSSE = async (
  distance: number,
  totalDistance: number,
  users: string[],
  onMessage: (data: any) => void
) => {
  try {
    if (users[0] != undefined) {
      const userParams = users.join(","); // Convert array to a string
      const url = `${URL}/stream?distance=${distance}&totalDistance=${totalDistance}&users=${encodeURIComponent(
        userParams
      )}`;
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
    }
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

const openLongPolling = async (onMessage: (data: any) => void) => {
  try {
    const pollForData = async () => {
      try {
        const response = await axios.get(`${URL}/active_sensors`);
        const data = response.data;

        // If new active sensors are returned, pass them to the callback function
        if (data.active_sensors) {
          onMessage(data);
        }
      } catch (error) {
        console.error("Error fetching active sensors:", error);
      } finally {
        // Continue polling after the response
        setTimeout(pollForData, 1000); // Adjust delay if necessary
      }
    };

    // Start polling
    pollForData();
  } catch (error) {
    console.error("Error opening long-polling:", error);
    return null;
  }
};

const closeLongPolling = () => {
  // No explicit connection to close in this setup,
  // but we can manage cancellation if needed.
  console.log(
    "Long-polling stopped (polling will naturally stop after the component unmounts)."
  );
};

export {
  getUserData,
  getUserHistoryData,
  getUsersList,
  openSSE,
  closeSSE,
  closeLongPolling,
  openLongPolling,
  getActiveSensor,
};
