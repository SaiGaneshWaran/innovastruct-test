import api from './api';

const companyService = {
  getAllCompanies: async () => {
    try {
      const response = await api.get('/companies');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompanyById: async (id) => {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompaniesByType: async (type) => {
    try {
      const response = await api.get(`/companies/type/${type}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchCompaniesByName: async (name) => {
    try {
      const response = await api.get(`/companies/search?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompaniesByRating: async (minRating) => {
    try {
      const response = await api.get(`/companies/rating/${minRating}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompaniesByService: async (service) => {
    try {
      const response = await api.get(`/companies/service/${service}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCompany: async (companyData) => {
    try {
      const response = await api.post('/companies', companyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCompany: async (id, companyData) => {
    try {
      const response = await api.put(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await api.delete(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompanyDashboardStats: async (companyId) => {
    try {
      const [bidStats, performanceMetrics] = await Promise.all([
        api.get(`/analytics/bids/statistics/${companyId}`),
        api.get(`/analytics/bids/performance/${companyId}`)
      ]);

      return {
        activeProjects: bidStats.data.activeBids,
        pendingQuotes: bidStats.data.pendingBids,
        projectCompletion: bidStats.data.successRate,
        clientSatisfaction: performanceMetrics.data.competitiveIndex
      };
    } catch (error) {
      throw error;
    }
  },

  getCompanyUpcomingDeadlines: async (companyId) => {
    try {
      const response = await api.get(`/dashboard/company/${companyId}/upcoming-deadlines`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default companyService;