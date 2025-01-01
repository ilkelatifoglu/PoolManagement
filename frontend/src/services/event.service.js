import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const createEvent = async (eventData) => {
    try {
        const response = await axios.post(`${API_URL}/events`, eventData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchEvents = async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    try {
        const response = await axios.get(`${API_URL}/events?${queryString}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
