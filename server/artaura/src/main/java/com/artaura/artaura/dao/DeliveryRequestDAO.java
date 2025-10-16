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
}