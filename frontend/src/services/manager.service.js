import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const ManagerService = {
    createPool: async (poolData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/manager/create-pool`, poolData);
            return response.data; // Return the response data (message or other information)
        } catch (error) {
            console.error("Error creating pool:", error.response?.data || error.message);
            throw error; // Re-throw the error for handling in the component
        }
    },

    // Method to delete an existing pool
    deletePool: async (poolId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/manager/delete-pool/${poolId}`);
            return response.data; // Return the response data (message or other information)
        } catch (error) {
            console.error("Error deleting pool:", error.response?.data || error.message);
            throw error; // Re-throw the error for handling in the component
        }
    },
    getPools: async (managerId) => {
        //console.log(managerId);
        const response = await axios.get(`${API_BASE_URL}/manager/get-pools/${managerId}`);
        return response.data;
    },

    createMembership: async (membershipData) => {
        console.log(membershipData);
        const response = await axios.post(`${API_BASE_URL}/manager/create-membership`, membershipData);
        return response.data;
    },

    setPrices: async (priceData) => {
        const response = await axios.post(`${API_BASE_URL}/manager/set-prices`, priceData);
        return response.data;
    },
    getMemberships: async (managerId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/manager/get-memberships/${managerId}`);
            return response.data; // Return the memberships array from the response
        } catch (error) {
            console.error("Error fetching memberships:", error.response?.data || error.message);
            throw error; // Re-throw the error for handling in the component
        }
    },
    deleteMembership: async (membershipId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/manager/delete-membership/${membershipId}`);
            return response.data; // Return the response data (e.g., success message)
        } catch (error) {
            console.error("Error deleting membership:", error.response?.data || error.message);
            throw error; // Re-throw the error for handling in the component
        }
    },
    getStaffs: async (managerId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/manager/get-staffs/${managerId}`);
            return response.data; // Return the staff data
        } catch (error) {
            console.error("Error fetching staff:", error.response?.data || error.message);
            throw error; // Re-throw the error for error handling in the component
        }
    },
    createStaff: async (staffData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/manager/create-staff`, staffData);
            return response.data; // Return the response data
        } catch (error) {
            console.error("Error creating staff:", error.response?.data || error.message);
            throw error; // Re-throw the error for handling in the component
        }
    },
    deleteStaff: async (staffId, role) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/manager/delete-staff/${staffId}`, { role });
            return response.data; // Return the response data (e.g., success message)
        } catch (error) {
            console.error("Error deleting staff:", error.response?.data || error.message);
            throw error; // Re-throw the error for handling in the component
        }
    }

};

export default ManagerService;
