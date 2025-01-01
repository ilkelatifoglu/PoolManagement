import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const createClass = async (classData) => {
    const response = await axios.post(`${API_URL}/classes`, classData);
    return response.data;
};

export const fetchClasses = async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/fetch-classes?${queryString}`);
    return response.data;
};

export const addToCart = async (classData) => {
    try {
        const response = await axios.post("/cart", classData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};