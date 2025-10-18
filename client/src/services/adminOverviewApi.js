import axiosInstance from '../util/axiosInstance';

const adminOverviewApi = {
  /**
   * Get comprehensive overview statistics for admin dashboard
   * @returns {Promise} Promise resolving to overview statistics
   */
  getOverviewStatistics: async () => {
    try {
      const response = await axiosInstance.get('/admin/overview/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching overview statistics:', error);
      throw error;
    }
  },

  /**
   * Get user statistics breakdown
   * @returns {Promise} Promise resolving to user statistics
   */
  getUserStatistics: async () => {
    try {
      const response = await axiosInstance.get('/admin/overview/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  },

  /**
   * Get financial statistics including platform fees
   * @returns {Promise} Promise resolving to financial statistics
   */
  getFinancialStatistics: async () => {
    try {
      const response = await axiosInstance.get('/admin/overview/financial');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial statistics:', error);
      throw error;
    }
  },

  /**
   * Get moderation statistics
   * @returns {Promise} Promise resolving to moderation statistics
   */
  getModerationStatistics: async () => {
    try {
      const response = await axiosInstance.get('/admin/overview/moderation');
      return response.data;
    } catch (error) {
      console.error('Error fetching moderation statistics:', error);
      throw error;
    }
  }
};

export default adminOverviewApi;