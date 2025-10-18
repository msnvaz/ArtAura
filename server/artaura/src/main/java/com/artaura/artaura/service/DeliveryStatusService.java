package com.artaura.artaura.service;

import com.artaura.artaura.dao.DeliveryStatusDAO;
import com.artaura.artaura.dao.DeliveryRequestDAO;
import com.artaura.artaura.dto.delivery.DeliveryStatusUpdateDTO;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DeliveryStatusService {

    @Autowired
    private DeliveryStatusDAO deliveryStatusDAO;

    @Autowired
    private DeliveryRequestDAO deliveryRequestDAO;

    /**
     * Update delivery status for both artwork orders and commission requests
     */
    public boolean updateDeliveryStatus(DeliveryStatusUpdateDTO updateDTO) {
        if ("artwork".equalsIgnoreCase(updateDTO.getOrderType())) {
            return deliveryStatusDAO.updateArtworkOrderDeliveryStatus(
                updateDTO.getOrderId(), 
                updateDTO.getDeliveryStatus(), 
                updateDTO.getShippingFee()
            );
        } else if ("commission".equalsIgnoreCase(updateDTO.getOrderType())) {
            return deliveryStatusDAO.updateCommissionRequestDeliveryStatus(
                updateDTO.getOrderId(), 
                updateDTO.getDeliveryStatus(), 
                updateDTO.getShippingFee()
            );
        }
        return false;
    }

    /**
     * Accept a delivery request by changing status from pending to accepted
     */
    public boolean acceptDeliveryRequest(String orderType, Long orderId, BigDecimal shippingFee, Long deliveryPartnerId) {
        System.out.println("DeliveryStatusService.acceptDeliveryRequest called with: orderType=" + orderType + 
                          ", orderId=" + orderId + ", shippingFee=" + shippingFee + ", deliveryPartnerId=" + deliveryPartnerId);
        
        boolean result = false;
        if ("artwork".equalsIgnoreCase(orderType)) {
            System.out.println("Processing artwork order...");
            result = deliveryStatusDAO.acceptArtworkOrderDelivery(orderId, shippingFee, deliveryPartnerId);
        } else if ("commission".equalsIgnoreCase(orderType)) {
            System.out.println("Processing commission request...");
            result = deliveryStatusDAO.acceptCommissionRequestDelivery(orderId, shippingFee, deliveryPartnerId);
        } else {
            System.err.println("Invalid order type: " + orderType);
        }
        
        System.out.println("DeliveryStatusService.acceptDeliveryRequest result: " + result);
        return result;
    }

    /**
     * Get all pending delivery requests (both artwork orders and commission requests)
     */
    public Map<String, Object> getAllPendingDeliveryRequests() {
        List<Map<String, Object>> pendingArtworkOrders = deliveryStatusDAO.getPendingArtworkOrders();
        List<Map<String, Object>> pendingCommissionRequests = deliveryStatusDAO.getPendingCommissionRequests();

        return Map.of(
            "artworkOrders", pendingArtworkOrders,
            "commissionRequests", pendingCommissionRequests,
            "totalPending", pendingArtworkOrders.size() + pendingCommissionRequests.size()
        );
    }

    /**
     * Get delivery information for a specific order
     */
    public Map<String, Object> getDeliveryInfo(String orderType, Long orderId) {
        if ("artwork".equalsIgnoreCase(orderType)) {
            return deliveryStatusDAO.getArtworkOrderDeliveryInfo(orderId);
        } else if ("commission".equalsIgnoreCase(orderType)) {
            return deliveryStatusDAO.getCommissionRequestDeliveryInfo(orderId);
        }
        return Map.of();
    }

    /**
     * Update delivery status to "outForDelivery"
     */
    public boolean markAsOutForDelivery(String orderType, Long orderId) {
        if ("artwork".equalsIgnoreCase(orderType)) {
            return deliveryStatusDAO.updateArtworkOrderDeliveryStatus(orderId, "outForDelivery", null);
        } else if ("commission".equalsIgnoreCase(orderType)) {
            return deliveryStatusDAO.updateCommissionRequestDeliveryStatus(orderId, "outForDelivery", null);
        }
        return false;
    }

    /**
     * Update delivery status to "delivered"
     */
    public boolean markAsDelivered(String orderType, Long orderId) {
        // Get platform fee from admin_settings
        String platformFee = deliveryRequestDAO.getPlatformFee();
        System.out.println("💰 Platform Fee Retrieved: " + platformFee + "% for Order Type: " + orderType + ", Order ID: " + orderId);
        
        // Get payment amount from payment table
        java.math.BigDecimal paymentAmount = deliveryRequestDAO.getPaymentAmount(orderType, orderId);
        if (paymentAmount != null) {
            System.out.println("💵 Payment Amount Retrieved: Rs " + paymentAmount + " for Order Type: " + orderType + ", Order ID: " + orderId);
        } else {
            System.out.println("⚠️ No payment found for Order Type: " + orderType + ", Order ID: " + orderId);
        }
        
        if ("artwork".equalsIgnoreCase(orderType)) {
            return deliveryStatusDAO.updateArtworkOrderDeliveryStatus(orderId, "delivered", null);
        } else if ("commission".equalsIgnoreCase(orderType)) {
            return deliveryStatusDAO.updateCommissionRequestDeliveryStatus(orderId, "delivered", null);
        }
        return false;
    }

    /**
     * Comprehensive update function that handles all delivery status transitions
     * and integrates with both DeliveryStatusDAO and DeliveryRequestDAO
     */
    public Map<String, Object> updateDeliveryStatusComprehensive(DeliveryStatusUpdateDTO updateDTO) {
        System.out.println("🔄 DeliveryStatusService.updateDeliveryStatusComprehensive called with: " + updateDTO.toString());
        
        try {
            // Validate input
            if (updateDTO.getOrderId() == null || updateDTO.getOrderType() == null || updateDTO.getDeliveryStatus() == null) {
                return Map.of(
                    "success", false,
                    "error", "Missing required fields: orderId, orderType, or deliveryStatus",
                    "details", "Validation failed"
                );
            }

            // Normalize order type
            String normalizedOrderType = updateDTO.getOrderType().toLowerCase();
            if (!"artwork".equals(normalizedOrderType) && !"commission".equals(normalizedOrderType)) {
                return Map.of(
                    "success", false,
                    "error", "Invalid order type. Must be 'artwork' or 'commission'",
                    "details", "Order type validation failed"
                );
            }

            // Validate delivery status
            String status = updateDTO.getDeliveryStatus().toLowerCase();
            if (!isValidDeliveryStatus(status)) {
                return Map.of(
                    "success", false,
                    "error", "Invalid delivery status. Must be one of: pending, accepted, outForDelivery, delivered, N/A",
                    "details", "Status validation failed"
                );
            }

            // Get current delivery information before update
            Map<String, Object> currentInfo = getDeliveryInfo(normalizedOrderType, updateDTO.getOrderId());
            if (currentInfo.isEmpty()) {
                return Map.of(
                    "success", false,
                    "error", "Order/Request not found",
                    "details", "No delivery information found for the specified order"
                );
            }

            String currentStatus = (String) currentInfo.get("delivery_status");
            System.out.println("📊 Current status: " + currentStatus + " -> New status: " + status);

            // Validate status transition
            if (!isValidStatusTransition(currentStatus, status)) {
                return Map.of(
                    "success", false,
                    "error", "Invalid status transition from " + currentStatus + " to " + status,
                    "details", "Status transition validation failed"
                );
            }

            // Perform the update using DeliveryStatusDAO
            boolean updateSuccess = false;
            if ("artwork".equals(normalizedOrderType)) {
                updateSuccess = deliveryStatusDAO.updateArtworkOrderDeliveryStatus(
                    updateDTO.getOrderId(), 
                    updateDTO.getDeliveryStatus(), 
                    updateDTO.getShippingFee()
                );
            } else if ("commission".equals(normalizedOrderType)) {
                updateSuccess = deliveryStatusDAO.updateCommissionRequestDeliveryStatus(
                    updateDTO.getOrderId(), 
                    updateDTO.getDeliveryStatus(), 
                    updateDTO.getShippingFee()
                );
            }

            if (!updateSuccess) {
                return Map.of(
                    "success", false,
                    "error", "Database update failed",
                    "details", "Unable to update delivery status in database"
                );
            }

            // Also update using DeliveryRequestDAO for consistency
            if ("artwork".equals(normalizedOrderType)) {
                deliveryRequestDAO.updateArtworkOrderDeliveryStatus(updateDTO.getOrderId(), updateDTO.getDeliveryStatus());
            } else {
                deliveryRequestDAO.updateCommissionDeliveryStatus(updateDTO.getOrderId(), updateDTO.getDeliveryStatus());
            }

            // Get updated delivery information
            Map<String, Object> updatedInfo = getDeliveryInfo(normalizedOrderType, updateDTO.getOrderId());
            
            // Get delivery request details if available
            Optional<DeliveryRequestDTO> requestDetails = deliveryRequestDAO.getDeliveryRequestById(
                updateDTO.getOrderId(), 
                normalizedOrderType.equals("artwork") ? "artwork_order" : "commission_request"
            );

            System.out.println("✅ Delivery status update successful");
            
            return Map.of(
                "success", true,
                "message", "Delivery status updated successfully",
                "previousStatus", currentStatus,
                "newStatus", updateDTO.getDeliveryStatus(),
                "orderId", updateDTO.getOrderId(),
                "orderType", normalizedOrderType,
                "shippingFee", updateDTO.getShippingFee() != null ? updateDTO.getShippingFee() : currentInfo.get("shipping_fee"),
                "deliveryInfo", updatedInfo,
                "requestDetails", requestDetails.orElse(null),
                "timestamp", System.currentTimeMillis()
            );

        } catch (Exception e) {
            System.err.println("❌ Error in updateDeliveryStatusComprehensive: " + e.getMessage());
            e.printStackTrace();
            return Map.of(
                "success", false,
                "error", "Internal server error: " + e.getMessage(),
                "details", "Exception occurred during update process"
            );
        }
    }

    /**
     * Bulk update function for multiple delivery status updates
     */
    public Map<String, Object> bulkUpdateDeliveryStatus(List<DeliveryStatusUpdateDTO> updates) {
        System.out.println("🔄 DeliveryStatusService.bulkUpdateDeliveryStatus called with " + updates.size() + " updates");
        
        int successCount = 0;
        int failureCount = 0;
        java.util.List<Map<String, Object>> detailsList = new java.util.ArrayList<>();
        
        for (DeliveryStatusUpdateDTO update : updates) {
            Map<String, Object> result = updateDeliveryStatusComprehensive(update);
            if ((Boolean) result.get("success")) {
                successCount++;
            } else {
                failureCount++;
            }
            detailsList.add(result);
        }
        
        return Map.of(
            "success", failureCount == 0,
            "totalUpdates", updates.size(),
            "successfulUpdates", successCount,
            "failedUpdates", failureCount,
            "details", detailsList,
            "message", String.format("Bulk update completed: %d successful, %d failed", successCount, failureCount)
        );
    }

    /**
     * Accept delivery request with enhanced validation and logging
     */
    public Map<String, Object> acceptDeliveryRequestEnhanced(String orderType, Long orderId, 
                                                            BigDecimal shippingFee, Long deliveryPartnerId) {
        System.out.println("🎯 DeliveryStatusService.acceptDeliveryRequestEnhanced called");
        
        // Create DTO for comprehensive update
        DeliveryStatusUpdateDTO updateDTO = new DeliveryStatusUpdateDTO(
            orderId, orderType, "accepted", shippingFee, deliveryPartnerId
        );
        
        // Use the comprehensive update function
        Map<String, Object> result = updateDeliveryStatusComprehensive(updateDTO);
        
        // Add specific acceptance details
        if ((Boolean) result.get("success")) {
            Map<String, Object> enhancedResult = new java.util.HashMap<>(result);
            enhancedResult.put("acceptanceDetails", Map.of(
                "deliveryPartnerId", deliveryPartnerId,
                "acceptedAt", System.currentTimeMillis(),
                "shippingFeeSet", shippingFee != null
            ));
            return enhancedResult;
        }
        
        return result;
    }

    /**
     * Validate if the delivery status is valid
     */
    private boolean isValidDeliveryStatus(String status) {
        return status != null && List.of("pending", "accepted", "outfordelivery", "delivered", "n/a")
                .contains(status.toLowerCase());
    }

    /**
     * Validate if the status transition is allowed
     */
    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        if (currentStatus == null || newStatus == null) return false;
        
        String current = currentStatus.toLowerCase();
        String next = newStatus.toLowerCase();
        
        // Define valid transitions
        return switch (current) {
            case "pending" -> List.of("accepted", "n/a").contains(next);
            case "accepted" -> List.of("outfordelivery", "n/a").contains(next);
            case "outfordelivery" -> List.of("delivered", "n/a").contains(next);
            case "delivered" -> List.of("n/a").contains(next); // Only allow cancellation after delivery
            case "n/a" -> List.of("pending").contains(next); // Allow reactivation
            default -> false;
        };
    }

    /**
     * Get delivery status history and analytics
     */
    public Map<String, Object> getDeliveryStatusAnalytics(String orderType, Long orderId) {
        try {
            Map<String, Object> deliveryInfo = getDeliveryInfo(orderType, orderId);
            Optional<DeliveryRequestDTO> requestDetails = deliveryRequestDAO.getDeliveryRequestById(
                orderId, 
                orderType.equals("artwork") ? "artwork_order" : "commission_request"
            );
            
            return Map.of(
                "success", true,
                "orderId", orderId,
                "orderType", orderType,
                "currentDeliveryInfo", deliveryInfo,
                "requestDetails", requestDetails.orElse(null),
                "availableTransitions", getAvailableStatusTransitions(
                    (String) deliveryInfo.getOrDefault("delivery_status", "pending")
                ),
                "timestamp", System.currentTimeMillis()
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", "Failed to get delivery analytics: " + e.getMessage()
            );
        }
    }

    /**
     * Get available status transitions for current status
     */
    private List<String> getAvailableStatusTransitions(String currentStatus) {
        if (currentStatus == null) return List.of();
        
        return switch (currentStatus.toLowerCase()) {
            case "pending" -> List.of("accepted", "N/A");
            case "accepted" -> List.of("outForDelivery", "N/A");
            case "outfordelivery" -> List.of("delivered", "N/A");
            case "delivered" -> List.of("N/A");
            case "n/a" -> List.of("pending");
            default -> List.of();
        };
    }
}