import api from "./api";

export const cartService = {
  getCartItems: async () => {
    try {
        const response = await api.get("/cart/cart");
        return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteCartItem: async (bookingId, reservationType) => {
    try {
      const response = await api.delete(`/cart/cart/${bookingId}`, {
        data: { reservation_type: reservationType },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },  

  confirmPurchase: async (bookingId, reservationType, totalPrice) => {
    try {
      const response = await api.post("/cart/confirm", {
        booking_id: bookingId,
        reservation_type: reservationType,
        total_price: totalPrice, // Include total price in the payload
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },  

  getBalance: async () => {
    try {
      const response = await api.get("/cart/balance");
      return response.data.balance;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addMoneyToBalance: async (amount) => {
    try {
      const response = await api.post("/cart/add-money", { amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAvailableMemberships: async () => {
    try {
      const response = await api.get("/cart/available-memberships");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  becomeMember: async (membershipId) => {
    try {
      const response = await api.post(`/cart/become-member`, { membership_id: membershipId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },  
  
};
