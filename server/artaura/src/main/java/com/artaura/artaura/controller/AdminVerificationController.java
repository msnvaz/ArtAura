package com.artaura.artaura.controller;

import com.artaura.artaura.dto.admin.VerificationRequestDTO;
import com.artaura.artaura.service.AdminVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/verification")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdminVerificationController {

    @Autowired
    private AdminVerificationService adminVerificationService;

    @GetMapping("/requests")
    public ResponseEntity<Map<String, Object>> getAllVerificationRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String search) {

        try {
            List<VerificationRequestDTO> requests;

            if (status != null || userType != null || search != null) {
                Map<String, Object> filters = new HashMap<>();
                if (status != null) {
                    filters.put("status", status);
                }
                if (userType != null) {
                    filters.put("userType", userType);
                }
                if (search != null) {
                    filters.put("search", search);
                }

                requests = adminVerificationService.getFilteredVerificationRequests(filters);
            } else {
                requests = adminVerificationService.getAllVerificationRequests();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("requests", requests);
            response.put("total", requests.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch verification requests");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PutMapping("/requests/{requestId}/status")
    public ResponseEntity<Map<String, Object>> updateVerificationStatus(
            @PathVariable String requestId,
            @RequestBody Map<String, String> statusUpdate) {

        try {
            String userType = statusUpdate.get("userType");
            String status = statusUpdate.get("status");
            String rejectionReason = statusUpdate.get("rejectionReason");

            // Map frontend status to database status
            String dbStatus;
            switch (status.toLowerCase()) {
                case "verified":
                case "approve":
                    dbStatus = "Active";
                    break;
                case "rejected":
                case "reject":
                    dbStatus = "Suspended";
                    break;
                case "pending":
                    dbStatus = "Pending";
                    break;
                default:
                    dbStatus = status;
            }

            boolean success;
            if (rejectionReason != null && !rejectionReason.isEmpty()) {
                success = adminVerificationService.updateVerificationStatus(requestId, userType, dbStatus, rejectionReason);
            } else {
                success = adminVerificationService.updateVerificationStatus(requestId, userType, dbStatus);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "Status updated successfully" : "Failed to update status");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update verification status");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getVerificationStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", adminVerificationService.getTotalVerificationRequestsCount());
            stats.put("pending", adminVerificationService.getPendingVerificationRequestsCount());
            stats.put("verified", adminVerificationService.getVerifiedRequestsCount());
            stats.put("rejected", adminVerificationService.getRejectedRequestsCount());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch verification stats");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
