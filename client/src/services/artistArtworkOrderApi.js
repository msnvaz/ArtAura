import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * API service for artist artwork orders
 * Handles communication with backend endpoints for artwork orders functionality
 */
class ArtistArtworkOrderApi {
    constructor() {
        this.baseURL = `${API_URL}/api/artist/artwork-orders`;
    }

    /**
     * Get authorization headers with JWT token
     */
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Get all artwork orders for the logged-in artist
     */
    async getArtworkOrders() {
        try {
            const response = await axios.get(this.baseURL, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching artwork orders:', error);
            throw error.response?.data || { success: false, message: 'Failed to fetch artwork orders' };
        }
    }

    /**
     * Get artwork orders count for the logged-in artist
     */
    async getArtworkOrdersCount() {
        try {
            const response = await axios.get(`${this.baseURL}/count`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching artwork orders count:', error);
            throw error.response?.data || { success: false, message: 'Failed to fetch artwork orders count' };
        }
    }

    /**
     * Request delivery for an artwork order
     */
    async requestDelivery(orderId) {
        try {
            const response = await axios.post(`${this.baseURL}/${orderId}/request-delivery`, {}, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error requesting delivery:', error);
            throw error.response?.data || { success: false, message: 'Failed to request delivery' };
        }
    }
}

// Create and export a singleton instance
const artistArtworkOrderApi = new ArtistArtworkOrderApi();
export default artistArtworkOrderApi;
