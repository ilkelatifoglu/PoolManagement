import api from "./api";

class UserService {
  static async getProfile() {
    try {
      const response = await api.get("/api/user/profile");
      console.log("Profile response:", response);
      return response.data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  }

  static async updateProfile(profileData) {
    try {
      const response = await api.put("/api/user/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  }

  static async getSchedule() {
    try {
      const response = await api.get("/api/user/schedule");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateSchedule(scheduleData) {
    try {
      const response = await api.put("/api/user/schedule", scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(passwordData) {
    try {
      const response = await api.put("/api/user/password", passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
