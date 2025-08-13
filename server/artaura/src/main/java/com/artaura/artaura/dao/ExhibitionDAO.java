package com.artaura.artaura.dao;

import com.artaura.artaura.dto.CreateExhibitionDTO;
import com.artaura.artaura.dto.ExhibitionDTO;
import java.util.List;
import java.util.Optional;

public interface ExhibitionDAO {

    /**
     * Create a new exhibition
     *
     * @param createExhibitionDTO Exhibition data to create
     * @param artistId ID of the artist creating the exhibition
     * @return Created exhibition with generated ID
     */
    ExhibitionDTO createExhibition(CreateExhibitionDTO createExhibitionDTO, Integer artistId);

    /**
     * Get all exhibitions for a specific artist
     *
     * @param artistId ID of the artist
     * @return List of exhibitions for the artist
     */
    List<ExhibitionDTO> getExhibitionsByArtistId(Integer artistId);

    /**
     * Get a specific exhibition by ID
     *
     * @param exhibitionId ID of the exhibition
     * @return Exhibition if found, empty optional otherwise
     */
    Optional<ExhibitionDTO> getExhibitionById(Integer exhibitionId);

    /**
     * Update an existing exhibition
     *
     * @param exhibitionId ID of the exhibition to update
     * @param exhibitionDTO Updated exhibition data
     * @return Updated exhibition
     */
    ExhibitionDTO updateExhibition(Integer exhibitionId, ExhibitionDTO exhibitionDTO);

    /**
     * Delete an exhibition
     *
     * @param exhibitionId ID of the exhibition to delete
     * @return true if deleted successfully, false otherwise
     */
    boolean deleteExhibition(Integer exhibitionId);

    /**
     * Get all exhibitions with a specific status
     *
     * @param status Status to filter by (upcoming, ongoing, completed,
     * cancelled)
     * @return List of exhibitions with the specified status
     */
    List<ExhibitionDTO> getExhibitionsByStatus(String status);

    /**
     * Get featured exhibitions
     *
     * @return List of featured exhibitions
     */
    List<ExhibitionDTO> getFeaturedExhibitions();

    /**
     * Get exhibition statistics for an artist
     *
     * @param artistId ID of the artist
     * @return Map containing various statistics
     */
    java.util.Map<String, Object> getExhibitionStatistics(Integer artistId);
}