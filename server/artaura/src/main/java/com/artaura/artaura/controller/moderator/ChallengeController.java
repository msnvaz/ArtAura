
package com.artaura.artaura.controller.moderator;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.dto.moderator.ChallengeListDTO;
import com.artaura.artaura.service.moderator.ChallengeService;
import com.artaura.artaura.util.JwtUtil;

@RestController
@RequestMapping("/api/challenges")
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
        String token = authHeader.replace("Bearer ", "");
        Long moderatorId = jwtUtil.extractUserId(token);
        challengeService.createChallenge(challengeDTO, moderatorId != null ? moderatorId.toString() : null);
        return ResponseEntity.ok("Challenge created successfully");
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
}