import api from './api';

const tenderService = {
  getAllTenders: async () => {
    try {
      const response = await api.get('/tenders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTenderLocations: async () => {
    try {
      const response = await api.get('/tenders/locations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTenderById: async (id) => {
    try {
      const response = await api.get(`/tenders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTendersByClientId: async (clientId) => {
    try {
      const response = await api.get(`/tenders/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTendersByStatus: async (status) => {
    try {
      const response = await api.get(`/tenders/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTendersByCompanyBids: async (companyId) => {
    try {
      const response = await api.get(`/tenders/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTender: async (tenderData) => {
    try {
      const response = await api.post('/tenders', tenderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTender: async (id, tenderData) => {
    try {
      const response = await api.put(`/tenders/${id}`, tenderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTender: async (id) => {
    try {
      const response = await api.delete(`/tenders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bid-related operations within a tender
  addBidToTender: async (tenderId, bidData) => {
    try {
      const response = await api.post(`/tenders/${tenderId}/bids`, bidData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default tenderService;