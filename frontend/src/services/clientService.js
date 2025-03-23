import api from './api';

const clientService = {
  // Get all clients
  getAllClients: async () => {
    try {
      const response = await api.get('/users?role=CLIENT');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get client by ID
  getClientById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get client by email
  getClientByEmail: async (email) => {
    try {
      const response = await api.get(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new client
  createClient: async (clientData) => {
    try {
      // Ensure the role is set to CLIENT
      const data = { ...clientData, role: 'CLIENT' };
      const response = await api.post('/users', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update client
  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/users/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete client
  deleteClient: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tenders by client ID
  getClientTenders: async (clientId) => {
    try {
      const response = await api.get(`/tenders/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default clientService;