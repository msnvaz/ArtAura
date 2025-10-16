import axiosInstance from '../util/axiosInstance';

const BASE_URL = '/admin/delivery';

class AdminDeliveryApi {
  /**
   * Get all delivery requests for admin overview
   */
  async getAllDeliveryRequests() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all delivery requests:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery requests' };
    }
  }

  /**
   * Get delivery requests filtered by status
   * @param {string} status - The delivery status to filter by
   */
  async getDeliveryRequestsByStatus(status) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery requests by status:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery requests by status' };
    }
  }

  /**
   * Get artwork order delivery requests only
   */
  async getArtworkOrderDeliveryRequests() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/artworks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artwork order delivery requests:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch artwork order delivery requests' };
    }
  }

  /**
   * Get commission delivery requests only
   */
  async getCommissionDeliveryRequests() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/commissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching commission delivery requests:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch commission delivery requests' };
    }
  }

  /**
   * Get delivery requests within a date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   */
  async getDeliveryRequestsByDateRange(startDate, endDate) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/date-range`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery requests by date range:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery requests by date range' };
    }
  }

  /**
   * Get delivery requests with multiple filters
   * @param {Object} filters - Filter criteria object
   */
  async getFilteredDeliveryRequests(filters) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/requests/filtered`, filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered delivery requests:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch filtered delivery requests' };
    }
  }

  /**
   * Get delivery statistics for admin dashboard
   */
  async getDeliveryStatistics() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery statistics:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery statistics' };
    }
  }

  /**
   * Get delivery request by ID and type
   * @param {number} id - The request ID
   * @param {string} requestType - Either "artwork_order" or "commission_request"
   */
  async getDeliveryRequestById(id, requestType) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/${id}`, {
        params: { requestType }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery request by ID:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery request' };
    }
  }

  /**
   * Get all artist pickup addresses
   */
  async getAllArtistPickupAddresses() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/pickup-addresses/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artist pickup addresses:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch artist pickup addresses' };
    }
  }

  /**
   * Get delivery partner performance data
   */
  async getDeliveryPartnerPerformance() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/partners/performance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery partner performance:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery partner performance' };
    }
  }

  /**
   * Get delivery requests for a specific buyer
   * @param {number} buyerId - The buyer ID
   */
  async getDeliveryRequestsByBuyerId(buyerId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/buyer/${buyerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery requests for buyer:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery requests for buyer' };
    }
  }

  /**
   * Get delivery requests for a specific artist
   * @param {number} artistId - The artist ID
   */
  async getDeliveryRequestsByArtistId(artistId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/artist/${artistId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery requests for artist:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery requests for artist' };
    }
  }

  /**
   * Get delivery requests assigned to a specific delivery partner
   * @param {number} partnerId - The delivery partner ID
   */
  async getDeliveryRequestsByPartnerId(partnerId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery requests for partner:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery requests for partner' };
    }
  }
}

// Create and export a singleton instance
const adminDeliveryApi = new AdminDeliveryApi();
export default adminDeliveryApi;