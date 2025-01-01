import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchPools = async () => {
  const response = await axios.get(`${API_URL}/pools`);
  return response.data;
};
