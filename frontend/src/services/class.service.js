import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createClass = async (classData) => {
    const response = await axios.post(`${API_URL}/classes`, classData);
    return response.data;
};

export const fetchClasses = async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/fetch-classes?${queryString}`);
    return response.data;
};

  export const addToCart = async (cartData) => {
    const response = await axios.post(`${API_URL}/cart`, cartData);
    return response.data;
  };