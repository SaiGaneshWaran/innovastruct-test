import api from './api';

const dashboardService = {
  // Get client dashboard summary statistics
  getClientDashboardSummary: async () => {
    try {
      const response = await api.get('/dashboard/client/summary');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent tender activity
  getRecentTenderActivity: async (limit = 5) => {
    try {
      const response = await api.get(`/dashboard/client/recent-activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tender status distribution
  getTenderStatusDistribution: async () => {
    try {
      const response = await api.get('/dashboard/client/tender-status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bid activity by month
  getBidActivityByMonth: async (months = 6) => {
    try {
      const response = await api.get(`/dashboard/client/bid-activity?months=${months}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get budget utilization statistics
  getBudgetUtilization: async () => {
    try {
      const response = await api.get('/dashboard/client/budget-utilization');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get top performing companies
  getTopPerformingCompanies: async (limit = 5) => {
    try {
      const response = await api.get(`/dashboard/client/top-companies?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get company recent activity
  getCompanyRecentActivity: async (companyId, limit = 5) => {
    try {
      const response = await api.get(`/dashboard/company/${companyId}/recent-activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default dashboardService;