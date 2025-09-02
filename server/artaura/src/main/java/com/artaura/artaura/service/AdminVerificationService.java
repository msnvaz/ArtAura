package com.artaura.artaura.service;

import com.artaura.artaura.dao.AdminVerificationDAO;
import com.artaura.artaura.dto.admin.VerificationRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminVerificationService {

    @Autowired
    private AdminVerificationDAO adminVerificationDAO;

    public List<VerificationRequestDTO> getAllVerificationRequests() {
        return adminVerificationDAO.getAllVerificationRequests();
    }

    public List<VerificationRequestDTO> getFilteredVerificationRequests(Map<String, Object> filters) {
        return adminVerificationDAO.getFilteredVerificationRequests(filters);
    }

    public boolean updateVerificationStatus(String requestId, String userType, String status) {
        return adminVerificationDAO.updateVerificationStatus(requestId, userType, status);
    }

    public boolean updateVerificationStatus(String requestId, String userType, String status, String rejectionReason) {
        return adminVerificationDAO.updateVerificationStatus(requestId, userType, status, rejectionReason);
    }

    public int getTotalVerificationRequestsCount() {
        return adminVerificationDAO.getTotalVerificationRequestsCount();
    }

    public int getPendingVerificationRequestsCount() {
        return adminVerificationDAO.getPendingVerificationRequestsCount();
    }

    public int getVerifiedRequestsCount() {
        return adminVerificationDAO.getVerifiedRequestsCount();
    }

    public int getRejectedRequestsCount() {
        return adminVerificationDAO.getRejectedRequestsCount();
    }
}
