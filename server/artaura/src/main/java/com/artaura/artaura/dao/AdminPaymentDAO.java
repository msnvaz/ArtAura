package com.artaura.artaura.dao;

import com.artaura.artaura.dto.admin.AdminPaymentDTO;
import com.artaura.artaura.dto.admin.AdminPaymentFilterDTO;
import com.artaura.artaura.dto.admin.AdminPaymentResponseDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AdminPaymentDAO {
    
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
     * Get payments by payment type (order or commission)
     */
    List<AdminPaymentDTO> getPaymentsByType(String paymentType);
    
    /**
     * Get payment statistics
     */
    Long getTotalPaymentsCount();
    
    /**
     * Get payments count by status
     */
    Long getPaymentsCountByStatus(String status);
    
    /**
     * Get total amount by status
     */
    BigDecimal getTotalAmountByStatus(String status);
    
    /**
     * Update payment status
     */
    boolean updatePaymentStatus(Integer paymentId, String status);
    
    /**
     * Get distinct payment statuses
     */
    List<String> getDistinctStatuses();
    
    /**
     * Get payment statistics for dashboard
     */
    Object getPaymentStatistics();
    
    /**
     * Search payments by artist or buyer name
     */
    List<AdminPaymentDTO> searchPayments(String searchTerm);
}