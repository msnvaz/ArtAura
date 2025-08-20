import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin/artworks`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      switch (status) {
        case 401:
          console.error('Authentication required. Please log in.');
          // Optionally redirect to login page
          break;
        case 403:
          console.error('Access forbidden. Admin privileges required.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
        default:
          console.error(`Error ${status}: ${message}`);
      }

      error.message = `${status}: ${message}`;
    } else if (error.request) {
      // Network error
      console.error('Network error. Please check your connection.');
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

// Admin Artwork API service
export const adminArtworkApi = {
  // Get all artworks with pagination and filtering
  getAllArtworks: async (filters = {}) => {
    try {
      const params = {
        page: filters.page || 0,
        size: filters.size || 10,
        sortBy: filters.sortBy || 'created_at',
        sortOrder: filters.sortOrder || 'DESC',
        ...filters
      };

      const response = await apiClient.get('', { params });

      // Transform response to match expected structure
      return {
        content: response.data.artworks || [],
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        currentPage: response.data.currentPage || 0,
        pageSize: response.data.pageSize || 10
      };
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  },

  // Get artwork by ID
  getArtworkById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artwork:', error);
      throw error;
    }
  },

  // Get artworks by artist ID
  getArtworksByArtistId: async (artistId) => {
    try {
      const response = await apiClient.get(`/artist/${artistId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artworks by artist:', error);
      throw error;
    }
  },

  // Get artworks by category
  getArtworksByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artworks by category:', error);
      throw error;
    }
  },

  // Get artworks by status
  getArtworksByStatus: async (status) => {
    try {
      const response = await apiClient.get(`/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artworks by status:', error);
      throw error;
    }
  },

  // Get featured artworks
  getFeaturedArtworks: async () => {
    try {
      const response = await apiClient.get('/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured artworks:', error);
      throw error;
    }
  },

  // Search artworks
  searchArtworks: async (searchTerm) => {
    try {
      const response = await apiClient.get('/search', {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching artworks:', error);
      throw error;
    }
  },

  // Get artwork statistics
  getArtworkStatistics: async () => {
    try {
      const response = await apiClient.get('/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching artwork statistics:', error);
      throw error;
    }
  },

  // Get filter options
  getFilterOptions: async () => {
    try {
      const response = await apiClient.get('/filter-options');
      return response.data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  },

  // Update artwork status
  updateArtworkStatus: async (id, status) => {
    try {
      console.log('API: updateArtworkStatus called with id:', id, 'status:', status);
      console.log('API: Sending PUT request to:', `/${id}/status`);
      console.log('API: Request body:', { status });

      const response = await apiClient.put(`/${id}/status`, { status });
      console.log('API: Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Error updating artwork status:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      throw error;
    }
  },

  // Update artwork featured status
  updateArtworkFeaturedStatus: async (id, isFeatured) => {
    try {
      const response = await apiClient.put(`/${id}/featured`, { isFeatured });
      return response.data;
    } catch (error) {
      console.error('Error updating artwork featured status:', error);
      throw error;
    }
  },

  // Bulk update artwork status
  bulkUpdateArtworkStatus: async (artworkIds, status) => {
    try {
      const response = await apiClient.put('/bulk/status', {
        artworkIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating artwork status:', error);
      throw error;
    }
  },

  // Bulk update artwork featured status
  bulkUpdateArtworkFeaturedStatus: async (artworkIds, isFeatured) => {
    try {
      const response = await apiClient.put('/bulk/featured', {
        artworkIds,
        isFeatured
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating artwork featured status:', error);
      throw error;
    }
  }
};

export default adminArtworkApi;
