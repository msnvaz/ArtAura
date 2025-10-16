package com.artaura.artaura.dao;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface DeliveryStatusDAO {
    
    /**
     * Update delivery status for artwork orders (AW_orders table)
     * @param orderId The order ID
     * @param deliveryStatus New delivery status (pending, accepted, outForDelivery, delivered, N/A)
     * @param shippingFee The shipping fee to update
     * @return true if update was successful, false otherwise
     */
    boolean updateArtworkOrderDeliveryStatus(Long orderId, String deliveryStatus, BigDecimal shippingFee);
    
    /**
     * Update delivery status for commission requests (commission_requests table)
     * @param requestId The commission request ID
     * @param deliveryStatus New delivery status (pending, accepted, outForDelivery, delivered, N/A)
     * @param shippingFee The shipping fee to update
     * @return true if update was successful, false otherwise
     */
    boolean updateCommissionRequestDeliveryStatus(Long requestId, String deliveryStatus, BigDecimal shippingFee);
    
    /**
     * Get all pending artwork orders for delivery
     * @return List of maps containing order details with pending delivery status
     */
    List<Map<String, Object>> getPendingArtworkOrders();
    
    /**
     * Get all pending commission requests for delivery
     * @return List of maps containing commission request details with pending delivery status
     */
    List<Map<String, Object>> getPendingCommissionRequests();
    
    /**
     * Get delivery status and shipping fee for artwork order
     * @param orderId The order ID
     * @return Map containing delivery status and shipping fee
     */
    Map<String, Object> getArtworkOrderDeliveryInfo(Long orderId);
    
    /**
     * Get delivery status and shipping fee for commission request
     * @param requestId The commission request ID
     * @return Map containing delivery status and shipping fee
     */
    Map<String, Object> getCommissionRequestDeliveryInfo(Long requestId);
    
    /**
     * Update delivery status from pending to accepted for artwork orders
     * @param orderId The order ID
     * @param shippingFee The shipping fee to set
     * @param deliveryPartnerId The delivery partner ID accepting the order
     * @return true if update was successful, false otherwise
     */
    boolean acceptArtworkOrderDelivery(Long orderId, BigDecimal shippingFee, Long deliveryPartnerId);
    
    /**
     * Update delivery status from pending to accepted for commission requests
     * @param requestId The commission request ID
     * @param shippingFee The shipping fee to set
     * @param deliveryPartnerId The delivery partner ID accepting the request
     * @return true if update was successful, false otherwise
     */
    boolean acceptCommissionRequestDelivery(Long requestId, BigDecimal shippingFee, Long deliveryPartnerId);
}