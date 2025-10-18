package com.artaura.artaura.controller.artist;

import com.artaura.artaura.dto.artist.ArtistArtworkOrderDTO;
import com.artaura.artaura.service.artist.ArtistArtworkOrderService;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for handling artist artwork orders endpoints Provides API
 * endpoints for artists to view their artwork orders and request delivery
 */
@RestController
@RequestMapping("/api/artist/artwork-orders")
@CrossOrigin(origins = "*")
public class ArtistArtworkOrderController {

    @Autowired
    private ArtistArtworkOrderService artistArtworkOrderService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Get all artwork orders for the logged-in artist
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getArtistArtworkOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            List<ArtistArtworkOrderDTO> orders = artistArtworkOrderService.getArtworkOrdersByArtistId(artistId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Artwork orders retrieved successfully");
            response.put("data", orders);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving artwork orders: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get artwork orders count for the logged-in artist
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getArtistArtworkOrdersCount(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            int totalCount = artistArtworkOrderService.getArtworkOrdersCountByArtistId(artistId);
            int pendingDeliveryCount = artistArtworkOrderService.getPendingDeliveryOrdersCountByArtistId(artistId);

            Map<String, Object> countData = new HashMap<>();
            countData.put("total", totalCount);
            countData.put("pendingDelivery", pendingDeliveryCount);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Artwork orders count retrieved successfully");
            response.put("data", countData);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving artwork orders count: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Request delivery for an artwork order
     */
    @PostMapping("/{orderId}/request-delivery")
    public ResponseEntity<Map<String, Object>> requestDelivery(@PathVariable Long orderId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            boolean success = artistArtworkOrderService.requestDelivery(orderId, artistId);

            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("message", "Delivery request submitted successfully");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Failed to submit delivery request");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error submitting delivery request: " + e.getMessage());
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
