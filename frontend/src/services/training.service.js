import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const fetchSelfTrainings = async () => {
    try {
      const response = await axios.get(`${API_URL}/self-trainings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching self-trainings:", error);
      throw error;
    }
  };  

export const createSelfTraining = async (sessionId, poolId, laneNumber, goal) => {
    try {
      const response = await axios.post(
        `${API_URL}/self-trainings`,
        { session_id: sessionId, pool_id: poolId, lane_number: laneNumber, goal },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error in createSelfTraining:", error);
      throw error;
    }
  };  
  
// Cancel a training
export const cancelTraining = async (trainingId) => {
    const response = await axios.delete(`${API_URL}/trainings/${trainingId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  };

export const cancelSelfTraining = async (selfTrainingId) => {
  const response = await axios.delete(`${API_URL}/self-trainings/${selfTrainingId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const fetchSessions = async () => {
  const response = await axios.get(`${API_URL}/sessions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
    console.log("Fetched sessions:", response.data);
    return response.data;
  };
  

export const fetchPools = async () => {
    const response = await axios.get(`${API_URL}/pools`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  };

  export const fetchAvailableLanes = async (poolId, sessionId) => {
    try {
      if (!poolId || !sessionId) {
        throw new Error("Missing required parameters: poolId or sessionId");
      }
      const response = await axios.get(`${API_URL}/lanes`, {
        params: { pool_id: poolId, session_id: sessionId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching available lanes:", error);
      throw error;
    }
  };
  
  export const fetchPoolsWithAvailableSessions = async () => {
    const response = await axios.get(`${API_URL}/pools/available`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  };
  
  export const fetchSessionsWithAvailableLanes = async (poolId) => {
    const response = await axios.get(`${API_URL}/sessions`, {
      params: { pool_id: poolId },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  };
  
  export const fetchAvailableCoaches = async () => {
    try {
      const response = await axios.get(`${API_URL}/available-coaches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching available coaches:", error);
      throw error;
    }
  };
  
  export const signUpForTraining = async (sessionId, poolId, laneNumber, goal, coachId) => {
    try {
      const response = await axios.post(
        `${API_URL}/trainings/sign-up`,
        { session_id: sessionId, pool_id: poolId, lane_number: laneNumber, goal, coach_id: coachId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error signing up for training:", error);
      throw error;
    }
  };
  
  
  
  
  