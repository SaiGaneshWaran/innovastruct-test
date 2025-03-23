import api from './api';

const settingsService = {
  // Profile settings
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Notification settings
  getNotificationSettings: async (userId) => {
    try {
      const response = await api.get(`/settings/notifications/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateNotificationSettings: async (userId, notificationSettings) => {
    try {
      const response = await api.put(`/settings/notifications/${userId}`, notificationSettings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Privacy settings
  getPrivacySettings: async (userId) => {
    try {
      const response = await api.get(`/settings/privacy/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePrivacySettings: async (userId, privacySettings) => {
    try {
      const response = await api.put(`/settings/privacy/${userId}`, privacySettings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Region settings
  getRegionSettings: async (userId) => {
    try {
      const response = await api.get(`/settings/region/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateRegionSettings: async (userId, regionSettings) => {
    try {
      const response = await api.put(`/settings/region/${userId}`, regionSettings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Theme settings
  getThemeSettings: async (userId) => {
    try {
      const response = await api.get(`/settings/theme/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateThemeSettings: async (userId, themeSettings) => {
    try {
      const response = await api.put(`/settings/theme/${userId}`, themeSettings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default settingsService;