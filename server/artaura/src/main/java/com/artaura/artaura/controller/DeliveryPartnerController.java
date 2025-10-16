package com.artaura.artaura.controller;

import com.artaura.artaura.service.DeliveryPartnerService;
import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.dto.auth.DeliveryPartnerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery-partner")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryPartnerController {

    @Autowired
    private DeliveryPartnerService deliveryPartnerService;

    @Autowired
    private DeliveryPartnerDAO deliveryPartnerDAO;

    @GetMapping("/name/{partnerId}")
    public ResponseEntity<Map<String, String>> getPartnerName(@PathVariable Long partnerId) {
        try {
            Optional<String> partnerName = deliveryPartnerService.getPartnerNameById(partnerId);
            
            Map<String, String> response = new HashMap<>();
            if (partnerName.isPresent()) {
                response.put("partnerName", partnerName.get());
                response.put("success", "true");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Partner not found");
                response.put("success", "false");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", "false");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/profile/{partnerId}")
    public ResponseEntity<Map<String, Object>> getPartnerProfile(@PathVariable Long partnerId) {
        try {
            Optional<Map<String, String>> profile = deliveryPartnerService.getPartnerProfileById(partnerId);
            
            Map<String, Object> response = new HashMap<>();
            if (profile.isPresent()) {
                response.put("profile", profile.get());
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Partner not found");
                response.put("success", false);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/profile/user/{userId}")
    public ResponseEntity<?> getDeliveryPartnerProfileByUserId(@PathVariable Long userId) {
        try {
            Optional<DeliveryPartnerDTO> deliveryPartner = deliveryPartnerDAO.findByUserId(userId);
            
            if (deliveryPartner.isPresent()) {
                DeliveryPartnerDTO partner = deliveryPartner.get();
                // Return response compatible with frontend
                Map<String, Object> response = new HashMap<>();
                response.put("partnerId", partner.getUserId());
                response.put("partnerName", partner.getPartnerName());
                response.put("email", partner.getEmail());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching delivery partner profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile/{partnerId}/name")
    public ResponseEntity<Map<String, Object>> updatePartnerName(@PathVariable Long partnerId, @RequestBody Map<String, String> request) {
        try {
            String newName = request.get("partnerName");
            if (newName == null || newName.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Partner name is required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }

            boolean updated = deliveryPartnerService.updatePartnerName(partnerId, newName.trim());
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Partner name updated successfully");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to update partner name");
                response.put("success", false);
                return ResponseEntity.internalServerError().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("/profile/{partnerId}/password")
    public ResponseEntity<Map<String, Object>> changePassword(@PathVariable Long partnerId, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("newPassword");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "New password is required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }

            boolean updated = deliveryPartnerService.changePassword(partnerId, newPassword);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("message", "Password updated successfully");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to update password");
                response.put("success", false);
                return ResponseEntity.internalServerError().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.internalServerError().body(response);
        }
    }
}