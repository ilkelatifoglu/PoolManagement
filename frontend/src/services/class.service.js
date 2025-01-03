import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const createClass = async (classData) => {
  try {
      const response = await axios.post(
          `${API_URL}/classes`,
          classData,
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

export const fetchClasses = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetch-classes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your token logic
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async (classData) => {
  try {
    const response = await axios.post(`${API_URL}/cart`, classData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your token logic
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cancelClass = async (classData) => {
  try {
    const response = await axios.post(
      `${API_URL}/cancel-class`,
      classData,
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

export const fetchReadyClasses = async () => {
  try {
    const response = await axios.get(`${API_URL}/ready-classes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
