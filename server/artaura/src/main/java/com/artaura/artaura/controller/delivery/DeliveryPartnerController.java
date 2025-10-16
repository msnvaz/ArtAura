package com.artaura.artaura.controller.delivery;

import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.dto.auth.DeliveryPartnerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/delivery-partner")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryPartnerController {

    @Autowired
    private DeliveryPartnerDAO deliveryPartnerDAO;

    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getDeliveryPartnerProfile(@PathVariable String email) {
        try {
            Optional<DeliveryPartnerDTO> deliveryPartner = deliveryPartnerDAO.findByEmailWithName(email);
            
            if (deliveryPartner.isPresent()) {
                DeliveryPartnerDTO partner = deliveryPartner.get();
                return ResponseEntity.ok(new DeliveryPartnerProfileResponse(
                    partner.getUserId(),
                    partner.getPartnerName(),
                    partner.getEmail()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching delivery partner profile: " + e.getMessage());
        }
    }

    @GetMapping("/profile/user/{userId}")
    public ResponseEntity<?> getDeliveryPartnerProfileByUserId(@PathVariable Long userId) {
        try {
            Optional<DeliveryPartnerDTO> deliveryPartner = deliveryPartnerDAO.findByUserId(userId);
            
            if (deliveryPartner.isPresent()) {
                DeliveryPartnerDTO partner = deliveryPartner.get();
                // Return only necessary information for the frontend
                return ResponseEntity.ok(new DeliveryPartnerProfileResponse(
                    partner.getUserId(),
                    partner.getPartnerName(),
                    partner.getEmail()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching delivery partner profile: " + e.getMessage());
        }
    }

    // Response DTO class for delivery partner profile
    public static class DeliveryPartnerProfileResponse {
        private Long partnerId;
        private String partnerName;
        private String email;

        public DeliveryPartnerProfileResponse(Long partnerId, String partnerName, String email) {
            this.partnerId = partnerId;
            this.partnerName = partnerName;
            this.email = email;
        }

        // Getters
        public Long getPartnerId() { return partnerId; }
        public String getPartnerName() { return partnerName; }
        public String getEmail() { return email; }
    }
}