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
