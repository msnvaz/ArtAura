package com.artaura.artaura.controller;

import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class NotificationController {

    @Autowired
    private JwtUtil jwtUtil;

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
}
