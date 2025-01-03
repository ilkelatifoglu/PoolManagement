import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const ActivityService = {
    // Get activities for swimmer or coach
    getActivities: async (endpoint) => {
        try {
            const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
                },
            });
            return response.data; // Return the list of activities
        } catch (error) {
            console.error("Error fetching activities:", error.response?.data || error.message);
            throw error; // Re-throw the error for error handling in the component
        }
    },

    // Cancel an activity by its ID
    cancelActivity: async (activityId) => {
        try {
            console.log(activityId);
            const response = await axios.put(`${API_BASE_URL}/activities/cancel-activity/${activityId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
                },
            });
            return response.data; // Return success message
        } catch (error) {
            console.error("Error canceling activity:", error.response?.data || error.message);
            throw error; // Re-throw the error for error handling in the component
        }
    },
    withdrawClass: async (userId, classId, activityType) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/activities/withdraw-class`,
                {
                    data: { userId, classId, activityType }, // Pass data in the request body for DELETE
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error withdrawing class:", error.response?.data || error.message);
            throw error;
        }
    },
    cancelClass: async (classId) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/activities/cancel-class/${classId}`,
                {}, // No body needed for this request
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
                    },
                }
            );
            return response.data; // Return success message or data
        } catch (error) {
            console.error("Error canceling class:", error.response?.data || error.message);
            throw error; // Re-throw for handling in the component
        }
    },

};

export default ActivityService;
