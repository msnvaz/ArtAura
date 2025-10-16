package com.artaura.artaura.controller;

import com.artaura.artaura.service.DeliveryPartnerService;
import com.artaura.artaura.service.DeliveryRequestService;
import com.artaura.artaura.service.DeliveryStatusService;
import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.dto.auth.DeliveryPartnerDTO;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import com.artaura.artaura.dto.delivery.DeliveryStatusUpdateDTO;
import com.artaura.artaura.dto.delivery.ArtistPickupAddressDTO;
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
    private DeliveryStatusService deliveryStatusService;

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
    
    // ===== ARTIST PICKUP ADDRESS ENDPOINTS =====
    
    @GetMapping("/pickup-addresses")
    public ResponseEntity<Map<String, Object>> getAllPickupAddresses() {
        try {
            List<ArtistPickupAddressDTO> pickupAddresses = deliveryRequestService.getAllArtistPickupAddresses();
            
            Map<String, Object> response = new HashMap<>();
            response.put("addresses", pickupAddresses);
            response.put("success", true);
            response.put("count", pickupAddresses.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch pickup addresses: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/pickup-addresses/artworks")
    public ResponseEntity<Map<String, Object>> getArtworkPickupAddresses() {
        try {
            List<ArtistPickupAddressDTO> pickupAddresses = deliveryRequestService.getArtworkOrderPickupAddresses();
            
            Map<String, Object> response = new HashMap<>();
            response.put("addresses", pickupAddresses);
            response.put("success", true);
            response.put("count", pickupAddresses.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch artwork pickup addresses: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/pickup-addresses/commissions")
    public ResponseEntity<Map<String, Object>> getCommissionPickupAddresses() {
        try {
            List<ArtistPickupAddressDTO> pickupAddresses = deliveryRequestService.getCommissionPickupAddresses();
            
            Map<String, Object> response = new HashMap<>();
            response.put("addresses", pickupAddresses);
            response.put("success", true);
            response.put("count", pickupAddresses.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch commission pickup addresses: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // ===== NEW DELIVERY STATUS ENDPOINTS =====
    
    @PostMapping("/delivery-status/accept")
    public ResponseEntity<Map<String, Object>> acceptDeliveryWithFee(@RequestBody Map<String, Object> request) {
        try {
            String orderType = (String) request.get("orderType");
            Long orderId = Long.valueOf(request.get("orderId").toString());
            Object shippingFeeObj = request.get("shippingFee");
            Long deliveryPartnerId = Long.valueOf(request.get("deliveryPartnerId").toString());
            
            if (orderType == null || (!orderType.equals("artwork") && !orderType.equals("commission"))) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Invalid order type. Must be 'artwork' or 'commission'");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            if (orderId == null || deliveryPartnerId == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Order ID and Delivery Partner ID are required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            java.math.BigDecimal shippingFee = null;
            if (shippingFeeObj != null) {
                if (shippingFeeObj instanceof Number) {
                    shippingFee = new java.math.BigDecimal(shippingFeeObj.toString());
                } else if (shippingFeeObj instanceof String) {
                    try {
                        shippingFee = new java.math.BigDecimal((String) shippingFeeObj);
                    } catch (NumberFormatException e) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("error", "Invalid shipping fee format");
                        response.put("success", false);
                        return ResponseEntity.badRequest().body(response);
                    }
                }
            }
            
            boolean updated = deliveryStatusService.acceptDeliveryRequest(orderType, orderId, shippingFee, deliveryPartnerId);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Delivery request accepted successfully with shipping fee");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to accept delivery request or update shipping fee");
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
    
    @GetMapping("/delivery-status/pending")
    public ResponseEntity<Map<String, Object>> getAllPendingDeliveries() {
        try {
            Map<String, Object> pendingDeliveries = deliveryStatusService.getAllPendingDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", pendingDeliveries);
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch pending deliveries: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PutMapping("/delivery-status/update")
    public ResponseEntity<Map<String, Object>> updateDeliveryStatusWithFee(@RequestBody DeliveryStatusUpdateDTO updateDTO) {
        try {
            boolean updated = deliveryStatusService.updateDeliveryStatus(updateDTO);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Delivery status and shipping fee updated successfully");
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
    
    @PutMapping("/delivery-status/{orderType}/{orderId}/out-for-delivery")
    public ResponseEntity<Map<String, Object>> markAsOutForDelivery(@PathVariable String orderType, @PathVariable Long orderId) {
        try {
            boolean updated = deliveryStatusService.markAsOutForDelivery(orderType, orderId);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Order marked as out for delivery");
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
    
    @PutMapping("/delivery-status/{orderType}/{orderId}/delivered")
    public ResponseEntity<Map<String, Object>> markAsDelivered(@PathVariable String orderType, @PathVariable Long orderId) {
        try {
            boolean updated = deliveryStatusService.markAsDelivered(orderType, orderId);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Order marked as delivered");
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
    
    @GetMapping("/delivery-status/{orderType}/{orderId}")
    public ResponseEntity<Map<String, Object>> getDeliveryInfo(@PathVariable String orderType, @PathVariable Long orderId) {
        try {
            Map<String, Object> deliveryInfo = deliveryStatusService.getDeliveryInfo(orderType, orderId);
            
            Map<String, Object> response = new HashMap<>();
            if (!deliveryInfo.isEmpty()) {
                response.put("data", deliveryInfo);
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Delivery information not found");
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
    
    // ===============================
    // ACTIVE DELIVERY REQUESTS ENDPOINTS
    // ===============================
    
    /**
     * Get all active delivery requests (accepted or outForDelivery status)
     */
    @GetMapping("/requests/active")
    public ResponseEntity<Map<String, Object>> getActiveDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> activeRequests = deliveryRequestService.getAllActiveDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", activeRequests);
            response.put("success", true);
            response.put("count", activeRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch active delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get active artwork order delivery requests only
     */
    @GetMapping("/requests/active/artworks")
    public ResponseEntity<Map<String, Object>> getActiveArtworkDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> activeRequests = deliveryRequestService.getActiveArtworkOrderDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", activeRequests);
            response.put("success", true);
            response.put("count", activeRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch active artwork delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get active commission delivery requests only
     */
    @GetMapping("/requests/active/commissions")
    public ResponseEntity<Map<String, Object>> getActiveCommissionDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> activeRequests = deliveryRequestService.getActiveCommissionDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", activeRequests);
            response.put("success", true);
            response.put("count", activeRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch active commission delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // ===============================
    // DELIVERED DELIVERY REQUESTS ENDPOINTS
    // ===============================
    
    /**
     * Get all delivered delivery requests (delivered status)
     */
    @GetMapping("/requests/delivered")
    public ResponseEntity<Map<String, Object>> getDeliveredDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> deliveredRequests = deliveryRequestService.getAllDeliveredDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", deliveredRequests);
            response.put("success", true);
            response.put("count", deliveredRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch delivered delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get delivered artwork order delivery requests only
     */
    @GetMapping("/requests/delivered/artworks")
    public ResponseEntity<Map<String, Object>> getDeliveredArtworkDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> deliveredRequests = deliveryRequestService.getDeliveredArtworkOrderDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", deliveredRequests);
            response.put("success", true);
            response.put("count", deliveredRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch delivered artwork delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get delivered commission delivery requests only
     */
    @GetMapping("/requests/delivered/commissions")
    public ResponseEntity<Map<String, Object>> getDeliveredCommissionDeliveryRequests() {
        try {
            List<DeliveryRequestDTO> deliveredRequests = deliveryRequestService.getDeliveredCommissionDeliveryRequests();
            
            Map<String, Object> response = new HashMap<>();
            response.put("requests", deliveredRequests);
            response.put("success", true);
            response.put("count", deliveredRequests.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch delivered commission delivery requests: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
}