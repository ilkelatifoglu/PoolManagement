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
  };