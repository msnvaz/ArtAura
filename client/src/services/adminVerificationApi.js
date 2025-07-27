import axiosInstance from '../util/axiosInstance';

export const adminVerificationApi = {
  // Get all verification requests with filtering
  getAllVerificationRequests: async (filters = {}) => {
    try {
      const params = {};
      
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      
      if (filters.userType && filters.userType !== 'all') {
        params.userType = filters.userType;
      }
      
      if (filters.search) {
        params.search = filters.search;
      }
      
      const response = await axiosInstance.get('/admin/verification/requests', { params });
      
      return {
        success: response.data.success,
        requests: response.data.requests || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      throw error;
    }
  },

  // Update verification status
  updateVerificationStatus: async (requestId, userType, status, rejectionReason = null) => {
    try {
      const payload = {
        userType,
        status
      };
      
      if (rejectionReason) {
        payload.rejectionReason = rejectionReason;
      }
      
      const response = await axiosInstance.put(`/admin/verification/requests/${requestId}/status`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw error;
    }
  },

  // Get verification statistics
  getVerificationStats: async () => {
    try {
      const response = await axiosInstance.get('/admin/verification/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching verification stats:', error);
      throw error;
    }
  }
};

export default adminVerificationApi;
