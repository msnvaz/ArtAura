package com.artaura.artaura.controller;

import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class NotificationControllerEnhanced {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Get notifications for a specific buyer
     */
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<Map<String, Object>> getBuyerNotifications(
            @PathVariable Long buyerId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            // Verify user can access these notifications
            if (!userId.equals(buyerId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            String sql = "SELECT * FROM user_notifications WHERE user_id = ? AND user_type = 'BUYER' ORDER BY created_at DESC LIMIT 50";
            List<Map<String, Object>> notifications = jdbcTemplate.queryForList(sql, buyerId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notifications retrieved successfully");
            response.put("data", notifications);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving notifications: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Mark notification as read
     */
    @PostMapping("/{notificationId}/mark-read")
    public ResponseEntity<Map<String, Object>> markNotificationAsRead(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            // Verify notification belongs to user
            String checkSql = "SELECT user_id FROM user_notifications WHERE id = ?";
            List<Long> userIds = jdbcTemplate.queryForList(checkSql, Long.class, notificationId);

            if (userIds.isEmpty() || !userIds.get(0).equals(userId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Notification not found or access denied");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            String sql = "UPDATE user_notifications SET is_read = TRUE, updated_at = NOW() WHERE id = ?";
            int updated = jdbcTemplate.update(sql, notificationId);

            Map<String, Object> response = new HashMap<>();
            if (updated > 0) {
                response.put("message", "Notification marked as read");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Failed to update notification");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error updating notification: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, Object>> deleteNotification(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            // Verify notification belongs to user
            String checkSql = "SELECT user_id FROM user_notifications WHERE id = ?";
            List<Long> userIds = jdbcTemplate.queryForList(checkSql, Long.class, notificationId);

            if (userIds.isEmpty() || !userIds.get(0).equals(userId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Notification not found or access denied");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            String sql = "DELETE FROM user_notifications WHERE id = ?";
            int deleted = jdbcTemplate.update(sql, notificationId);

            Map<String, Object> response = new HashMap<>();
            if (deleted > 0) {
                response.put("message", "Notification deleted");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Failed to delete notification");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error deleting notification: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Create a notification (internal use)
     */
    public void createNotification(Long userId, String userType, String type, String title,
            String message, Long commissionRequestId, String artistDeadline,
            String rejectionReason) {
        try {
            String sql = "INSERT INTO user_notifications (user_id, user_type, type, title, message, commission_request_id, artist_deadline, rejection_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, userId, userType, type, title, message, commissionRequestId, artistDeadline, rejectionReason);
        } catch (Exception e) {
            System.err.println("Error creating notification: " + e.getMessage());
        }
    }
}
