import api from './api';

const analyticsService = {
  // Get bid success rate over time
  getBidSuccessRate: async (companyId, months = 6) => {
    try {
      const response = await api.get(`/analytics/bids/success-rate/${companyId}?months=${months}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bid volume over time
  getBidVolume: async (companyId, months = 6) => {
    try {
      const response = await api.get(`/analytics/bids/volume/${companyId}?months=${months}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bid status distribution
  getBidDistribution: async (companyId) => {
    try {
      const response = await api.get(`/analytics/bids/distribution/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get overall bid statistics
  getBidStatistics: async (companyId) => {
    try {
      const response = await api.get(`/analytics/bids/statistics/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get performance metrics
  getPerformanceMetrics: async (companyId) => {
    try {
      const response = await api.get(`/analytics/bids/performance/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bid trends data by category
  getBidTrends: async (timeframe = 'month') => {
    try {
      const response = await api.get(`/analytics/bids/trends?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get project timeline data by project type
  getProjectTimelines: async (projectType) => {
    try {
      const response = await api.get(`/analytics/bids/projects/timelines?type=${projectType}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get client preferences data
  getClientPreferences: async () => {
    try {
      const response = await api.get('/analytics/bids/client-preferences');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tender activity data
  getTenderActivity: async () => {
    try {
      const response = await api.get('/analytics/bids/tender-activity');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bid analysis data by category
  getBidAnalytics: async (companyId) => {
    try {
      const response = await api.get(`/analytics/bids/analysis/${companyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default analyticsService;