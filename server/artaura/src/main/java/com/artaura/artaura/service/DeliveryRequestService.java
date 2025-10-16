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
}