import api from './api';

const bidService = {
  getAllBids: async () => {
    try {
      const response = await api.get('/bids');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBidById: async (id) => {
    try {
      const response = await api.get(`/bids/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBidsByCompanyId: async (companyId) => {
    try {
      const response = await api.get(`/bids/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBidsByStatus: async (status) => {
    try {
      const response = await api.get(`/bids/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBid: async (bidData) => {
    try {
      const response = await api.post('/bids', bidData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBidStatus: async (id, status) => {
    try {
      const response = await api.put(`/bids/${id}/status`, status);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBid: async (id) => {
    try {
      const response = await api.delete(`/bids/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bidService;