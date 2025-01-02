import api from "./api";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      if (!response.data.user?.user_type) {
        throw new Error("User role is missing from the response.");
      }

      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.clear();
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  validateToken: async (token) => {
    try {
      console.log("Validating token at /auth/validateToken"); // Debug log
      const response = await api.post("/auth/validateToken", { token });
      return response.data;
    } catch (error) {
      console.error("Error in validateToken:", error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
