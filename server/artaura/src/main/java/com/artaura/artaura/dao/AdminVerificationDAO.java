package com.artaura.artaura.dao;

import com.artaura.artaura.dto.admin.VerificationRequestDTO;
import java.util.List;
import java.util.Map;

public interface AdminVerificationDAO {
    List<VerificationRequestDTO> getAllVerificationRequests();
    List<VerificationRequestDTO> getFilteredVerificationRequests(Map<String, Object> filters);
    boolean updateVerificationStatus(String requestId, String userType, String status);
    boolean updateVerificationStatus(String requestId, String userType, String status, String rejectionReason);
    int getTotalVerificationRequestsCount();
    int getPendingVerificationRequestsCount();
    int getVerifiedRequestsCount();
    int getRejectedRequestsCount();
}
