package com.artaura.artaura.service;

import com.artaura.artaura.dao.DeliveryRequestDAO;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import com.artaura.artaura.dto.delivery.ArtistPickupAddressDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryRequestService {

    @Autowired
    private DeliveryRequestDAO deliveryRequestDAO;

    /**
     * Get all pending delivery requests from both tables
     * @return List of pending delivery requests
     */
    public List<DeliveryRequestDTO> getAllPendingDeliveryRequests() {
        try {
            return deliveryRequestDAO.getAllPendingDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching all pending requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch pending delivery requests", e);
        }
    }

    /**
     * Get pending delivery requests from AW_orders table only
     * @return List of pending artwork order delivery requests
     */
    public List<DeliveryRequestDTO> getPendingArtworkOrderDeliveryRequests() {
        try {
            return deliveryRequestDAO.getPendingArtworkOrderDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching pending artwork orders: " + e.getMessage());
            throw new RuntimeException("Failed to fetch pending artwork order delivery requests", e);
        }
    }

    /**
     * Get pending delivery requests from commission_requests table only
     * @return List of pending commission delivery requests
     */
    public List<DeliveryRequestDTO> getPendingCommissionDeliveryRequests() {
        try {
            return deliveryRequestDAO.getPendingCommissionDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching pending commissions: " + e.getMessage());
            throw new RuntimeException("Failed to fetch pending commission delivery requests", e);
        }
    }

    /**
     * Accept a delivery request by updating its status to 'accepted'
     * @param id the request ID
     * @param requestType either "artwork_order" or "commission_request"
     * @return true if update was successful
     */
    public boolean acceptDeliveryRequest(Long id, String requestType) {
        try {
            if ("artwork_order".equals(requestType)) {
                return deliveryRequestDAO.updateArtworkOrderDeliveryStatus(id, "accepted");
            } else if ("commission_request".equals(requestType)) {
                return deliveryRequestDAO.updateCommissionDeliveryStatus(id, "accepted");
            }
            return false;
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error accepting delivery request: " + e.getMessage());
            throw new RuntimeException("Failed to accept delivery request", e);
        }
    }

    /**
     * Update delivery status to 'outForDelivery'
     * @param id the request ID
     * @param requestType either "artwork_order" or "commission_request"
     * @return true if update was successful
     */
    public boolean markAsOutForDelivery(Long id, String requestType) {
        try {
            if ("artwork_order".equals(requestType)) {
                return deliveryRequestDAO.updateArtworkOrderDeliveryStatus(id, "outForDelivery");
            } else if ("commission_request".equals(requestType)) {
                return deliveryRequestDAO.updateCommissionDeliveryStatus(id, "outForDelivery");
            }
            return false;
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error marking as out for delivery: " + e.getMessage());
            throw new RuntimeException("Failed to mark as out for delivery", e);
        }
    }

    /**
     * Update delivery status to 'delivered'
     * @param id the request ID
     * @param requestType either "artwork_order" or "commission_request"
     * @return true if update was successful
     */
    public boolean markAsDelivered(Long id, String requestType) {
        try {
            if ("artwork_order".equals(requestType)) {
                return deliveryRequestDAO.updateArtworkOrderDeliveryStatus(id, "delivered");
            } else if ("commission_request".equals(requestType)) {
                return deliveryRequestDAO.updateCommissionDeliveryStatus(id, "delivered");
            }
            return false;
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error marking as delivered: " + e.getMessage());
            throw new RuntimeException("Failed to mark as delivered", e);
        }
    }

    /**
     * Get delivery request by ID and type
     * @param id the request ID
     * @param requestType either "artwork_order" or "commission_request"
     * @return Optional delivery request
     */
    public Optional<DeliveryRequestDTO> getDeliveryRequestById(Long id, String requestType) {
        try {
            return deliveryRequestDAO.getDeliveryRequestById(id, requestType);
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching delivery request by ID: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery request", e);
        }
    }

    /**
     * Update delivery status with custom status
     * @param id the request ID
     * @param requestType either "artwork_order" or "commission_request"
     * @param newStatus the new delivery status
     * @return true if update was successful
     */
    public boolean updateDeliveryStatus(Long id, String requestType, String newStatus) {
        try {
            if ("artwork_order".equals(requestType)) {
                return deliveryRequestDAO.updateArtworkOrderDeliveryStatus(id, newStatus);
            } else if ("commission_request".equals(requestType)) {
                return deliveryRequestDAO.updateCommissionDeliveryStatus(id, newStatus);
            }
            return false;
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error updating delivery status: " + e.getMessage());
            throw new RuntimeException("Failed to update delivery status", e);
        }
    }

    /**
     * Get all artist pickup addresses for pending delivery requests
     * @return List of artist pickup addresses
     */
    public List<ArtistPickupAddressDTO> getAllArtistPickupAddresses() {
        try {
            return deliveryRequestDAO.getAllArtistPickupAddresses();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching all pickup addresses: " + e.getMessage());
            throw new RuntimeException("Failed to fetch pickup addresses", e);
        }
    }

    /**
     * Get artist pickup addresses for pending artwork orders only
     * @return List of artist pickup addresses for artwork orders
     */
    public List<ArtistPickupAddressDTO> getArtworkOrderPickupAddresses() {
        try {
            return deliveryRequestDAO.getArtworkOrderPickupAddresses();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching artwork order pickup addresses: " + e.getMessage());
            throw new RuntimeException("Failed to fetch artwork order pickup addresses", e);
        }
    }

    /**
     * Get artist pickup addresses for pending commission requests only
     * @return List of artist pickup addresses for commission requests
     */
    public List<ArtistPickupAddressDTO> getCommissionPickupAddresses() {
        try {
            return deliveryRequestDAO.getCommissionPickupAddresses();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching commission pickup addresses: " + e.getMessage());
            throw new RuntimeException("Failed to fetch commission pickup addresses", e);
        }
    }
    
    /**
     * Get all active delivery requests from both tables
     * Active requests have delivery_status 'accepted' or 'outForDelivery'
     * @return List of active delivery requests
     */
    public List<DeliveryRequestDTO> getAllActiveDeliveryRequests() {
        try {
            return deliveryRequestDAO.getAllActiveDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching all active requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch active delivery requests", e);
        }
    }

    /**
     * Get active delivery requests from AW_orders table only
     * Active requests have delivery_status 'accepted' or 'outForDelivery'
     * @return List of active artwork order delivery requests
     */
    public List<DeliveryRequestDTO> getActiveArtworkOrderDeliveryRequests() {
        try {
            return deliveryRequestDAO.getActiveArtworkOrderDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching active artwork orders: " + e.getMessage());
            throw new RuntimeException("Failed to fetch active artwork order delivery requests", e);
        }
    }

    /**
     * Get active delivery requests from commission_requests table only
     * Active requests have delivery_status 'accepted' or 'outForDelivery'
     * @return List of active commission delivery requests
     */
    public List<DeliveryRequestDTO> getActiveCommissionDeliveryRequests() {
        try {
            return deliveryRequestDAO.getActiveCommissionDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching active commission requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch active commission delivery requests", e);
        }
    }
    
    /**
     * Get all delivered delivery requests from both tables
     * Delivered requests have delivery_status 'delivered'
     * @return List of delivered delivery requests
     */
    public List<DeliveryRequestDTO> getAllDeliveredDeliveryRequests() {
        try {
            return deliveryRequestDAO.getAllDeliveredDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching all delivered requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivered delivery requests", e);
        }
    }

    /**
     * Get delivered delivery requests from AW_orders table only
     * Delivered requests have delivery_status 'delivered'
     * @return List of delivered artwork order delivery requests
     */
    public List<DeliveryRequestDTO> getDeliveredArtworkOrderDeliveryRequests() {
        try {
            return deliveryRequestDAO.getDeliveredArtworkOrderDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching delivered artwork orders: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivered artwork order delivery requests", e);
        }
    }

    /**
     * Get delivered delivery requests from commission_requests table only
     * Delivered requests have delivery_status 'delivered'
     * @return List of delivered commission delivery requests
     */
    public List<DeliveryRequestDTO> getDeliveredCommissionDeliveryRequests() {
        try {
            return deliveryRequestDAO.getDeliveredCommissionDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching delivered commission requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivered commission delivery requests", e);
        }
    }
    
    /**
     * Get platform fee percentage from admin_settings table
     * @return Platform fee percentage as String
     */
    public String getPlatformFee() {
        try {
            return deliveryRequestDAO.getPlatformFee();
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching platform fee: " + e.getMessage());
            return "0";
        }
    }
    
    /**
     * Get payment amount from payment table based on order type and order ID
     * @param orderType either "artwork" or "commission"
     * @param orderId the order ID
     * @return Payment amount as BigDecimal
     */
    public java.math.BigDecimal getPaymentAmount(String orderType, Long orderId) {
        try {
            return deliveryRequestDAO.getPaymentAmount(orderType, orderId);
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error fetching payment amount: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Insert platform fee commission into platform_fees table
     * @param orderType either "artwork" or "commission"
     * @param orderId the order ID
     * @param platformCommissionFee the calculated platform commission fee
     * @return true if insertion was successful
     */
    public boolean insertPlatformFee(String orderType, Long orderId, java.math.BigDecimal platformCommissionFee) {
        try {
            return deliveryRequestDAO.insertPlatformFee(orderType, orderId, platformCommissionFee);
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestService: Error inserting platform fee: " + e.getMessage());
            return false;
        }
    }
}