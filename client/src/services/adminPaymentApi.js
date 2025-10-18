import axiosInstance from '../util/axiosInstance';

const BASE_URL = '/admin/payments';

class AdminPaymentApi {
  /**
   * Get all payments with filters and pagination
   * @param {Object} params - Query parameters (page, size, sortBy, sortOrder, status, paymentType)
   */
  async getPayments(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Add filter params
      if (params.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }
      if (params.paymentType && params.paymentType !== 'all') {
        queryParams.append('paymentType', params.paymentType);
      }
      
      const response = await axiosInstance.get(`${BASE_URL}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch payments' };
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStatistics() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch payment statistics' };
    }
  }

  /**
   * Search payments by query
   * @param {string} query - Search query string
   */
  async searchPayments(query) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching payments:', error);
      throw error.response?.data || { success: false, error: 'Failed to search payments' };
    }
  }

  /**
   * Get payment details by ID
   * @param {number} paymentId - The payment ID
   */
  async getPaymentById(paymentId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch payment details' };
    }
  }

  /**
   * Update payment status
   * @param {number} paymentId - The payment ID
   * @param {string} status - The new status
   * @param {string} notes - Optional notes
   */
  async updatePaymentStatus(paymentId, status, notes = '') {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/${paymentId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error.response?.data || { success: false, error: 'Failed to update payment status' };
    }
  }

  /**
   * Initiate refund for a payment
   * @param {number} paymentId - The payment ID
   * @param {number} amount - Refund amount
   * @param {string} reason - Refund reason
   */
  async initiateRefund(paymentId, amount, reason) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/${paymentId}/refund`, {
        amount,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating refund:', error);
      throw error.response?.data || { success: false, error: 'Failed to initiate refund' };
    }
  }

  /**
   * Export payments data
   * @param {Object} filters - Export filters
   */
  async exportPayments(filters = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/export`, {
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting payments:', error);
      throw error.response?.data || { success: false, error: 'Failed to export payments' };
    }
  }

  /**
   * Get payment analytics/reports
   * @param {string} timeRange - Time range for analytics (e.g., '7days', '30days', '90days')
   */
  async getPaymentAnalytics(timeRange = '30days') {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/analytics?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch payment analytics' };
    }
  }
}

// Export a singleton instance
export default new AdminPaymentApi();
