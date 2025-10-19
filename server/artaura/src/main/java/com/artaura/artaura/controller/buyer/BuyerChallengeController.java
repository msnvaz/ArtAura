package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.dto.buyer.ChallengeSubmissionDTO;
import com.artaura.artaura.service.buyer.BuyerChallengeService;
import com.artaura.artaura.dto.buyer.ChallengeDTO;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/buyer/challenges")
public class BuyerChallengeController {
    @Autowired
    private BuyerChallengeService challengeService;

    @Autowired
    private JwtUtil jwtUtil;

    // Get all active challenges for buyers (requires authentication)
    @GetMapping("/active")
    public ResponseEntity<List<ChallengeDTO>> getActiveChallenges(@RequestHeader("Authorization") String authHeader) {
        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Verify user has buyer role
            if (!"buyer".equals(role)) {
                return ResponseEntity.status(403).build();
            }

            List<ChallengeDTO> challenges = challengeService.getActiveChallenges();
            return ResponseEntity.ok(challenges);
        } catch (Exception e) {
            System.err.println("Error in getActiveChallenges: " + e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/{challengeId}/submissions")
    public ResponseEntity<List<ChallengeSubmissionDTO>> getChallengeSubmissions(
            @PathVariable Integer challengeId,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestHeader("Authorization") String authHeader) {

        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Verify user has buyer role
            if (!"buyer".equals(role)) {
                return ResponseEntity.status(403).build();
            }

            List<ChallengeSubmissionDTO> submissions = challengeService
                    .getSubmissionsByChallengeWithSort(challengeId, userId, role, sortBy);

            return ResponseEntity.ok(submissions);

        } catch (Exception e) {
            System.err.println("Error in getChallengeSubmissions: " + e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/{challengeId}/submissions/count")
    public ResponseEntity<Integer> getSubmissionsCount(
            @PathVariable Integer challengeId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Verify user has buyer role
            if (!"buyer".equals(role)) {
                return ResponseEntity.status(403).build();
            }

            List<ChallengeSubmissionDTO> submissions = challengeService
                    .getSubmissionsByChallenge(challengeId, userId, role);
            return ResponseEntity.ok(submissions.size());
        } catch (Exception e) {
            System.err.println("Error in getSubmissionsCount: " + e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/submissions/{submissionId}/like-dislike")
    public ResponseEntity<?> likeDislikeSubmission(
            @PathVariable Long submissionId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Log the request for debugging
            System.out.println("Like/Dislike request - User ID: " + userId + ", Role: " + role + ", Submission ID: " + submissionId);
            
            // Verify user has buyer role (only buyers can react to submissions)
            if (!"buyer".equals(role)) {
                System.out.println("Access denied - User role: " + role + " is not authorized to react");
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", "Only buyers can react to submissions"
                ));
            }

            String action = request.get("action");
            if (!"like".equals(action) && !"dislike".equals(action)) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "message", "Invalid action. Must be 'like' or 'dislike'"
                ));
            }

            Map<String, Object> result = challengeService.handleLikeDislike(submissionId, userId, action);
            
            System.out.println("Like/Dislike result: " + result.get("message") + " for submission " + submissionId + " by user " + userId);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error in likeDislikeSubmission: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error processing reaction: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/submissions/{submissionId}/likes")
    public ResponseEntity<?> getSubmissionLikes(
            @PathVariable Long submissionId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Verify user has buyer role
            if (!"buyer".equals(role)) {
                return ResponseEntity.status(403).build();
            }

            Map<String, Object> likesData = challengeService.getSubmissionLikes(submissionId, userId);
            
            return ResponseEntity.ok(likesData);
        } catch (Exception e) {
            System.err.println("Error in getSubmissionLikes: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "likes", 0,
                "dislikes", 0,
                "userReaction", null
            ));
        }
    }

    @GetMapping("/{challengeId}")
    public ResponseEntity<ChallengeDTO> getChallengeById(
            @PathVariable Long challengeId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Verify user has buyer role
            if (!"buyer".equals(role)) {
                return ResponseEntity.status(403).build();
            }

            ChallengeDTO challenge = challengeService.getChallengeByIdWithCounts(challengeId);
            if (challenge != null) {
                return ResponseEntity.ok(challenge);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error in getChallengeById: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
