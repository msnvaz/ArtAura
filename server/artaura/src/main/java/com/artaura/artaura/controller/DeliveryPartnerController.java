package com.artaura.artaura.controller;

import com.artaura.artaura.service.DeliveryPartnerService;
import com.artaura.artaura.service.DeliveryRequestService;
import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.dto.auth.DeliveryPartnerDTO;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery-partner")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryPartnerController {

    @Autowired
    private DeliveryPartnerService deliveryPartnerService;

    @Autowired
    private DeliveryRequestService deliveryRequestService;

    @Autowired
    private DeliveryPartnerDAO deliveryPartnerDAO;

    @GetMapping("/name/{partnerId}")
    public ResponseEntity<Map<String, String>> getPartnerName(@PathVariable Long partnerId) {
        try {
            Optional<String> partnerName = deliveryPartnerService.getPartnerNameById(partnerId);
            
            Map<String, String> response = new HashMap<>();
            if (partnerName.isPresent()) {
                response.put("partnerName", partnerName.get());
                response.put("success", "true");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Partner not found");
                response.put("success", "false");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", "false");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/profile/{partnerId}")
    public ResponseEntity<Map<String, Object>> getPartnerProfile(@PathVariable Long partnerId) {
        try {
            Optional<Map<String, String>> profile = deliveryPartnerService.getPartnerProfileById(partnerId);
            
            Map<String, Object> response = new HashMap<>();
            if (profile.isPresent()) {
                response.put("profile", profile.get());
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Partner not found");
                response.put("success", false);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/profile/user/{userId}")
    public ResponseEntity<?> getDeliveryPartnerProfileByUserId(@PathVariable Long userId) {
        try {
            Optional<DeliveryPartnerDTO> deliveryPartner = deliveryPartnerDAO.findByUserId(userId);
            
            if (deliveryPartner.isPresent()) {
                DeliveryPartnerDTO partner = deliveryPartner.get();
                // Return response compatible with frontend
                Map<String, Object> response = new HashMap<>();
                response.put("partnerId", partner.getUserId());
                response.put("partnerName", partner.getPartnerName());
                response.put("email", partner.getEmail());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching delivery partner profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile/{partnerId}/name")
    public ResponseEntity<Map<String, Object>> updatePartnerName(@PathVariable Long partnerId, @RequestBody Map<String, String> request) {
        try {
            String newName = request.get("partnerName");
            if (newName == null || newName.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Partner name is required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }

            boolean updated = deliveryPartnerService.updatePartnerName(partnerId, newName.trim());
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Partner name updated successfully");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to update partner name");
                response.put("success", false);
                return ResponseEntity.internalServerError().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("/profile/{partnerId}/password")
    public ResponseEntity<Map<String, Object>> changePassword(@PathVariable Long partnerId, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("newPassword");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "New password is required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }

            boolean updated = deliveryPartnerService.changePassword(partnerId, newPassword);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Password updated successfully");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to update password");
                response.put("success", false);
                return ResponseEntity.internalServerError().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // ===== DELIVERY REQUEST ENDPOINTS =====
    
    @GetMapping("/requests/pending")
    public ResponseEntity<Map<String, Object>> getPendingDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> pendingRequests = deliveryRequestService.getAllPendingDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", pendingRequests);
            response.put("success", true);
            response.put("count", pendingRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch pending delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/requests/pending/artworks")
    public ResponseEntity<Map<String, Object>> getPendingArtworkDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> pendingRequests = deliveryRequestService.getPendingArtworkOrderDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", pendingRequests);
            response.put("success", true);
            response.put("count", pendingRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch pending artwork delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/requests/pending/commissions")
    public ResponseEntity<Map<String, Object>> getPendingCommissionDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> pendingRequests = deliveryRequestService.getPendingCommissionDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", pendingRequests);
            response.put("success", true);
            response.put("count", pendingRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch pending commission delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PutMapping("/requests/{requestId}/accept")
    public ResponseEntity<Map<String, Object>> acceptDeliveryRequest(@PathVariable Long requestId, @RequestBody Map<String, String> request) {
        try {
            String requestType = request.get("requestType");
            if (requestType == null || (!requestType.equals("artwork_order") && !requestType.equals("commission_request"))) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Invalid request type. Must be 'artwork_order' or 'commission_request'");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = deliveryRequestService.acceptDeliveryRequest(requestId, requestType);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Delivery request accepted successfully");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to accept delivery request");
                response.put("success", false);
                return ResponseEntity.internalServerError().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PutMapping("/requests/{requestId}/status")
    public ResponseEntity<Map<String, Object>> updateDeliveryStatus(@PathVariable Long requestId, @RequestBody Map<String, String> request) {
        try {
            String requestType = request.get("requestType");
            String newStatus = request.get("status");
            
            if (requestType == null || (!requestType.equals("artwork_order") && !requestType.equals("commission_request"))) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Invalid request type. Must be 'artwork_order' or 'commission_request'");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            if (newStatus == null || newStatus.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Status is required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = deliveryRequestService.updateDeliveryStatus(requestId, requestType, newStatus);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Delivery status updated successfully");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to update delivery status");
                response.put("success", false);
                return ResponseEntity.internalServerError().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/requests/{requestId}")
    public ResponseEntity<Map<String, Object>> getDeliveryRequestById(@PathVariable Long requestId, @RequestParam String requestType) {
        try {
            if (requestType == null || (!requestType.equals("artwork_order") && !requestType.equals("commission_request"))) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Invalid request type. Must be 'artwork_order' or 'commission_request'");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            Optional<DeliveryRequestDTO> deliveryRequest = deliveryRequestService.getDeliveryRequestById(requestId, requestType);
            
            Map<String, Object> response = new HashMap<>();
            if (deliveryRequest.isPresent()) {
                response.put("request", deliveryRequest.get());
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Delivery request not found");
                response.put("success", false);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
}