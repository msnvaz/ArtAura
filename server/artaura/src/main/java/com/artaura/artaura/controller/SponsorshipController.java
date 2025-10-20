package com.artaura.artaura.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artaura.artaura.dto.sponsorship.ChallengeForSponsorshipDTO;
import com.artaura.artaura.dto.sponsorship.SponsorshipOfferDTO;
import com.artaura.artaura.service.SponsorshipService;

@RestController
@RequestMapping("/api/sponsorships")
// CORS handled globally in SecurityConfig & WebConfig - no need for
// @CrossOrigin here
public class SponsorshipController {

    @Autowired
    private SponsorshipService sponsorshipService;

    /**
     * Get all active challenges requesting sponsorship (request_sponsorship = 1)
     * GET /api/sponsorships/challenges/active
     */
    @GetMapping("/challenges/active")
    public ResponseEntity<List<ChallengeForSponsorshipDTO>> getActiveChallengesRequestingSponsorship() {
        try {
            System.out.println("📋 Fetching challenges requesting sponsorship...");
            List<ChallengeForSponsorshipDTO> challenges = sponsorshipService.getActiveChallengesRequestingSponsorship();
            System.out.println("✅ Found " + challenges.size() + " challenges requesting sponsorship");
            return ResponseEntity.ok(challenges);
        } catch (Exception e) {
            System.err.println("❌ Error fetching challenges: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a sponsorship offer - automatically generates discount code and
     * updates challenge status
     * POST /api/sponsorships/offers
     * Request body: { "shopId": 1, "challengeId": 1, "discountPercentage": 15 }
     */
    @PostMapping("/offers")
    public ResponseEntity<Map<String, Object>> createSponsorshipOffer(@RequestBody Map<String, Object> request) {
        try {
            Long shopId = Long.valueOf(request.get("shopId").toString());
            Long challengeId = Long.valueOf(request.get("challengeId").toString());
            Integer discountPercentage = Integer.valueOf(request.get("discountPercentage").toString());

            System.out.println("📝 Creating sponsorship offer...");
            System.out.println("   Shop ID: " + shopId);
            System.out.println("   Challenge ID: " + challengeId);
            System.out.println("   Discount: " + discountPercentage + "%");

            Long offerId = sponsorshipService.createSponsorshipOffer(shopId, challengeId, discountPercentage);

            // Get the created offer to return discount code
            SponsorshipOfferDTO offer = sponsorshipService.getSponsorshipOfferById(offerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sponsorship created successfully! Challenge status updated to sponsored.");
            response.put("offerId", offerId);
            response.put("discountCode", offer.getDiscountCode());
            response.put("discountPercentage", offer.getDiscountPercentage());

            System.out.println("✅ Sponsorship offer created with ID: " + offerId);
            System.out.println("   Discount Code: " + offer.getDiscountCode());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Validation error: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            System.err.println("❌ Error creating sponsorship offer: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all sponsorship offers by shop
     * GET /api/sponsorships/offers/shop/{shopId}
     */
    @GetMapping("/offers/shop/{shopId}")
    public ResponseEntity<List<SponsorshipOfferDTO>> getSponsorshipOffersByShop(@PathVariable Long shopId) {
        try {
            System.out.println("📋 Fetching sponsorship offers for shop ID: " + shopId);
            List<SponsorshipOfferDTO> offers = sponsorshipService.getSponsorshipOffersByShop(shopId);
            System.out.println("✅ Found " + offers.size() + " sponsorship offers");
            return ResponseEntity.ok(offers);
        } catch (Exception e) {
            System.err.println("❌ Error fetching shop sponsorship offers: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all sponsorship offers for a challenge
     * GET /api/sponsorships/offers/challenge/{challengeId}
     */
    @GetMapping("/offers/challenge/{challengeId}")
    public ResponseEntity<List<SponsorshipOfferDTO>> getSponsorshipOffersByChallenge(@PathVariable Long challengeId) {
        try {
            System.out.println("📋 Fetching sponsorship offers for challenge ID: " + challengeId);
            List<SponsorshipOfferDTO> offers = sponsorshipService.getSponsorshipOffersByChallenge(challengeId);
            System.out.println("✅ Found " + offers.size() + " sponsorship offers");
            return ResponseEntity.ok(offers);
        } catch (Exception e) {
            System.err.println("❌ Error fetching challenge sponsorship offers: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get a specific sponsorship offer by ID
     * GET /api/sponsorships/offers/{offerId}
     */
    @GetMapping("/offers/{offerId}")
    public ResponseEntity<SponsorshipOfferDTO> getSponsorshipOfferById(@PathVariable Long offerId) {
        try {
            System.out.println("📋 Fetching sponsorship offer ID: " + offerId);
            SponsorshipOfferDTO offer = sponsorshipService.getSponsorshipOfferById(offerId);
            return ResponseEntity.ok(offer);
        } catch (Exception e) {
            System.err.println("❌ Error fetching sponsorship offer: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Delete a sponsorship offer - automatically reverts challenge status if no
     * other sponsors
     * DELETE /api/sponsorships/offers/{offerId}
     */
    @DeleteMapping("/offers/{offerId}")
    public ResponseEntity<Map<String, Object>> deleteSponsorshipOffer(@PathVariable Long offerId) {
        try {
            System.out.println("🗑️ Deleting sponsorship offer ID: " + offerId);
            sponsorshipService.deleteSponsorshipOffer(offerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sponsorship offer deleted successfully. Challenge status updated if needed.");

            System.out.println("✅ Sponsorship offer deleted");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            System.err.println("❌ Error deleting sponsorship offer: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update sponsorship offer status (e.g., to 'valid' when sent to winner)
     * PUT /api/sponsorships/offers/{offerId}/status
     * Request body: { "status": "valid" }
     */
    @PutMapping("/offers/{offerId}/status")
    public ResponseEntity<Map<String, Object>> updateSponsorshipStatus(
            @PathVariable Long offerId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            
            if (status == null || status.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Status is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            System.out.println("📝 Updating sponsorship offer " + offerId + " status to: " + status);
            sponsorshipService.updateSponsorshipStatus(offerId, status);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sponsorship status updated successfully");
            response.put("offerId", offerId);
            response.put("status", status);

            System.out.println("✅ Sponsorship status updated");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            System.err.println("❌ Error updating sponsorship status: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
