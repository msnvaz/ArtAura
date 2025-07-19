import axiosInstance from '../util/axiosInstance';

// Admin Artwork API service
export const adminUserApi = {
  // Get all artworks with pagination and filtering
  getAllUsers: async (filters = {}) => {
    try {
      const params = {
        page: filters.page || 0,
        size: filters.size || 10,
        sortBy: filters.sortBy || 'created_at',
        sortOrder: filters.sortOrder || 'DESC',
        ...filters
      };
      
      const response = await axiosInstance.get('/admin/users', { params });
      
      // Transform response to match expected structure
      return {
        content: response.data.content || [],
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
};

export default adminUserApi;
