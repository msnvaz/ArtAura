package com.artaura.artaura.service;

import com.artaura.artaura.dao.DeliveryStatusDAO;
import com.artaura.artaura.dto.delivery.DeliveryStatusUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class DeliveryStatusService {

    @Autowired
    private DeliveryStatusDAO deliveryStatusDAO;

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
        if ("artwork".equalsIgnoreCase(orderType)) {
            return deliveryStatusDAO.updateArtworkOrderDeliveryStatus(orderId, "delivered", null);
        } else if ("commission".equalsIgnoreCase(orderType)) {
            return deliveryStatusDAO.updateCommissionRequestDeliveryStatus(orderId, "delivered", null);
        }
        return false;
    }
}