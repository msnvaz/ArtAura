package com.artaura.artaura.service;

import com.artaura.artaura.dto.CreateExhibitionDTO;
import com.artaura.artaura.dto.ExhibitionDTO;
import java.util.List;
import java.util.Map;

public interface ExhibitionService {

    /**
     * Create a new exhibition for an artist
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
     * @return Exhibition if found, null otherwise
     */
    ExhibitionDTO getExhibitionById(Integer exhibitionId);

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
     * Get exhibitions by status
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
    Map<String, Object> getExhibitionStatistics(Integer artistId);
}
