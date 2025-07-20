package com.artaura.artaura.service.impl;

import com.artaura.artaura.dao.ExhibitionDAO;
import com.artaura.artaura.dto.CreateExhibitionDTO;
import com.artaura.artaura.dto.ExhibitionDTO;
import com.artaura.artaura.service.ExhibitionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ExhibitionServiceImpl implements ExhibitionService {

    private static final Logger logger = LoggerFactory.getLogger(ExhibitionServiceImpl.class);

    @Autowired
    private ExhibitionDAO exhibitionDAO;

    @Override
    public ExhibitionDTO createExhibition(CreateExhibitionDTO createExhibitionDTO, Integer artistId) {
        logger.info("Service: Creating exhibition '{}' for artist ID: {}", createExhibitionDTO.getTitle(), artistId);

        // Basic validation
        if (createExhibitionDTO.getTitle() == null || createExhibitionDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Exhibition title is required");
        }
        if (createExhibitionDTO.getLocation() == null || createExhibitionDTO.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Exhibition location is required");
        }
        if (createExhibitionDTO.getStartDate() == null) {
            throw new IllegalArgumentException("Exhibition start date is required");
        }
        if (createExhibitionDTO.getEndDate() == null) {
            throw new IllegalArgumentException("Exhibition end date is required");
        }
        if (createExhibitionDTO.getStartDate().isAfter(createExhibitionDTO.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        try {
            ExhibitionDTO createdExhibition = exhibitionDAO.createExhibition(createExhibitionDTO, artistId);
            logger.info("Service: Successfully created exhibition with ID: {}", createdExhibition != null ? createdExhibition.getExhibitionId() : "null");
            return createdExhibition;
        } catch (Exception e) {
            logger.error("Service: Error creating exhibition: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create exhibition: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ExhibitionDTO> getExhibitionsByArtistId(Integer artistId) {
        logger.info("Service: Fetching exhibitions for artist ID: {}", artistId);

        if (artistId == null) {
            throw new IllegalArgumentException("Artist ID is required");
        }

        try {
            List<ExhibitionDTO> exhibitions = exhibitionDAO.getExhibitionsByArtistId(artistId);
            logger.info("Service: Found {} exhibitions for artist ID: {}", exhibitions.size(), artistId);
            return exhibitions;
        } catch (Exception e) {
            logger.error("Service: Error fetching exhibitions for artist {}: {}", artistId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibitions: " + e.getMessage(), e);
        }
    }

    @Override
    public ExhibitionDTO getExhibitionById(Integer exhibitionId) {
        logger.info("Service: Fetching exhibition by ID: {}", exhibitionId);

        if (exhibitionId == null) {
            throw new IllegalArgumentException("Exhibition ID is required");
        }

        try {
            return exhibitionDAO.getExhibitionById(exhibitionId).orElse(null);
        } catch (Exception e) {
            logger.error("Service: Error fetching exhibition {}: {}", exhibitionId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibition: " + e.getMessage(), e);
        }
    }

    @Override
    public ExhibitionDTO updateExhibition(Integer exhibitionId, ExhibitionDTO exhibitionDTO) {
        logger.info("Service: Updating exhibition ID: {}", exhibitionId);

        if (exhibitionId == null) {
            throw new IllegalArgumentException("Exhibition ID is required");
        }
        if (exhibitionDTO == null) {
            throw new IllegalArgumentException("Exhibition data is required");
        }

        // Basic validation
        if (exhibitionDTO.getTitle() == null || exhibitionDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Exhibition title is required");
        }
        if (exhibitionDTO.getLocation() == null || exhibitionDTO.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Exhibition location is required");
        }
        if (exhibitionDTO.getStartDate() == null) {
            throw new IllegalArgumentException("Exhibition start date is required");
        }
        if (exhibitionDTO.getEndDate() == null) {
            throw new IllegalArgumentException("Exhibition end date is required");
        }
        if (exhibitionDTO.getStartDate().isAfter(exhibitionDTO.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        // Check if exhibition exists
        ExhibitionDTO existingExhibition = getExhibitionById(exhibitionId);
        if (existingExhibition == null) {
            throw new RuntimeException("Exhibition not found with ID: " + exhibitionId);
        }

        try {
            ExhibitionDTO updatedExhibition = exhibitionDAO.updateExhibition(exhibitionId, exhibitionDTO);
            logger.info("Service: Successfully updated exhibition ID: {}", exhibitionId);
            return updatedExhibition;
        } catch (Exception e) {
            logger.error("Service: Error updating exhibition {}: {}", exhibitionId, e.getMessage(), e);
            throw new RuntimeException("Failed to update exhibition: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteExhibition(Integer exhibitionId) {
        logger.info("Service: Deleting exhibition ID: {}", exhibitionId);

        if (exhibitionId == null) {
            throw new IllegalArgumentException("Exhibition ID is required");
        }

        // Check if exhibition exists
        ExhibitionDTO existingExhibition = getExhibitionById(exhibitionId);
        if (existingExhibition == null) {
            throw new RuntimeException("Exhibition not found with ID: " + exhibitionId);
        }

        try {
            boolean deleted = exhibitionDAO.deleteExhibition(exhibitionId);
            logger.info("Service: Exhibition deletion result for ID {}: {}", exhibitionId, deleted);
            return deleted;
        } catch (Exception e) {
            logger.error("Service: Error deleting exhibition {}: {}", exhibitionId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete exhibition: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ExhibitionDTO> getExhibitionsByStatus(String status) {
        logger.info("Service: Fetching exhibitions by status: {}", status);

        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }

        // Validate status values
        String normalizedStatus = status.toLowerCase().trim();
        if (!normalizedStatus.equals("upcoming") && !normalizedStatus.equals("ongoing")
                && !normalizedStatus.equals("completed") && !normalizedStatus.equals("cancelled")) {
            throw new IllegalArgumentException("Invalid status. Must be one of: upcoming, ongoing, completed, cancelled");
        }

        try {
            List<ExhibitionDTO> exhibitions = exhibitionDAO.getExhibitionsByStatus(normalizedStatus);
            logger.info("Service: Found {} exhibitions with status: {}", exhibitions.size(), status);
            return exhibitions;
        } catch (Exception e) {
            logger.error("Service: Error fetching exhibitions by status {}: {}", status, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibitions by status: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ExhibitionDTO> getFeaturedExhibitions() {
        logger.info("Service: Fetching featured exhibitions");

        try {
            List<ExhibitionDTO> exhibitions = exhibitionDAO.getFeaturedExhibitions();
            logger.info("Service: Found {} featured exhibitions", exhibitions.size());
            return exhibitions;
        } catch (Exception e) {
            logger.error("Service: Error fetching featured exhibitions: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch featured exhibitions: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getExhibitionStatistics(Integer artistId) {
        logger.info("Service: Fetching exhibition statistics for artist ID: {}", artistId);

        if (artistId == null) {
            throw new IllegalArgumentException("Artist ID is required");
        }

        try {
            Map<String, Object> statistics = exhibitionDAO.getExhibitionStatistics(artistId);
            logger.info("Service: Retrieved exhibition statistics for artist ID: {}", artistId);
            return statistics;
        } catch (Exception e) {
            logger.error("Service: Error fetching exhibition statistics for artist {}: {}", artistId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibition statistics: " + e.getMessage(), e);
        }
    }
}
