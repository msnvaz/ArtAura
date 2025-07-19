package com.artaura.artaura.controller;

import com.artaura.artaura.dto.achievement.AchievementCreateDTO;
import com.artaura.artaura.dto.achievement.AchievementResponseDTO;
import com.artaura.artaura.dto.achievement.AchievementUpdateDTO;
import com.artaura.artaura.service.AchievementService;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:5173")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<AchievementResponseDTO>> getAchievementsByArtist(@PathVariable Long artistId) {
        try {
            List<AchievementResponseDTO> achievements = achievementService.getAchievementsByArtist(artistId);
            return ResponseEntity.ok(achievements);
        } catch (Exception e) {
            System.err.println("Error fetching achievements for artist " + artistId + ": " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{achievementId}")
    public ResponseEntity<AchievementResponseDTO> getAchievementById(@PathVariable Long achievementId) {
        try {
            AchievementResponseDTO achievement = achievementService.getAchievementById(achievementId);
            if (achievement != null) {
                return ResponseEntity.ok(achievement);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error fetching achievement " + achievementId + ": " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createAchievement(@RequestBody AchievementCreateDTO dto, HttpServletRequest request) {
        try {
            System.out.println("Received achievement creation request: " + dto.getTitle());
            
            // Extract userId from JWT token
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            if (token == null) {
                System.err.println("No token provided in request");
                return ResponseEntity.status(401).body("Missing token");
            }
            
            Long artistId;
            try {
                jwtUtil.validateToken(token);
                artistId = jwtUtil.extractUserId(token);
                System.out.println("Extracted artist ID: " + artistId);
            } catch (Exception e) {
                System.err.println("Token validation failed: " + e.getMessage());
                return ResponseEntity.status(401).body("Invalid token");
            }

            // Set the artist ID and creation timestamp
            dto.setArtistId(artistId);
            dto.setCreatedAt(LocalDateTime.now());

            System.out.println("Creating achievement for artist: " + artistId);
            achievementService.createAchievement(dto);
            System.out.println("Achievement created successfully");
            
            return ResponseEntity.ok("Achievement created successfully");

        } catch (Exception e) {
            System.err.println("Error creating achievement: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating achievement: " + e.getMessage());
        }
    }

    @PutMapping("/{achievementId}")
    public ResponseEntity<String> updateAchievement(
            @PathVariable Long achievementId,
            @RequestBody AchievementUpdateDTO dto,
            HttpServletRequest request
    ) {
        try {
            // Extract userId from JWT token for authorization
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            if (token == null) {
                return ResponseEntity.status(401).body("Missing token");
            }
            
            try {
                jwtUtil.validateToken(token);
            } catch (Exception e) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            dto.setAchievementId(achievementId);
            achievementService.updateAchievement(dto);
            return ResponseEntity.ok("Achievement updated successfully");

        } catch (Exception e) {
            System.err.println("Error updating achievement: " + e.getMessage());
            return ResponseEntity.status(500).body("Error updating achievement: " + e.getMessage());
        }
    }

    @DeleteMapping("/{achievementId}")
    public ResponseEntity<String> deleteAchievement(@PathVariable Long achievementId, HttpServletRequest request) {
        try {
            // Extract userId from JWT token for authorization
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            if (token == null) {
                return ResponseEntity.status(401).body("Missing token");
            }
            
            try {
                jwtUtil.validateToken(token);
            } catch (Exception e) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            achievementService.deleteAchievement(achievementId);
            return ResponseEntity.ok("Achievement deleted successfully");

        } catch (Exception e) {
            System.err.println("Error deleting achievement: " + e.getMessage());
            return ResponseEntity.status(500).body("Error deleting achievement: " + e.getMessage());
        }
    }
}
