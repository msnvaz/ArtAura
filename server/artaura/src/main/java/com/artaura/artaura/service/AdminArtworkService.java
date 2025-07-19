package com.artaura.artaura.service;

import com.artaura.artaura.dao.AdminArtworkDAO;
import com.artaura.artaura.dto.admin.AdminArtworkDTO;
import com.artaura.artaura.dto.admin.AdminArtworkFilterDTO;
import com.artaura.artaura.dto.admin.AdminArtworkResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminArtworkService {

    @Autowired
    private AdminArtworkDAO adminArtworkDAO;

    /**
     * Get all artworks with pagination and filtering
     */
    public AdminArtworkResponseDTO getAllArtworks(AdminArtworkFilterDTO filter) {
        // Set default values if null
        if (filter.getPage() == null) filter.setPage(0);
        if (filter.getSize() == null) filter.setSize(10);
        if (filter.getSortBy() == null) filter.setSortBy("created_at");
        if (filter.getSortOrder() == null) filter.setSortOrder("DESC");
        
        return adminArtworkDAO.getAllArtworks(filter);
    }

    /**
     * Get artwork by ID
     */
    public Optional<AdminArtworkDTO> getArtworkById(Long artworkId) {
        return adminArtworkDAO.getArtworkById(artworkId);
    }

    /**
     * Get artworks by artist ID
     */
    public List<AdminArtworkDTO> getArtworksByArtistId(Long artistId) {
        return adminArtworkDAO.getArtworksByArtistId(artistId);
    }

    /**
     * Get artworks by category
     */
    public List<AdminArtworkDTO> getArtworksByCategory(String category) {
        return adminArtworkDAO.getArtworksByCategory(category);
    }

    /**
     * Get artworks by status
     */
    public List<AdminArtworkDTO> getArtworksByStatus(String status) {
        return adminArtworkDAO.getArtworksByStatus(status);
    }

    /**
     * Get featured artworks
     */
    public List<AdminArtworkDTO> getFeaturedArtworks() {
        return adminArtworkDAO.getFeaturedArtworks();
    }

    /**
     * Search artworks by title or description
     */
    public List<AdminArtworkDTO> searchArtworks(String searchTerm) {
        return adminArtworkDAO.searchArtworks(searchTerm);
    }

    /**
     * Get artwork statistics for admin dashboard
     */
    public Map<String, Object> getArtworkStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total counts
        stats.put("totalArtworks", adminArtworkDAO.getTotalArtworksCount());
        
        // Count by status
        Map<String, Long> statusCounts = new HashMap<>();
        List<String> statuses = adminArtworkDAO.getDistinctStatuses();
        for (String status : statuses) {
            statusCounts.put(status, adminArtworkDAO.getArtworksCountByStatus(status));
        }
        stats.put("statusCounts", statusCounts);
        
        // Count by category
        Map<String, Long> categoryCounts = new HashMap<>();
        List<String> categories = adminArtworkDAO.getDistinctCategories();
        for (String category : categories) {
            categoryCounts.put(category, adminArtworkDAO.getArtworksCountByCategory(category));
        }
        stats.put("categoryCounts", categoryCounts);
        
        return stats;
    }

    /**
     * Update artwork status
     */
    public boolean updateArtworkStatus(Long artworkId, String status) {
        System.out.println("AdminArtworkService: updateArtworkStatus called with artworkId=" + artworkId + ", status=" + status);
        
        // Validate status values - must match database enum ('Available', 'Sold', 'Reserved')
        List<String> validStatuses = List.of("Available", "Sold", "Reserved");
        if (!validStatuses.contains(status)) {
            System.out.println("AdminArtworkService: Invalid status provided: " + status + ". Valid statuses are: " + validStatuses);
            throw new IllegalArgumentException("Invalid status: " + status + ". Valid statuses are: " + validStatuses);
        }
        
        System.out.println("AdminArtworkService: Status validation passed, calling DAO");
        boolean result = adminArtworkDAO.updateArtworkStatus(artworkId, status);
        System.out.println("AdminArtworkService: DAO returned: " + result);
        
        return result;
    }

    /**
     * Update artwork featured status
     */
    public boolean updateArtworkFeaturedStatus(Long artworkId, Boolean isFeatured) {
        return adminArtworkDAO.updateArtworkFeaturedStatus(artworkId, isFeatured);
    }

    /**
     * Get filter options for admin dashboard
     */
    public Map<String, List<String>> getFilterOptions() {
        Map<String, List<String>> options = new HashMap<>();
        options.put("categories", adminArtworkDAO.getDistinctCategories());
        options.put("mediums", adminArtworkDAO.getDistinctMediums());
        options.put("statuses", adminArtworkDAO.getDistinctStatuses());
        return options;
    }

    /**
     * Bulk update artwork status
     */
    public Map<String, Object> bulkUpdateArtworkStatus(List<Long> artworkIds, String status) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int failCount = 0;
        
        for (Long artworkId : artworkIds) {
            if (updateArtworkStatus(artworkId, status)) {
                successCount++;
            } else {
                failCount++;
            }
        }
        
        result.put("successCount", successCount);
        result.put("failCount", failCount);
        result.put("totalProcessed", artworkIds.size());
        
        return result;
    }

    /**
     * Bulk update artwork featured status
     */
    public Map<String, Object> bulkUpdateArtworkFeaturedStatus(List<Long> artworkIds, Boolean isFeatured) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int failCount = 0;
        
        for (Long artworkId : artworkIds) {
            if (updateArtworkFeaturedStatus(artworkId, isFeatured)) {
                successCount++;
            } else {
                failCount++;
            }
        }
        
        result.put("successCount", successCount);
        result.put("failCount", failCount);
        result.put("totalProcessed", artworkIds.size());
        
        return result;
    }
}
