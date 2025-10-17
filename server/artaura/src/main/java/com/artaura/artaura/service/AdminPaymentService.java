package com.artaura.artaura.service;

import com.artaura.artaura.dto.admin.AdminPaymentDTO;
import com.artaura.artaura.dto.admin.AdminPaymentFilterDTO;
import com.artaura.artaura.dto.admin.AdminPaymentResponseDTO;

import java.util.List;
import java.util.Optional;

public interface AdminPaymentService {
    
    /**
     * Get all payments with pagination and filtering
     */
    AdminPaymentResponseDTO getAllPayments(AdminPaymentFilterDTO filter);
    
    /**
     * Get payment by ID
     */
    Optional<AdminPaymentDTO> getPaymentById(Integer paymentId);
    
    /**
     * Get payments by artist ID
     */
    List<AdminPaymentDTO> getPaymentsByArtistId(Long artistId);
    
    /**
     * Get payments by buyer ID
     */
    List<AdminPaymentDTO> getPaymentsByBuyerId(Long buyerId);
    
    /**
     * Get payments by status
     */
    List<AdminPaymentDTO> getPaymentsByStatus(String status);
    
    /**
     * Get payment statistics
     */
    Object getPaymentStatistics();
    
    /**
     * Update payment status
     */
    boolean updatePaymentStatus(Integer paymentId, String status);
    
    /**
     * Search payments
     */
    List<AdminPaymentDTO> searchPayments(String searchTerm);
    
    /**
     * Get distinct payment statuses
     */
    List<String> getDistinctStatuses();
}