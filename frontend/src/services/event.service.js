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

//export const fetchEvents = async (filters = {}) => {
    //const queryString = new URLSearchParams(filters).toString();
   // try {
        //const response = await axios.get(`${API_URL}/events?${queryString}`);
      //  return response.data;
    //} catch (error) {
  //      throw error.response?.data || error;
//    }
//};

export const fetchReadyEvents = async (swimmerId) => {
    try {
        console.log("Fetching events for swimmer_id:", swimmerId); // Debugging log
        const response = await axios.get(`${API_URL}/events-ready`, {
            params: { swimmer_id: swimmerId }, // Pass swimmer_id as a query parameter
        });
        console.log("API Response:", response.data); // Debugging log
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error); // Debugging log
        throw error.response?.data || error;
    }
};


export const attendEvent = async (swimmerId, eventId) => {
    try {
        const response = await axios.post(`${API_URL}/events/attend`, {
            swimmer_id: swimmerId,
            event_id: eventId,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const cancelEvent = async (eventData) => {
    try {
        const response = await axios.post(
            `${API_URL}/cancel-event`,
            eventData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchAllReadyEvents = async () => {
    try {
        const response = await axios.get(`${API_URL}/all-ready-events`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchEventTypes = async () => {
    try {
        const response = await axios.get(`${API_URL}/event-types`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
