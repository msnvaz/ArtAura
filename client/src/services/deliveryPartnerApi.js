import axiosInstance from '../util/axiosInstance';

const BASE_URL = '/delivery-partner';
const DELIVERY_STATUS_URL = '/delivery-status';

class DeliveryPartnerApi {
  /**
   * Get active delivery requests for the delivery partner
   */
  async getActiveDeliveries() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active deliveries:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch active deliveries' };
    }
  }

  /**
   * Get pending delivery requests (fallback API)
   */
  async getPendingDeliveries() {
    try {
      const response = await axiosInstance.get(`${DELIVERY_STATUS_URL}/pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending deliveries:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch pending deliveries' };
    }
  }

  /**
   * Get pending delivery requests (legacy endpoint)
   */
  async getPendingDeliveryRequests() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/requests/pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending delivery requests:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch pending delivery requests' };
    }
  }

  /**
   * Get pickup addresses for delivery requests
   */
  async getPickupAddresses() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/pickup-addresses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pickup addresses:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch pickup addresses' };
    }
  }

  /**
   * Get delivery partner profile by user ID
   * @param {number} userId - The user ID
   */
  async getDeliveryPartnerProfile(userId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/profile/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery partner profile:', error);
      throw error.response?.data || { success: false, error: 'Failed to fetch delivery partner profile' };
    }
  }

  /**
   * Accept a delivery request (enhanced endpoint)
   * @param {Object} acceptData - Object containing orderType, orderId, shippingFee, deliveryPartnerId
   */
  async acceptDeliveryEnhanced(acceptData) {
    try {
      const response = await axiosInstance.post(`${DELIVERY_STATUS_URL}/accept-enhanced`, acceptData);
      return response.data;
    } catch (error) {
      console.error('Error accepting delivery (enhanced):', error);
      throw error.response?.data || { success: false, error: 'Failed to accept delivery request' };
    }
  }

  /**
   * Accept a delivery request (standard endpoint)
   * @param {Object} acceptData - Object containing orderType, orderId, shippingFee, deliveryPartnerId
   */
  async acceptDelivery(acceptData) {
    try {
      const response = await axiosInstance.post(`${DELIVERY_STATUS_URL}/accept`, acceptData);
      return response.data;
    } catch (error) {
      console.error('Error accepting delivery:', error);
      throw error.response?.data || { success: false, error: 'Failed to accept delivery request' };
    }
  }

  /**
   * Accept a delivery request (legacy endpoint)
   * @param {number} requestId - The request ID
   * @param {Object} acceptData - Object containing requestType and deliveryFee
   */
  async acceptDeliveryLegacy(requestId, acceptData) {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/requests/${requestId}/accept`, acceptData);
      return response.data;
    } catch (error) {
      console.error('Error accepting delivery (legacy):', error);
      throw error.response?.data || { success: false, error: 'Failed to accept delivery request' };
    }
  }

  /**
   * Update delivery status to 'Out for Delivery'
   * @param {string} orderType - 'artwork' or 'commission'
   * @param {number} orderId - The order ID
   */
  async markOutForDelivery(orderType, orderId) {
    try {
      const response = await axiosInstance.put(
        `${DELIVERY_STATUS_URL}/${orderType}/${orderId}/out-for-delivery`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Error marking delivery as out for delivery:', error);
      throw error.response?.data || { success: false, error: 'Failed to update delivery status' };
    }
  }

  /**
   * Update delivery status to 'Delivered'
   * @param {string} orderType - 'artwork' or 'commission'
   * @param {number} orderId - The order ID
   */
  async markDelivered(orderType, orderId) {
    try {
      const response = await axiosInstance.put(
        `${DELIVERY_STATUS_URL}/${orderType}/${orderId}/delivered`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Error marking delivery as delivered:', error);
      throw error.response?.data || { success: false, error: 'Failed to update delivery status' };
    }
  }

  /**
   * Update delivery status comprehensively
   * @param {Object} updateData - Object containing orderId, orderType, deliveryStatus, etc.
   */
  async updateDeliveryStatusComprehensive(updateData) {
    try {
      const response = await axiosInstance.put(
        `${DELIVERY_STATUS_URL}/update-comprehensive`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating delivery status:', error);
      throw error.response?.data || { success: false, error: 'Failed to update delivery status' };
    }
  }

  /**
   * Generic method to update delivery status
   * @param {Object} delivery - The delivery object
   * @param {string} newStatus - The new status to set
   */
  async updateDeliveryStatus(delivery, newStatus) {
    const orderType = delivery.requestType === 'artwork_order' ? 'artwork' : 'commission';
    
    try {
      if (newStatus === 'picked_up' || newStatus === 'in_transit') {
        return await this.markOutForDelivery(orderType, delivery.id);
      } else if (newStatus === 'delivered') {
        return await this.markDelivered(orderType, delivery.id);
      } else {
        const updateData = {
          orderId: delivery.id,
          orderType: orderType,
          deliveryStatus: newStatus,
          shippingFee: null,
          deliveryPartnerId: null
        };
        return await this.updateDeliveryStatusComprehensive(updateData);
      }
    } catch (error) {
      console.error('Error in updateDeliveryStatus:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new DeliveryPartnerApi();
