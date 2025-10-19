package com.artaura.artaura.controller.artist;

import com.artaura.artaura.dto.artist.ChallengeParticipationDTO;
import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.service.artist.ChallengeParticipationService;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class ChallengeParticipationController {

    @Autowired
    private ChallengeParticipationService challengeParticipationService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/challenges/active")
    public ResponseEntity<List<ChallengeDTO>> getActiveChallenges() {
        try {
            List<ChallengeDTO> challenges = challengeParticipationService.getActiveChallenges();
            return ResponseEntity.ok(challenges);
        } catch (Exception e) {
            System.err.println("❌ Error fetching active challenges: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/challenge-participants/artist/{artistId}")
    public ResponseEntity<List<ChallengeParticipationDTO>> getArtistParticipations(
            @PathVariable Long artistId,
            @RequestHeader("Authorization") String authHeader) {

        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long tokenUserId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            // Verify user has artist role and is accessing their own data
            if (!"artist".equals(role) || !tokenUserId.equals(artistId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<ChallengeParticipationDTO> participations
                    = challengeParticipationService.getArtistParticipations(artistId);

            return ResponseEntity.ok(participations);
        } catch (Exception e) {
            System.err.println("❌ Error fetching artist participations: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/challenge-participants/submit")
    public ResponseEntity<Map<String, Object>> submitChallengeParticipation(
            @RequestParam("challengeId") Long challengeId,
            @RequestParam("artworkTitle") String artworkTitle,
            @RequestParam("artworkDescription") String artworkDescription,
            @RequestParam("artworkImage") MultipartFile artworkImage,
            @RequestHeader("Authorization") String authHeader) {

        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long artistId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            // Verify user has artist role
            if (!"artist".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied. Artist role required."));
            }

            // Validate input
            if (challengeId == null || artworkTitle == null || artworkTitle.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Challenge ID and artwork title are required"));
            }

            if (artworkImage == null || artworkImage.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Artwork image is required"));
            }

            // Submit participation
            Long participationId = challengeParticipationService.submitParticipation(
                    challengeId, artistId, artworkTitle, artworkDescription, artworkImage
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("participationId", participationId);
            response.put("message", "Successfully submitted artwork for challenge");

            return ResponseEntity.ok(response);

        } catch (IllegalStateException e) {
            // Artist already participated
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            // Invalid challenge
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error submitting challenge participation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit challenge participation"));
        }
    }

    @GetMapping("/challenge-participants/check/{challengeId}")
    public ResponseEntity<Map<String, Object>> checkParticipation(
            @PathVariable Long challengeId,
            @RequestHeader("Authorization") String authHeader) {

        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long artistId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            // Verify user has artist role
            if (!"artist".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            boolean hasParticipated = challengeParticipationService.checkParticipation(challengeId, artistId);

            return ResponseEntity.ok(Map.of("hasParticipated", hasParticipated));
        } catch (Exception e) {
            System.err.println("❌ Error checking participation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/challenges/{challengeId}")
    public ResponseEntity<ChallengeDTO> getChallengeDetails(@PathVariable Long challengeId) {
        try {
            ChallengeDTO challenge = challengeParticipationService.getChallengeDetails(challengeId);

            if (challenge == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(challenge);
        } catch (Exception e) {
            System.err.println("❌ Error fetching challenge details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
