package com.artaura.artaura.controller;

import com.artaura.artaura.entity.ArtistNotification;
import com.artaura.artaura.service.ArtistNotificationService;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class NotificationController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ArtistNotificationService artistNotificationService;

    /**
     * Send notification to buyer when commission request is accepted
     */
    @PostMapping("/commission-accepted")
    public ResponseEntity<Map<String, Object>> sendCommissionAcceptedNotification(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> requestBody) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            Long buyerId = Long.valueOf(requestBody.get("buyerId").toString());
            String commissionTitle = (String) requestBody.get("commissionTitle");
            String artistDeadline = (String) requestBody.get("artistDeadline");
            String buyerEmail = (String) requestBody.get("buyerEmail");
            String buyerName = (String) requestBody.get("buyerName");

            // For now, we'll just log the notification
            // In a real application, you would send an email or push notification
            System.out.println("=== COMMISSION ACCEPTED NOTIFICATION ===");
            System.out.println("To: " + buyerName + " (" + buyerEmail + ")");
            System.out.println("Subject: Your Commission Request Has Been Accepted!");
            System.out.println("Commission: " + commissionTitle);
            System.out.println("Artist Deadline: " + artistDeadline);
            System.out.println("========================================");

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notification sent successfully to buyer");
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error sending notification: " + e.getMessage());
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Send notification to buyer when commission request is rejected
     */
    @PostMapping("/commission-rejected")
    public ResponseEntity<Map<String, Object>> sendCommissionRejectedNotification(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> requestBody) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            Long buyerId = Long.valueOf(requestBody.get("buyerId").toString());
            String commissionTitle = (String) requestBody.get("commissionTitle");
            String rejectionReason = (String) requestBody.get("rejectionReason");
            String buyerEmail = (String) requestBody.get("buyerEmail");
            String buyerName = (String) requestBody.get("buyerName");

            // For now, we'll just log the notification
            // In a real application, you would send an email or push notification
            System.out.println("=== COMMISSION REJECTED NOTIFICATION ===");
            System.out.println("To: " + buyerName + " (" + buyerEmail + ")");
            System.out.println("Subject: Your Commission Request Has Been Declined");
            System.out.println("Commission: " + commissionTitle);
            System.out.println("Reason: " + rejectionReason);
            System.out.println("=========================================");

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notification sent successfully to buyer");
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error sending notification: " + e.getMessage());
            response.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all notifications for the authenticated artist
     */
    @GetMapping("/artist")
    public ResponseEntity<Map<String, Object>> getArtistNotifications(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            if (!"artist".equals(role)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied. Only artists can access notifications.");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            List<ArtistNotification> notifications = artistNotificationService.getNotificationsByArtistId(artistId);
            Long unreadCount = artistNotificationService.getUnreadNotificationCount(artistId);

            Map<String, Object> response = new HashMap<>();
            response.put("notifications", notifications);
            response.put("unreadCount", unreadCount);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error fetching notifications: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get unread notification count for the authenticated artist
     */
    @GetMapping("/artist/count")
    public ResponseEntity<Map<String, Object>> getUnreadNotificationCount(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            if (!"artist".equals(role)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied. Only artists can access notifications.");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            Long unreadCount = artistNotificationService.getUnreadNotificationCount(artistId);

            Map<String, Object> response = new HashMap<>();
            response.put("unreadCount", unreadCount);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error fetching notification count: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Mark a notification as read
     */
    @PutMapping("/artist/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markNotificationAsRead(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long notificationId) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            if (!"artist".equals(role)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied. Only artists can access notifications.");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            boolean success = artistNotificationService.markAsRead(notificationId, artistId);

            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("message", "Notification marked as read");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Notification not found or access denied");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error marking notification as read: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Mark all notifications as read for the authenticated artist
     */
    @PutMapping("/artist/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllNotificationsAsRead(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            if (!"artist".equals(role)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Access denied. Only artists can access notifications.");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            artistNotificationService.markAllAsRead(artistId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "All notifications marked as read");
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error marking all notifications as read: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
