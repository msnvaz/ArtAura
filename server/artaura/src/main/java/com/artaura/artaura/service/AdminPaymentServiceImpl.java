package com.artaura.artaura.service;

import com.artaura.artaura.dao.AdminPaymentDAO;
import com.artaura.artaura.dto.admin.AdminPaymentDTO;
import com.artaura.artaura.dto.admin.AdminPaymentFilterDTO;
import com.artaura.artaura.dto.admin.AdminPaymentResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminPaymentServiceImpl implements AdminPaymentService {

    @Autowired
    @Qualifier("adminPaymentDAOImpl")
    private AdminPaymentDAO adminPaymentDAO;

    @Override
    public AdminPaymentResponseDTO getAllPayments(AdminPaymentFilterDTO filter) {
        // Set default values if not provided
        if (filter.getPage() == null) filter.setPage(0);
        if (filter.getSize() == null) filter.setSize(10);
        if (filter.getSortBy() == null) filter.setSortBy("created_at");
        if (filter.getSortOrder() == null) filter.setSortOrder("DESC");
        
        return adminPaymentDAO.getAllPayments(filter);
    }

    @Override
    public Optional<AdminPaymentDTO> getPaymentById(Integer paymentId) {
        return adminPaymentDAO.getPaymentById(paymentId);
    }

    @Override
    public List<AdminPaymentDTO> getPaymentsByArtistId(Long artistId) {
        return adminPaymentDAO.getPaymentsByArtistId(artistId);
    }

    @Override
    public List<AdminPaymentDTO> getPaymentsByBuyerId(Long buyerId) {
        return adminPaymentDAO.getPaymentsByBuyerId(buyerId);
    }

    @Override
    public List<AdminPaymentDTO> getPaymentsByStatus(String status) {
        return adminPaymentDAO.getPaymentsByStatus(status);
    }

    @Override
    public Object getPaymentStatistics() {
        return adminPaymentDAO.getPaymentStatistics();
    }

    @Override
    public boolean updatePaymentStatus(Integer paymentId, String status) {
        // Validate status
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid payment status: " + status);
        }
        return adminPaymentDAO.updatePaymentStatus(paymentId, status);
    }

    @Override
    public List<AdminPaymentDTO> searchPayments(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return List.of();
        }
        return adminPaymentDAO.searchPayments(searchTerm.trim());
    }

    @Override
    public List<String> getDistinctStatuses() {
        return adminPaymentDAO.getDistinctStatuses();
    }

    private boolean isValidStatus(String status) {
        return status != null && (
            "escrow".equals(status) || 
            "paid".equals(status) || 
            "refunded".equals(status)
        );
    }
}