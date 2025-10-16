package com.artaura.artaura.dao;

import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import com.artaura.artaura.dto.delivery.ArtistPickupAddressDTO;
import java.util.List;
import java.util.Optional;
import java.util.Map;

public interface AdminDeliveryDAO {
    /**
     * Get all delivery requests from both AW_orders and commission_requests tables
     * Admin can see all delivery requests regardless of status
     * @return List of all delivery requests
     */
    List<DeliveryRequestDTO> getAllDeliveryRequests();
    
    /**
     * Get delivery requests filtered by status
     * @param status the delivery status to filter by (pending, accepted, outForDelivery, delivered, etc.)
     * @return List of delivery requests matching the status
     */
    List<DeliveryRequestDTO> getDeliveryRequestsByStatus(String status);
    
    /**
     * Get delivery requests from AW_orders table only (all statuses)
     * @return List of all artwork order delivery requests
     */
    List<DeliveryRequestDTO> getAllArtworkOrderDeliveryRequests();
    
    /**
     * Get delivery requests from commission_requests table only (all statuses)
     * @return List of all commission delivery requests
     */
    List<DeliveryRequestDTO> getAllCommissionDeliveryRequests();
    
    /**
     * Get delivery requests within a date range
     * @param startDate start date in YYYY-MM-DD format
     * @param endDate end date in YYYY-MM-DD format
     * @return List of delivery requests within the date range
     */
    List<DeliveryRequestDTO> getDeliveryRequestsByDateRange(String startDate, String endDate);
    
    /**
     * Get delivery requests with multiple filters
     * @param filters Map containing filter criteria (status, startDate, endDate, requestType, etc.)
     * @return List of filtered delivery requests
     */
    List<DeliveryRequestDTO> getFilteredDeliveryRequests(Map<String, String> filters);
    
    /**
     * Get delivery statistics for admin dashboard
     * @return Map containing delivery statistics
     */
    Map<String, Object> getDeliveryStatistics();
    
    /**
     * Get delivery request by ID and type (for admin to view details)
     * @param id the request ID
     * @param requestType either "artwork_order" or "commission_request"
     * @return Optional delivery request
     */
    Optional<DeliveryRequestDTO> getDeliveryRequestById(Long id, String requestType);
    
    /**
     * Get all artist pickup addresses for all delivery requests (not just pending)
     * @return List of all artist pickup addresses
     */
    List<ArtistPickupAddressDTO> getAllArtistPickupAddresses();
    
    /**
     * Get delivery partner performance data
     * @return List of delivery partner performance metrics
     */
    List<Map<String, Object>> getDeliveryPartnerPerformance();
    
    /**
     * Get delivery requests assigned to a specific delivery partner
     * @param partnerId the delivery partner ID
     * @return List of delivery requests assigned to the partner
     */
    List<DeliveryRequestDTO> getDeliveryRequestsByPartnerId(Long partnerId);
    
    /**
     * Get delivery requests for a specific buyer
     * @param buyerId the buyer ID
     * @return List of delivery requests for the buyer
     */
    List<DeliveryRequestDTO> getDeliveryRequestsByBuyerId(Long buyerId);
    
    /**
     * Get delivery requests for a specific artist
     * @param artistId the artist ID
     * @return List of delivery requests for the artist
     */
    List<DeliveryRequestDTO> getDeliveryRequestsByArtistId(Long artistId);
}