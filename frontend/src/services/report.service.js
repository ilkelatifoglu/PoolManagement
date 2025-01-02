import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Update this if your API URL changes

const ReportService = {
    getReports: async (administratorId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/report/reports/${administratorId}`);
            return response.data.reports || [];
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            throw error;
        }
    },

    generateReport: async (reportData) => {
        //console.log(reportData);
        try {
            const response = await axios.post(`${API_BASE_URL}/report/generate`, reportData);
            return response.data.message;
        } catch (error) {
            console.error("Failed to generate report:", error);
            throw error;
        }
    },

    deleteReport: async (reportId) => {
        console.log(reportId);
        try {
            const response = await axios.delete(`${API_BASE_URL}/report/delete/${reportId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to delete report:", error);
            throw error;
        }
    },

};

export default ReportService;
