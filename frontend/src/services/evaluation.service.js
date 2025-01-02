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
};

