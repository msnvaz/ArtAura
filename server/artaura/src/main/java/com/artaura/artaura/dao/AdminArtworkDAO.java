package com.artaura.artaura.dao;

import com.artaura.artaura.dto.admin.AdminArtworkDTO;
import com.artaura.artaura.dto.admin.AdminArtworkFilterDTO;
import com.artaura.artaura.dto.admin.AdminArtworkResponseDTO;

import java.util.List;
import java.util.Optional;

public interface AdminArtworkDAO {
    
    /**
     * Get all artworks with pagination and filtering
     */
    AdminArtworkResponseDTO getAllArtworks(AdminArtworkFilterDTO filter);
    
    /**
     * Get artwork by ID
     */
    Optional<AdminArtworkDTO> getArtworkById(Long artworkId);
    
    /**
     * Get artworks by artist ID
     */
    List<AdminArtworkDTO> getArtworksByArtistId(Long artistId);
    
    /**
     * Get artworks by category
     */
    List<AdminArtworkDTO> getArtworksByCategory(String category);
    
    /**
     * Get artworks by status
     */
    List<AdminArtworkDTO> getArtworksByStatus(String status);
    
    /**
     * Get featured artworks
     */
    List<AdminArtworkDTO> getFeaturedArtworks();
    
    /**
     * Search artworks by title or description
     */
    List<AdminArtworkDTO> searchArtworks(String searchTerm);
    
    /**
     * Get artwork statistics
     */
    Long getTotalArtworksCount();
    
    /**
     * Get artworks count by status
     */
    Long getArtworksCountByStatus(String status);
    
    /**
     * Get artworks count by category
     */
    Long getArtworksCountByCategory(String category);
    
    /**
     * Update artwork status
     */
    boolean updateArtworkStatus(Long artworkId, String status);
    
    /**
     * Update artwork featured status
     */
    boolean updateArtworkFeaturedStatus(Long artworkId, Boolean isFeatured);
    
    /**
     * Get distinct categories
     */
    List<String> getDistinctCategories();
    
    /**
     * Get distinct mediums
     */
    List<String> getDistinctMediums();
    
    /**
     * Get distinct statuses
     */
    List<String> getDistinctStatuses();
}