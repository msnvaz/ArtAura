package com.artaura.artaura.service;

import com.artaura.artaura.dao.AdminDeliveryDAO;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import com.artaura.artaura.dto.delivery.ArtistPickupAddressDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminDeliveryService {

    @Autowired
    private AdminDeliveryDAO adminDeliveryDAO;

    /**
     * Get all delivery requests for admin overview
     * @return List of all delivery requests
     */
    public List<DeliveryRequestDTO> getAllDeliveryRequests() {
        try {
            return adminDeliveryDAO.getAllDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching all delivery requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch all delivery requests", e);
        }
    }

    /**
     * Get delivery requests filtered by status
     * @param status the delivery status to filter by
     * @return List of filtered delivery requests
     */
    public List<DeliveryRequestDTO> getDeliveryRequestsByStatus(String status) {
        try {
            return adminDeliveryDAO.getDeliveryRequestsByStatus(status);
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching delivery requests by status: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery requests by status", e);
        }
    }

    /**
     * Get artwork order delivery requests only
     * @return List of artwork order delivery requests
     */
    public List<DeliveryRequestDTO> getAllArtworkOrderDeliveryRequests() {
        try {
            return adminDeliveryDAO.getAllArtworkOrderDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching artwork order delivery requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch artwork order delivery requests", e);
        }
    }

    /**
     * Get commission delivery requests only
     * @return List of commission delivery requests
     */
    public List<DeliveryRequestDTO> getAllCommissionDeliveryRequests() {
        try {
            return adminDeliveryDAO.getAllCommissionDeliveryRequests();
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching commission delivery requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch commission delivery requests", e);
        }
    }

    /**
     * Get delivery requests within a date range
     * @param startDate start date in YYYY-MM-DD format
     * @param endDate end date in YYYY-MM-DD format
     * @return List of delivery requests within the date range
     */
    public List<DeliveryRequestDTO> getDeliveryRequestsByDateRange(String startDate, String endDate) {
        try {
            return adminDeliveryDAO.getDeliveryRequestsByDateRange(startDate, endDate);
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching delivery requests by date range: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery requests by date range", e);
        }
    }

    /**
     * Get delivery requests with multiple filters
     * @param filters Map containing filter criteria
     * @return List of filtered delivery requests
     */
    public List<DeliveryRequestDTO> getFilteredDeliveryRequests(Map<String, String> filters) {
        try {
            return adminDeliveryDAO.getFilteredDeliveryRequests(filters);
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching filtered delivery requests: " + e.getMessage());
            throw new RuntimeException("Failed to fetch filtered delivery requests", e);
        }
    }

    /**
     * Get delivery statistics for admin dashboard
     * @return Map containing delivery statistics
     */
    public Map<String, Object> getDeliveryStatistics() {
        try {
            return adminDeliveryDAO.getDeliveryStatistics();
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching delivery statistics: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery statistics", e);
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
            return adminDeliveryDAO.getDeliveryRequestById(id, requestType);
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching delivery request by ID: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery request by ID", e);
        }
    }

    /**
     * Get all artist pickup addresses
     * @return List of artist pickup addresses
     */
    public List<ArtistPickupAddressDTO> getAllArtistPickupAddresses() {
        try {
            return adminDeliveryDAO.getAllArtistPickupAddresses();
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching artist pickup addresses: " + e.getMessage());
            throw new RuntimeException("Failed to fetch artist pickup addresses", e);
        }
    }

    /**
     * Get delivery partner performance data
     * @return List of delivery partner performance metrics
     */
    public List<Map<String, Object>> getDeliveryPartnerPerformance() {
        try {
            return adminDeliveryDAO.getDeliveryPartnerPerformance();
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching delivery partner performance: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery partner performance", e);
        }
    }

    /**
     * Get delivery requests for a specific buyer
     * @param buyerId the buyer ID
     * @return List of delivery requests for the buyer
     */
    public List<DeliveryRequestDTO> getDeliveryRequestsByBuyerId(Long buyerId) {
        try {
            return adminDeliveryDAO.getDeliveryRequestsByBuyerId(buyerId);
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching delivery requests by buyer ID: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery requests by buyer ID", e);
        }
    }

    /**
     * Get delivery requests for a specific artist
     * @param artistId the artist ID
     * @return List of delivery requests for the artist
     */
    public List<DeliveryRequestDTO> getDeliveryRequestsByArtistId(Long artistId) {
        try {
            return adminDeliveryDAO.getDeliveryRequestsByArtistId(artistId);
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching delivery requests by artist ID: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery requests by artist ID", e);
        }
    }

    /**
     * Get delivery requests assigned to a specific delivery partner
     * @param partnerId the delivery partner ID
     * @return List of delivery requests assigned to the partner
     */
    public List<DeliveryRequestDTO> getDeliveryRequestsByPartnerId(Long partnerId) {
        try {
            return adminDeliveryDAO.getDeliveryRequestsByPartnerId(partnerId);
        } catch (Exception e) {
            System.out.println("❌ AdminDeliveryService: Error fetching delivery requests by partner ID: " + e.getMessage());
            throw new RuntimeException("Failed to fetch delivery requests by partner ID", e);
        }
    }
}