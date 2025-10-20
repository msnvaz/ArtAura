
package com.artaura.artaura.controller.moderator;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.dto.moderator.ChallengeListDTO;
import com.artaura.artaura.dto.buyer.ChallengeSubmissionDTO;
import com.artaura.artaura.service.moderator.ChallengeService;
import com.artaura.artaura.util.JwtUtil;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "http://localhost:5173")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @Autowired
    private JwtUtil jwtUtil; // Your JWT utility class

    @PostMapping
    public ResponseEntity<?> createChallenge(
        @RequestBody ChallengeDTO challengeDTO,
        @RequestHeader("Authorization") String authHeader
    ) {
        try {
            // Debug logging
            System.out.println("Received challenge creation request:");
            System.out.println("Title: " + challengeDTO.getTitle());
            System.out.println("Category: " + challengeDTO.getCategory());
            System.out.println("Publish DateTime: " + challengeDTO.getPublishDateTime());
            System.out.println("Deadline DateTime: " + challengeDTO.getDeadlineDateTime());
            System.out.println("Max Participants: " + challengeDTO.getMaxParticipants());
            System.out.println("Request Sponsorship: " + challengeDTO.isRequestSponsorship());
            
            String token = authHeader.replace("Bearer ", "");
            Long moderatorId = jwtUtil.extractUserId(token);
            System.out.println("Moderator ID: " + moderatorId);
            
            challengeService.createChallenge(challengeDTO, moderatorId != null ? moderatorId.toString() : null);
            return ResponseEntity.ok("Challenge created successfully");
        } catch (Exception e) {
            System.err.println("Error creating challenge: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating challenge: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ChallengeListDTO>> getAllChallenges() {
        List<ChallengeListDTO> challenges = challengeService.getAllChallenges();
        return ResponseEntity.ok(challenges);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallenge(@PathVariable int id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.ok("Challenge deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateChallenge(
        @PathVariable int id,
        @RequestBody ChallengeDTO challengeDTO,
        @RequestHeader("Authorization") String authHeader
    ) {
        // Debug logging
        System.out.println("Received challenge update request:");
        System.out.println("ID: " + id);
        System.out.println("Title: " + challengeDTO.getTitle());
        System.out.println("Deadline DateTime: '" + challengeDTO.getDeadlineDateTime() + "'");
        
        String token = authHeader.replace("Bearer ", "");
        Long moderatorId = jwtUtil.extractUserId(token);
        challengeDTO.setId(id);
        challengeService.updateChallenge(challengeDTO, moderatorId != null ? moderatorId.toString() : null);
        return ResponseEntity.ok("Challenge updated successfully");
    }

    /**
     * Update sponsorship status for a challenge
     * When sponsorship becomes 'active', draft challenges are automatically published
     */
    @PutMapping("/{id}/sponsorship")
    public ResponseEntity<?> updateSponsorshipStatus(
            @PathVariable int id,
            @RequestBody java.util.Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long moderatorId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Verify user has moderator or admin role
            if (!"moderator".equals(role) && !"admin".equals(role)) {
                return ResponseEntity.status(403).body("Only moderators and admins can update sponsorship status");
            }

            String sponsorshipStatus = request.get("sponsorship");
            if (sponsorshipStatus == null || sponsorshipStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Sponsorship status is required");
            }

            // Validate sponsorship status (should be: none, pending, or active)
            if (!sponsorshipStatus.matches("(?i)(none|pending|active)")) {
                return ResponseEntity.badRequest().body("Invalid sponsorship status. Must be: none, pending, or active");
            }

            challengeService.updateSponsorshipStatus(id, sponsorshipStatus.toLowerCase());
            
            if ("active".equalsIgnoreCase(sponsorshipStatus)) {
                return ResponseEntity.ok("Sponsorship activated! Draft challenge has been automatically published.");
            }
            
            return ResponseEntity.ok("Sponsorship status updated to: " + sponsorshipStatus);
        } catch (Exception e) {
            System.err.println("Error updating sponsorship status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating sponsorship: " + e.getMessage());
        }
    }

    /**
     * Get submissions for a challenge with marks calculated and winners sorted
     * Formula: MAX(0, (Likes × 10) - (Dislikes × 5))
     * Returns submissions sorted by marks (highest first)
     * Top 3 submissions get positions 1, 2, 3
     */
    @GetMapping("/{challengeId}/winners")
    public ResponseEntity<List<ChallengeSubmissionDTO>> getChallengeWinners(
            @PathVariable Integer challengeId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Verify user has moderator role
            if (!"moderator".equals(role)) {
                return ResponseEntity.status(403).build();
            }

            List<ChallengeSubmissionDTO> submissions = challengeService.getWinners(challengeId);
            return ResponseEntity.ok(submissions);

        } catch (Exception e) {
            System.err.println("Error in getChallengeWinners: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}