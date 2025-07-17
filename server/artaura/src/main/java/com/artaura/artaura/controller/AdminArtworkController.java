package com.artaura.artaura.controller;

import com.artaura.artaura.dto.admin.AdminArtworkDTO;
import com.artaura.artaura.dto.admin.AdminArtworkFilterDTO;
import com.artaura.artaura.dto.admin.AdminArtworkResponseDTO;
import com.artaura.artaura.service.AdminArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/artworks")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminArtworkController {

    @Autowired
    private AdminArtworkService adminArtworkService;

    /**
     * Get all artworks with pagination and filtering
     * GET /api/admin/artworks?page=0&size=10&category=painting&status=active&sortBy=title&sortOrder=ASC
     */
    @GetMapping
    public ResponseEntity<AdminArtworkResponseDTO> getAllArtworks(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "artistName", required = false) String artistName,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "minYear", required = false) Integer minYear,
            @RequestParam(value = "maxYear", required = false) Integer maxYear,
            @RequestParam(value = "medium", required = false) String medium,
            @RequestParam(value = "isFeatured", required = false) Boolean isFeatured,
            @RequestParam(value = "sortBy", defaultValue = "created_at") String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "DESC") String sortOrder) {
        
        try {
            AdminArtworkFilterDTO filter = new AdminArtworkFilterDTO(
                category, status, artistName, minPrice, maxPrice, minYear, maxYear,
                medium, isFeatured, sortBy, sortOrder, page, size
            );
            
            AdminArtworkResponseDTO response = adminArtworkService.getAllArtworks(filter);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get artwork by ID
     * GET /api/admin/artworks/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminArtworkDTO> getArtworkById(@PathVariable Long id) {
        try {
            Optional<AdminArtworkDTO> artwork = adminArtworkService.getArtworkById(id);
            if (artwork.isPresent()) {
                return ResponseEntity.ok(artwork.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get artworks by artist ID
     * GET /api/admin/artworks/artist/{artistId}
     */
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<AdminArtworkDTO>> getArtworksByArtistId(@PathVariable Long artistId) {
        try {
            List<AdminArtworkDTO> artworks = adminArtworkService.getArtworksByArtistId(artistId);
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get artworks by category
     * GET /api/admin/artworks/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<AdminArtworkDTO>> getArtworksByCategory(@PathVariable String category) {
        try {
            List<AdminArtworkDTO> artworks = adminArtworkService.getArtworksByCategory(category);
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get artworks by status
     * GET /api/admin/artworks/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AdminArtworkDTO>> getArtworksByStatus(@PathVariable String status) {
        try {
            List<AdminArtworkDTO> artworks = adminArtworkService.getArtworksByStatus(status);
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get featured artworks
     * GET /api/admin/artworks/featured
     */
    @GetMapping("/featured")
    public ResponseEntity<List<AdminArtworkDTO>> getFeaturedArtworks() {
        try {
            List<AdminArtworkDTO> artworks = adminArtworkService.getFeaturedArtworks();
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search artworks
     * GET /api/admin/artworks/search?q=searchTerm
     */
    @GetMapping("/search")
    public ResponseEntity<List<AdminArtworkDTO>> searchArtworks(@RequestParam("q") String searchTerm) {
        try {
            List<AdminArtworkDTO> artworks = adminArtworkService.searchArtworks(searchTerm);
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get artwork statistics
     * GET /api/admin/artworks/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getArtworkStatistics() {
        try {
            Map<String, Object> statistics = adminArtworkService.getArtworkStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get filter options
     * GET /api/admin/artworks/filter-options
     */
    @GetMapping("/filter-options")
    public ResponseEntity<Map<String, List<String>>> getFilterOptions() {
        try {
            Map<String, List<String>> options = adminArtworkService.getFilterOptions();
            return ResponseEntity.ok(options);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update artwork status
     * PUT /api/admin/artworks/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateArtworkStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            if (status == null || status.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Status is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            boolean updated = adminArtworkService.updateArtworkStatus(id, status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", updated);
            response.put("message", updated ? "Status updated successfully" : "Failed to update status");

            return updated ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Update artwork featured status
     * PUT /api/admin/artworks/{id}/featured
     */
    @PutMapping("/{id}/featured")
    public ResponseEntity<Map<String, Object>> updateArtworkFeaturedStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, Boolean> request) {
        try {
            Boolean isFeatured = request.get("isFeatured");
            if (isFeatured == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "isFeatured is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            boolean updated = adminArtworkService.updateArtworkFeaturedStatus(id, isFeatured);
            Map<String, Object> response = new HashMap<>();
            response.put("success", updated);
            response.put("message", updated ? "Featured status updated successfully" : "Failed to update featured status");

            return updated ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Bulk update artwork status
     * PUT /api/admin/artworks/bulk/status
     */
    @PutMapping("/bulk/status")
    public ResponseEntity<Map<String, Object>> bulkUpdateArtworkStatus(
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> artworkIds = (List<Long>) request.get("artworkIds");
            String status = (String) request.get("status");

            if (artworkIds == null || artworkIds.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Artwork IDs are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            if (status == null || status.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Status is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Map<String, Object> result = adminArtworkService.bulkUpdateArtworkStatus(artworkIds, status);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Bulk update artwork featured status
     * PUT /api/admin/artworks/bulk/featured
     */
    @PutMapping("/bulk/featured")
    public ResponseEntity<Map<String, Object>> bulkUpdateArtworkFeaturedStatus(
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> artworkIds = (List<Long>) request.get("artworkIds");
            Boolean isFeatured = (Boolean) request.get("isFeatured");

            if (artworkIds == null || artworkIds.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Artwork IDs are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            if (isFeatured == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "isFeatured is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Map<String, Object> result = adminArtworkService.bulkUpdateArtworkFeaturedStatus(artworkIds, isFeatured);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
