package com.artaura.artaura.controller;

import com.artaura.artaura.service.DeliveryStatusService;
import com.artaura.artaura.dto.delivery.DeliveryStatusUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery-status")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryStatusController {

    @Autowired
    private DeliveryStatusService deliveryStatusService;

    /**
     * Accept a delivery request and set shipping fee
     * Changes status from "pending" to "accepted"
     */
    @PostMapping("/accept")
    public ResponseEntity<Map<String, Object>> acceptDeliveryRequest(@RequestBody Map<String, Object> request) {
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
            
            BigDecimal shippingFee = null;
            if (shippingFeeObj != null) {
                if (shippingFeeObj instanceof Number) {
                    shippingFee = new BigDecimal(shippingFeeObj.toString());
                } else if (shippingFeeObj instanceof String) {
                    try {
                        shippingFee = new BigDecimal((String) shippingFeeObj);
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
                response.put("message", "Delivery request accepted successfully");
                response.put("success", true);
                response.put("orderId", orderId);
                response.put("orderType", orderType);
                response.put("shippingFee", shippingFee);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to accept delivery request. Order may not exist or may not be in pending status");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get all pending delivery requests from both artwork orders and commission requests
     */
    @GetMapping("/pending")
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

    /**
     * Update delivery status and optionally shipping fee
     */
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateDeliveryStatus(@RequestBody DeliveryStatusUpdateDTO updateDTO) {
        try {
            boolean updated = deliveryStatusService.updateDeliveryStatus(updateDTO);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Delivery status updated successfully");
                response.put("success", true);
                response.put("orderId", updateDTO.getOrderId());
                response.put("orderType", updateDTO.getOrderType());
                response.put("newStatus", updateDTO.getDeliveryStatus());
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to update delivery status. Order may not exist");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Mark order as out for delivery
     */
    @PutMapping("/{orderType}/{orderId}/out-for-delivery")
    public ResponseEntity<Map<String, Object>> markAsOutForDelivery(@PathVariable String orderType, @PathVariable Long orderId) {
        try {
            if (!orderType.equals("artwork") && !orderType.equals("commission")) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Invalid order type. Must be 'artwork' or 'commission'");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = deliveryStatusService.markAsOutForDelivery(orderType, orderId);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Order marked as out for delivery");
                response.put("success", true);
                response.put("orderId", orderId);
                response.put("orderType", orderType);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to update delivery status. Order may not exist");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Mark order as delivered
     */
    @PutMapping("/{orderType}/{orderId}/delivered")
    public ResponseEntity<Map<String, Object>> markAsDelivered(@PathVariable String orderType, @PathVariable Long orderId) {
        try {
            if (!orderType.equals("artwork") && !orderType.equals("commission")) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Invalid order type. Must be 'artwork' or 'commission'");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = deliveryStatusService.markAsDelivered(orderType, orderId);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Order marked as delivered");
                response.put("success", true);
                response.put("orderId", orderId);
                response.put("orderType", orderType);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to update delivery status. Order may not exist");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Test endpoint to check database structure and data
     */
    @GetMapping("/test/{orderType}/{orderId}")
    public ResponseEntity<Map<String, Object>> testDatabaseStructure(@PathVariable String orderType, @PathVariable Long orderId) {
        try {
            Map<String, Object> deliveryInfo = deliveryStatusService.getDeliveryInfo(orderType, orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("orderType", orderType);
            response.put("orderId", orderId);
            response.put("deliveryInfo", deliveryInfo);
            response.put("success", true);
            response.put("message", "Database test successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Database test failed: " + e.getMessage());
            response.put("success", false);
            response.put("orderType", orderType);
            response.put("orderId", orderId);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery information for a specific order
     */
    @GetMapping("/{orderType}/{orderId}")
    public ResponseEntity<Map<String, Object>> getDeliveryInfo(@PathVariable String orderType, @PathVariable Long orderId) {
        try {
            if (!orderType.equals("artwork") && !orderType.equals("commission")) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Invalid order type. Must be 'artwork' or 'commission'");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
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

    /**
     * Enhanced comprehensive delivery status update endpoint
     */
    @PutMapping("/update-comprehensive")
    public ResponseEntity<Map<String, Object>> updateDeliveryStatusComprehensive(@RequestBody DeliveryStatusUpdateDTO updateDTO) {
        try {
            System.out.println("🔄 DeliveryStatusController.updateDeliveryStatusComprehensive called with: " + updateDTO.toString());
            
            Map<String, Object> result = deliveryStatusService.updateDeliveryStatusComprehensive(updateDTO);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            System.err.println("❌ Error in updateDeliveryStatusComprehensive: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Bulk update multiple delivery statuses
     */
    @PutMapping("/bulk-update")
    public ResponseEntity<Map<String, Object>> bulkUpdateDeliveryStatus(@RequestBody List<DeliveryStatusUpdateDTO> updates) {
        try {
            System.out.println("🔄 DeliveryStatusController.bulkUpdateDeliveryStatus called with " + updates.size() + " updates");
            
            Map<String, Object> result = deliveryStatusService.bulkUpdateDeliveryStatus(updates);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            System.err.println("❌ Error in bulkUpdateDeliveryStatus: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Enhanced accept delivery request with comprehensive validation
     */
    @PostMapping("/accept-enhanced")
    public ResponseEntity<Map<String, Object>> acceptDeliveryRequestEnhanced(@RequestBody Map<String, Object> request) {
        try {
            String orderType = (String) request.get("orderType");
            Long orderId = Long.valueOf(request.get("orderId").toString());
            Object shippingFeeObj = request.get("shippingFee");
            Long deliveryPartnerId = Long.valueOf(request.get("deliveryPartnerId").toString());
            
            BigDecimal shippingFee = null;
            if (shippingFeeObj != null) {
                if (shippingFeeObj instanceof Number) {
                    shippingFee = new BigDecimal(shippingFeeObj.toString());
                } else if (shippingFeeObj instanceof String) {
                    try {
                        shippingFee = new BigDecimal((String) shippingFeeObj);
                    } catch (NumberFormatException e) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("error", "Invalid shipping fee format");
                        response.put("success", false);
                        return ResponseEntity.badRequest().body(response);
                    }
                }
            }
            
            Map<String, Object> result = deliveryStatusService.acceptDeliveryRequestEnhanced(
                orderType, orderId, shippingFee, deliveryPartnerId
            );
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            System.err.println("❌ Error in acceptDeliveryRequestEnhanced: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get delivery status analytics and available transitions
     */
    @GetMapping("/analytics/{orderType}/{orderId}")
    public ResponseEntity<Map<String, Object>> getDeliveryStatusAnalytics(
            @PathVariable String orderType, 
            @PathVariable Long orderId) {
        try {
            System.out.println("📊 DeliveryStatusController.getDeliveryStatusAnalytics called for: " + orderType + "/" + orderId);
            
            Map<String, Object> result = deliveryStatusService.getDeliveryStatusAnalytics(orderType, orderId);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            System.err.println("❌ Error in getDeliveryStatusAnalytics: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Advanced status update with validation and detailed response
     */
    @PutMapping("/update-advanced/{orderType}/{orderId}")
    public ResponseEntity<Map<String, Object>> updateDeliveryStatusAdvanced(
            @PathVariable String orderType,
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> updateRequest) {
        try {
            String deliveryStatus = (String) updateRequest.get("deliveryStatus");
            Object shippingFeeObj = updateRequest.get("shippingFee");
            Object deliveryPartnerIdObj = updateRequest.get("deliveryPartnerId");
            
            BigDecimal shippingFee = null;
            if (shippingFeeObj != null) {
                if (shippingFeeObj instanceof Number) {
                    shippingFee = new BigDecimal(shippingFeeObj.toString());
                } else if (shippingFeeObj instanceof String && !((String) shippingFeeObj).isEmpty()) {
                    try {
                        shippingFee = new BigDecimal((String) shippingFeeObj);
                    } catch (NumberFormatException e) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("error", "Invalid shipping fee format");
                        response.put("success", false);
                        return ResponseEntity.badRequest().body(response);
                    }
                }
            }
            
            Long deliveryPartnerId = null;
            if (deliveryPartnerIdObj != null) {
                deliveryPartnerId = Long.valueOf(deliveryPartnerIdObj.toString());
            }
            
            DeliveryStatusUpdateDTO updateDTO = new DeliveryStatusUpdateDTO(
                orderId, orderType, deliveryStatus, shippingFee, deliveryPartnerId
            );
            
            Map<String, Object> result = deliveryStatusService.updateDeliveryStatusComprehensive(updateDTO);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            System.err.println("❌ Error in updateDeliveryStatusAdvanced: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}