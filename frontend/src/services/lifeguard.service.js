import api from "./api";

class LifeguardService {
  static async getAllSchedules() {
    try {
      const response = await api.get("/api/lifeguard/schedules");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllLifeguards() {
    try {
      const response = await api.get("/api/lifeguard/lifeguards");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default LifeguardService;
