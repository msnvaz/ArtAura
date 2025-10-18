package com.artaura.artaura.dao;

import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import com.artaura.artaura.dto.delivery.ArtistPickupAddressDTO;
import java.util.List;
import java.util.Optional;

public interface DeliveryRequestDAO {
    /**
     * Get all pending delivery requests from both AW_orders and commission_requests tables
     * @return List of pending delivery requests
     */
    List<DeliveryRequestDTO> getAllPendingDeliveryRequests();
    
    /**
     * Get pending delivery requests from AW_orders table only
     * @return List of pending artwork order delivery requests
     */
    List<DeliveryRequestDTO> getPendingArtworkOrderDeliveryRequests();
    
    /**
     * Get pending delivery requests from commission_requests table only
     * @return List of pending commission delivery requests
     */
    List<DeliveryRequestDTO> getPendingCommissionDeliveryRequests();
    
    /**
     * Update delivery status for an artwork order
     * @param orderId the order ID
     * @param newStatus the new delivery status
     * @return true if update was successful
     */
    boolean updateArtworkOrderDeliveryStatus(Long orderId, String newStatus);
    
    /**
     * Update delivery status for a commission request
     * @param commissionId the commission request ID
     * @param newStatus the new delivery status
     * @return true if update was successful
     */
    boolean updateCommissionDeliveryStatus(Long commissionId, String newStatus);
    
    /**
     * Get delivery request by ID and type
     * @param id the request ID
     * @param requestType either "artwork_order" or "commission_request"
     * @return Optional delivery request
     */
    Optional<DeliveryRequestDTO> getDeliveryRequestById(Long id, String requestType);
    
    /**
     * Get all artist pickup addresses for pending delivery requests
     * @return List of artist pickup addresses
     */
    List<ArtistPickupAddressDTO> getAllArtistPickupAddresses();
    
    /**
     * Get artist pickup addresses for pending artwork orders only
     * @return List of artist pickup addresses for artwork orders
     */
    List<ArtistPickupAddressDTO> getArtworkOrderPickupAddresses();
    
    /**
     * Get artist pickup addresses for pending commission requests only
     * @return List of artist pickup addresses for commission requests
     */
    List<ArtistPickupAddressDTO> getCommissionPickupAddresses();
    
    /**
     * Get all active delivery requests from both AW_orders and commission_requests tables
     * Active requests have delivery_status 'accepted' or 'outForDelivery'
     * @return List of active delivery requests
     */
    List<DeliveryRequestDTO> getAllActiveDeliveryRequests();
    
    /**
     * Get active delivery requests from AW_orders table only
     * Active requests have delivery_status 'accepted' or 'outForDelivery'
     * @return List of active artwork order delivery requests
     */
    List<DeliveryRequestDTO> getActiveArtworkOrderDeliveryRequests();
    
    /**
     * Get active delivery requests from commission_requests table only
     * Active requests have delivery_status 'accepted' or 'outForDelivery'
     * @return List of active commission delivery requests
     */
    List<DeliveryRequestDTO> getActiveCommissionDeliveryRequests();
    
    /**
     * Get all delivered delivery requests from both AW_orders and commission_requests tables
     * Delivered requests have delivery_status 'delivered'
     * @return List of delivered delivery requests
     */
    List<DeliveryRequestDTO> getAllDeliveredDeliveryRequests();
    
    /**
     * Get delivered delivery requests from AW_orders table only
     * Delivered requests have delivery_status 'delivered'
     * @return List of delivered artwork order delivery requests
     */
    List<DeliveryRequestDTO> getDeliveredArtworkOrderDeliveryRequests();
    
    /**
     * Get delivered delivery requests from commission_requests table only
     * Delivered requests have delivery_status 'delivered'
     * @return List of delivered commission delivery requests
     */
    List<DeliveryRequestDTO> getDeliveredCommissionDeliveryRequests();
    
    /**
     * Get platform fee percentage from admin_settings table
     * @return Platform fee percentage as String, or "0" if not found
     */
    String getPlatformFee();
    
    /**
     * Get payment amount from payment table based on order type and order ID
     * @param orderType either "artwork" or "commission"
     * @param orderId the order ID
     * @return Payment amount as BigDecimal, or null if not found
     */
    java.math.BigDecimal getPaymentAmount(String orderType, Long orderId);
    
    /**
     * Insert platform fee commission into platform_fees table
     * @param orderType either "artwork" or "commission"
     * @param orderId the order ID
     * @param platformCommissionFee the calculated platform commission fee
     * @return true if insertion was successful
     */
    boolean insertPlatformFee(String orderType, Long orderId, java.math.BigDecimal platformCommissionFee);
}