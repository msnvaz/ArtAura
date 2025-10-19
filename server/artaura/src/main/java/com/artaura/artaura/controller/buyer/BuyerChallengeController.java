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

    @PostMapping("/submissions/{submissionId}/vote")
    public ResponseEntity<?> voteForSubmission(
            @PathVariable Long submissionId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);
            
            // Log the request for debugging
            System.out.println("Vote request - User ID: " + userId + ", Role: " + role + ", Submission ID: " + submissionId);
            
            // Verify user has buyer role (only buyers can vote)
            if (!"buyer".equals(role)) {
                System.out.println("Access denied - User role: " + role + " is not authorized to vote");
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", "Only buyers can vote on submissions"
                ));
            }

            // Verify the submission exists before voting
            List<ChallengeSubmissionDTO> submissions = challengeService.getSubmissionsByChallenge(
                submissionId.intValue(), userId, role);
            
            boolean voteResult = challengeService.toggleVote(submissionId, userId);
            String message = voteResult ? "Vote added successfully" : "Vote removed successfully";
            
            System.out.println("Vote result: " + message + " for submission " + submissionId + " by user " + userId);
            
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", message,
                "voted", voteResult
            ));
        } catch (Exception e) {
            System.err.println("Error in voteForSubmission: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error processing vote: " + e.getMessage()
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

    @GetMapping("/submissions/{submissionId}/vote-status")
    public ResponseEntity<?> getVoteStatus(
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

            boolean hasVoted = challengeService.hasUserVoted(submissionId, userId);
            int totalVotes = challengeService.getSubmissionVoteCount(submissionId);
            
            return ResponseEntity.ok().body(Map.of(
                "hasVoted", hasVoted,
                "totalVotes", totalVotes
            ));
        } catch (Exception e) {
            System.err.println("Error in getVoteStatus: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
