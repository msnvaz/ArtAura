package com.artaura.artaura.controller;

import com.artaura.artaura.dto.commission.CommissionRequestDTO;
import com.artaura.artaura.dao.CommissionRequestDAO;
import com.artaura.artaura.dao.CommissionRequestDAOImpl;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/commission-requests")
@CrossOrigin(origins = "*")
public class CommissionRequestController {

    @Autowired
    private CommissionRequestDAO commissionRequestDAO;

    @Autowired
    private CommissionRequestDAOImpl commissionRequestDAOImpl;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Get all commission requests for the logged-in artist
     */
    @GetMapping("/artist")
    public ResponseEntity<Map<String, Object>> getArtistCommissionRequests(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            List<CommissionRequestDTO> requests = commissionRequestDAO.getCommissionRequestsByArtistId(artistId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Commission requests retrieved successfully");
            response.put("data", requests);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving commission requests: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get commission requests count for the logged-in artist
     */
    @GetMapping("/artist/count")
    public ResponseEntity<Map<String, Object>> getArtistCommissionRequestsCount(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            int totalCount = commissionRequestDAOImpl.getCommissionRequestsCountByArtistId(artistId);
            int pendingCount = commissionRequestDAOImpl.getPendingCommissionRequestsCountByArtistId(artistId);

            Map<String, Object> countData = new HashMap<>();
            countData.put("total", totalCount);
            countData.put("pending", pendingCount);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Commission requests count retrieved successfully");
            response.put("data", countData);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving commission requests count: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get commission requests for the logged-in buyer
     */
    @GetMapping("/buyer")
    public ResponseEntity<Map<String, Object>> getBuyerCommissionRequests(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long buyerId = jwtUtil.extractUserId(token);

            List<CommissionRequestDTO> requests = commissionRequestDAO.getCommissionRequestsByBuyerId(buyerId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Commission requests retrieved successfully");
            response.put("data", requests);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving commission requests: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get a specific commission request by ID
     */
    @GetMapping("/{requestId}")
    public ResponseEntity<Map<String, Object>> getCommissionRequestById(@PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long userId = jwtUtil.extractUserId(token);

            CommissionRequestDTO request = commissionRequestDAO.getCommissionRequestById(requestId);

            if (request == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Commission request not found");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Check if user has access to this request (either artist or buyer)
            if (!request.getArtistId().equals(userId) && !request.getBuyerId().equals(userId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Commission request retrieved successfully");
            response.put("data", request);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving commission request: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Accept a commission request
     */
    @PostMapping("/{requestId}/accept")
    public ResponseEntity<Map<String, Object>> acceptCommissionRequest(@PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> requestBody) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            CommissionRequestDTO request = commissionRequestDAO.getCommissionRequestById(requestId);

            if (request == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Commission request not found");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Check if the logged-in user is the artist for this request
            if (!request.getArtistId().equals(artistId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // Extract deadline from request body
            String deadline = (String) requestBody.get("deadline");
            if (deadline == null || deadline.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Deadline is required");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            boolean success = commissionRequestDAO.acceptCommissionRequest(requestId, deadline);

            Map<String, Object> response = new HashMap<>();
            if (success) {
                // Send notification to buyer
                try {
                    // Create database notification
                    String notificationSql = "INSERT INTO user_notifications (user_id, user_type, type, title, message, commission_request_id, artist_deadline) VALUES (?, 'BUYER', 'commission_accepted', ?, ?, ?, ?)";
                    String title = "Commission Request Accepted!";
                    String message = String.format("Your commission request \"%s\" has been accepted! The artist will complete it by %s.",
                            request.getTitle(), deadline);

                    jdbcTemplate.update(notificationSql, request.getBuyerId(), title, message, requestId, deadline);

                    // Also log to console
                    System.out.println("=== COMMISSION ACCEPTED NOTIFICATION ===");
                    System.out.println("To: " + request.getName() + " (" + request.getEmail() + ")");
                    System.out.println("Subject: Your Commission Request Has Been Accepted!");
                    System.out.println("Commission: " + request.getTitle());
                    System.out.println("Artist Deadline: " + deadline);
                    System.out.println("========================================");
                } catch (Exception e) {
                    System.err.println("Failed to send notification: " + e.getMessage());
                }

                response.put("message", "Commission request accepted successfully");
                response.put("data", null);
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Failed to accept commission request");
                response.put("data", null);
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error accepting commission request: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Reject a commission request
     */
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<Map<String, Object>> rejectCommissionRequest(@PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> requestBody) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            CommissionRequestDTO request = commissionRequestDAO.getCommissionRequestById(requestId);

            if (request == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Commission request not found");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Check if the logged-in user is the artist for this request
            if (!request.getArtistId().equals(artistId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // Extract rejection reason from request body
            String rejectionReason = (String) requestBody.get("rejectionReason");
            if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Rejection reason is required");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            boolean success = commissionRequestDAO.rejectCommissionRequest(requestId, rejectionReason);

            Map<String, Object> response = new HashMap<>();
            if (success) {
                // Send notification to buyer
                try {
                    // Create database notification
                    String notificationSql = "INSERT INTO user_notifications (user_id, user_type, type, title, message, commission_request_id, rejection_reason) VALUES (?, 'BUYER', 'commission_rejected', ?, ?, ?, ?)";
                    String title = "Commission Request Update";
                    String message = String.format("Unfortunately, your commission request \"%s\" has been declined. Reason: %s",
                            request.getTitle(), rejectionReason);

                    jdbcTemplate.update(notificationSql, request.getBuyerId(), title, message, requestId, rejectionReason);

                    // Also log to console
                    System.out.println("=== COMMISSION REJECTED NOTIFICATION ===");
                    System.out.println("To: " + request.getName() + " (" + request.getEmail() + ")");
                    System.out.println("Subject: Your Commission Request Has Been Declined");
                    System.out.println("Commission: " + request.getTitle());
                    System.out.println("Reason: " + rejectionReason);
                    System.out.println("=========================================");
                } catch (Exception e) {
                    System.err.println("Failed to send notification: " + e.getMessage());
                }

                response.put("message", "Commission request rejected successfully");
                response.put("data", null);
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Failed to reject commission request");
                response.put("data", null);
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error rejecting commission request: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Request delivery for a completed commission
     */
    @PostMapping("/{requestId}/request-delivery")
    public ResponseEntity<Map<String, Object>> requestDelivery(@PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            CommissionRequestDTO request = commissionRequestDAO.getCommissionRequestById(requestId);

            if (request == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Commission request not found");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Check if the logged-in user is the artist for this request
            if (!request.getArtistId().equals(artistId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // Check if commission is accepted
            if (!"ACCEPTED".equalsIgnoreCase(request.getStatus())) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Commission must be accepted before requesting delivery");
                response.put("data", null);
                response.put("success", false);

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Update delivery_status to 'pending' in commission_requests table
            String updateCommissionSql = "UPDATE commission_requests SET delivery_status = 'pending' WHERE id = ?";
            int commissionUpdated = jdbcTemplate.update(updateCommissionSql, requestId);

            // Also update delivery_status in AW_orders table if there's a related order
            // Use a simpler query to avoid potential issues
            try {
                String updateOrderSql = "UPDATE AW_orders SET delivery_status = 'pending' WHERE buyer_id = ?";
                jdbcTemplate.update(updateOrderSql, request.getBuyerId());
            } catch (Exception e) {
                System.err.println("Warning: Could not update AW_orders delivery status: " + e.getMessage());
                // Continue execution even if AW_orders update fails
            }

            Map<String, Object> response = new HashMap<>();
            if (commissionUpdated > 0) {
                // Send notification to buyer
                try {
                    String notificationSql = "INSERT INTO user_notifications (user_id, user_type, type, title, message, commission_request_id) VALUES (?, 'BUYER', 'delivery_requested', ?, ?, ?)";
                    String title = "Artwork Ready for Delivery!";
                    String message = String.format("Great news! Your commissioned artwork \"%s\" is completed and ready for delivery. The artist has requested delivery arrangements.",
                            request.getTitle());

                    jdbcTemplate.update(notificationSql, request.getBuyerId(), title, message, requestId);

                    // Also log to console
                    System.out.println("=== DELIVERY REQUEST NOTIFICATION ===");
                    System.out.println("To: " + request.getName() + " (" + request.getEmail() + ")");
                    System.out.println("Subject: Your Artwork is Ready for Delivery!");
                    System.out.println("Commission: " + request.getTitle());
                    System.out.println("=====================================");
                } catch (Exception e) {
                    System.err.println("Failed to send delivery notification: " + e.getMessage());
                }

                response.put("message", "Delivery request submitted successfully");
                response.put("data", null);
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Failed to request delivery");
                response.put("data", null);
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error requesting delivery: " + e.getMessage());
            response.put("data", null);
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
