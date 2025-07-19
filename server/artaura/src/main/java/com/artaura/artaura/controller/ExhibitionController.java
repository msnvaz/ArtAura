package com.artaura.artaura.controller;

import com.artaura.artaura.dto.CreateExhibitionDTO;
import com.artaura.artaura.dto.ExhibitionDTO;
import com.artaura.artaura.service.ExhibitionService;
import com.artaura.artaura.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exhibitions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ExhibitionController {

    private static final Logger logger = LoggerFactory.getLogger(ExhibitionController.class);

    @Autowired
    private ExhibitionService exhibitionService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Create a new exhibition
     */
    @PostMapping("/create")
    public ResponseEntity<?> createExhibition(
            @RequestBody CreateExhibitionDTO createExhibitionDTO,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        logger.info("POST /api/exhibitions/create - Creating new exhibition: {}", createExhibitionDTO.getTitle());

        try {
            // Extract and validate JWT token
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                logger.warn("Missing or invalid Authorization header");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
            }

            String token = authorizationHeader.substring(7);

            Long artistIdLong;
            try {
                jwtUtil.validateToken(token);
                artistIdLong = jwtUtil.extractUserId(token);
            } catch (Exception e) {
                logger.warn("Invalid JWT token: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            Integer artistId = artistIdLong.intValue();
            if (artistId == null) {
                logger.warn("Could not extract artist ID from token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            // Create the exhibition
            ExhibitionDTO createdExhibition = exhibitionService.createExhibition(createExhibitionDTO, artistId);

            logger.info("Successfully created exhibition with ID: {}", createdExhibition.getExhibitionId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExhibition);

        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for creating exhibition: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating exhibition: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create exhibition: " + e.getMessage());
        }
    }

    /**
     * Get all exhibitions for a specific artist
     */
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<?> getExhibitionsByArtistId(@PathVariable Integer artistId) {
        logger.info("GET /api/exhibitions/artist/{} - Fetching exhibitions for artist", artistId);

        try {
            List<ExhibitionDTO> exhibitions = exhibitionService.getExhibitionsByArtistId(artistId);
            logger.info("Found {} exhibitions for artist ID: {}", exhibitions.size(), artistId);
            return ResponseEntity.ok(exhibitions);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid artist ID: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid artist ID: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching exhibitions for artist {}: {}", artistId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch exhibitions: " + e.getMessage());
        }
    }

    /**
     * Get a specific exhibition by ID
     */
    @GetMapping("/{exhibitionId}")
    public ResponseEntity<?> getExhibitionById(@PathVariable Integer exhibitionId) {
        logger.info("GET /api/exhibitions/{} - Fetching exhibition by ID", exhibitionId);

        try {
            ExhibitionDTO exhibition = exhibitionService.getExhibitionById(exhibitionId);
            if (exhibition != null) {
                return ResponseEntity.ok(exhibition);
            } else {
                logger.warn("Exhibition not found with ID: {}", exhibitionId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exhibition not found");
            }
        } catch (IllegalArgumentException e) {
            logger.error("Invalid exhibition ID: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid exhibition ID: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching exhibition {}: {}", exhibitionId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch exhibition: " + e.getMessage());
        }
    }

    /**
     * Update an existing exhibition
     */
    @PutMapping("/{exhibitionId}")
    public ResponseEntity<?> updateExhibition(
            @PathVariable Integer exhibitionId,
            @RequestBody ExhibitionDTO exhibitionDTO,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        logger.info("PUT /api/exhibitions/{} - Updating exhibition", exhibitionId);

        try {
            // Extract and validate JWT token
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                logger.warn("Missing or invalid Authorization header");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
            }

            String token = authorizationHeader.substring(7);
            try {
                jwtUtil.validateToken(token);
            } catch (Exception e) {
                logger.warn("Invalid JWT token for update: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            // Update the exhibition
            ExhibitionDTO updatedExhibition = exhibitionService.updateExhibition(exhibitionId, exhibitionDTO);

            if (updatedExhibition != null) {
                logger.info("Successfully updated exhibition with ID: {}", exhibitionId);
                return ResponseEntity.ok(updatedExhibition);
            } else {
                logger.warn("Exhibition not found for update with ID: {}", exhibitionId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exhibition not found");
            }

        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for updating exhibition: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating exhibition {}: {}", exhibitionId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update exhibition: " + e.getMessage());
        }
    }

    /**
     * Delete an exhibition
     */
    @DeleteMapping("/{exhibitionId}")
    public ResponseEntity<?> deleteExhibition(
            @PathVariable Integer exhibitionId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        logger.info("DELETE /api/exhibitions/{} - Deleting exhibition", exhibitionId);

        try {
            // Extract and validate JWT token
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                logger.warn("Missing or invalid Authorization header");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
            }

            String token = authorizationHeader.substring(7);
            try {
                jwtUtil.validateToken(token);
            } catch (Exception e) {
                logger.warn("Invalid JWT token for delete: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            boolean deleted = exhibitionService.deleteExhibition(exhibitionId);

            if (deleted) {
                logger.info("Successfully deleted exhibition with ID: {}", exhibitionId);
                return ResponseEntity.ok("Exhibition deleted successfully");
            } else {
                logger.warn("Exhibition not found for deletion with ID: {}", exhibitionId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exhibition not found");
            }

        } catch (IllegalArgumentException e) {
            logger.error("Invalid exhibition ID for deletion: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid exhibition ID: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error deleting exhibition {}: {}", exhibitionId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete exhibition: " + e.getMessage());
        }
    }

    /**
     * Get exhibitions by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getExhibitionsByStatus(@PathVariable String status) {
        logger.info("GET /api/exhibitions/status/{} - Fetching exhibitions by status", status);

        try {
            List<ExhibitionDTO> exhibitions = exhibitionService.getExhibitionsByStatus(status);
            logger.info("Found {} exhibitions with status: {}", exhibitions.size(), status);
            return ResponseEntity.ok(exhibitions);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching exhibitions by status {}: {}", status, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch exhibitions: " + e.getMessage());
        }
    }

    /**
     * Get featured exhibitions
     */
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedExhibitions() {
        logger.info("GET /api/exhibitions/featured - Fetching featured exhibitions");

        try {
            List<ExhibitionDTO> exhibitions = exhibitionService.getFeaturedExhibitions();
            logger.info("Found {} featured exhibitions", exhibitions.size());
            return ResponseEntity.ok(exhibitions);
        } catch (Exception e) {
            logger.error("Error fetching featured exhibitions: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch featured exhibitions: " + e.getMessage());
        }
    }

    /**
     * Get exhibition statistics for an artist
     */
    @GetMapping("/statistics/artist/{artistId}")
    public ResponseEntity<?> getExhibitionStatistics(@PathVariable Integer artistId) {
        logger.info("GET /api/exhibitions/statistics/artist/{} - Fetching exhibition statistics", artistId);

        try {
            Map<String, Object> statistics = exhibitionService.getExhibitionStatistics(artistId);
            logger.info("Retrieved exhibition statistics for artist ID: {}", artistId);
            return ResponseEntity.ok(statistics);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid artist ID for statistics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid artist ID: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching exhibition statistics for artist {}: {}", artistId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch statistics: " + e.getMessage());
        }
    }
}
