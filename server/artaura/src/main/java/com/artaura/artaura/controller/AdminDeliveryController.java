package com.artaura.artaura.controller;

import com.artaura.artaura.service.AdminDeliveryService;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import com.artaura.artaura.dto.delivery.ArtistPickupAddressDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/delivery")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDeliveryController {

    @Autowired
    private AdminDeliveryService adminDeliveryService;

    /**
     * Get all delivery requests for admin overview
     */
    @GetMapping("/requests/all")
    public ResponseEntity<Map<String, Object>> getAllDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getAllDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("message", "Successfully fetched all delivery requests");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery requests: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery requests filtered by status
     */
    @GetMapping("/requests/status/{status}")
    public ResponseEntity<Map<String, Object>> getDeliveryRequestsByStatus(@PathVariable String status) {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getDeliveryRequestsByStatus(status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("message", "Successfully fetched delivery requests by status");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery requests by status: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get artwork order delivery requests only
     */
    @GetMapping("/requests/artworks")
    public ResponseEntity<Map<String, Object>> getAllArtworkOrderDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getAllArtworkOrderDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("message", "Successfully fetched artwork order delivery requests");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch artwork order delivery requests: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get commission delivery requests only
     */
    @GetMapping("/requests/commissions")
    public ResponseEntity<Map<String, Object>> getAllCommissionDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getAllCommissionDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("message", "Successfully fetched commission delivery requests");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch commission delivery requests: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery requests within a date range
     */
    @GetMapping("/requests/date-range")
    public ResponseEntity<Map<String, Object>> getDeliveryRequestsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getDeliveryRequestsByDateRange(startDate, endDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("message", "Successfully fetched delivery requests by date range");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery requests by date range: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery requests with multiple filters
     */
    @PostMapping("/requests/filtered")
    public ResponseEntity<Map<String, Object>> getFilteredDeliveryRequests(@RequestBody Map<String, String> filters) {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getFilteredDeliveryRequests(filters);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("filters", filters);
            response.put("message", "Successfully fetched filtered delivery requests");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch filtered delivery requests: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery statistics for admin dashboard
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getDeliveryStatistics() {
        try {
            Map<String, Object> statistics = adminDeliveryService.getDeliveryStatistics();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", statistics);
            response.put("message", "Successfully fetched delivery statistics");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery statistics: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery request by ID and type
     */
    @GetMapping("/requests/{id}")
    public ResponseEntity<Map<String, Object>> getDeliveryRequestById(
            @PathVariable Long id,
            @RequestParam String requestType) {
        try {
            Optional<DeliveryRequestDTO> request = adminDeliveryService.getDeliveryRequestById(id, requestType);
            
            Map<String, Object> response = new HashMap<>();
            if (request.isPresent()) {
                response.put("success", true);
                response.put("data", request.get());
                response.put("message", "Successfully fetched delivery request");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Delivery request not found");
                response.put("data", null);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery request: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get all artist pickup addresses
     */
    @GetMapping("/pickup-addresses/all")
    public ResponseEntity<Map<String, Object>> getAllArtistPickupAddresses() {
        try {
            List<ArtistPickupAddressDTO> addresses = adminDeliveryService.getAllArtistPickupAddresses();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", addresses);
            response.put("total", addresses.size());
            response.put("message", "Successfully fetched all artist pickup addresses");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch artist pickup addresses: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery partner performance data
     */
    @GetMapping("/partners/performance")
    public ResponseEntity<Map<String, Object>> getDeliveryPartnerPerformance() {
        try {
            List<Map<String, Object>> performance = adminDeliveryService.getDeliveryPartnerPerformance();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", performance);
            response.put("total", performance.size());
            response.put("message", "Successfully fetched delivery partner performance");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery partner performance: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery requests for a specific buyer
     */
    @GetMapping("/requests/buyer/{buyerId}")
    public ResponseEntity<Map<String, Object>> getDeliveryRequestsByBuyerId(@PathVariable Long buyerId) {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getDeliveryRequestsByBuyerId(buyerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("message", "Successfully fetched delivery requests for buyer");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery requests for buyer: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery requests for a specific artist
     */
    @GetMapping("/requests/artist/{artistId}")
    public ResponseEntity<Map<String, Object>> getDeliveryRequestsByArtistId(@PathVariable Long artistId) {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getDeliveryRequestsByArtistId(artistId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("message", "Successfully fetched delivery requests for artist");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery requests for artist: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery requests assigned to a specific delivery partner
     */
    @GetMapping("/requests/partner/{partnerId}")
    public ResponseEntity<Map<String, Object>> getDeliveryRequestsByPartnerId(@PathVariable Long partnerId) {
        try {
            List<DeliveryRequestDTO> requests = adminDeliveryService.getDeliveryRequestsByPartnerId(partnerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", requests);
            response.put("total", requests.size());
            response.put("message", "Successfully fetched delivery requests for partner");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to fetch delivery requests for partner: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }
}