import api from "./api";

export const evaluationService = {
  getEvaluations: async () => {
    try {
      const response = await api.get("/eval/evaluations");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  submitEvaluation: async (evaluationData) => {
    try {
      const response = await api.post("/eval/submit-evaluation", evaluationData);
      return response.data;
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      throw error;
    }
  },

  getCoachAverageRatings: async () => {
    try {
      const response = await api.get("/eval/coach-average-rating");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCoachEvaluations: async (coachId) => {
    try {
      const response = await api.get(`/eval/coach-evaluations/${coachId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getClassEvaluations:async (coachId) => {
    try {
      const response = await api.get(`/eval/class-evaluations/${coachId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
