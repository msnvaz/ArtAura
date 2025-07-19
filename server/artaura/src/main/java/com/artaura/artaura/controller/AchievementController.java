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

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<AchievementResponseDTO>> getAchievementsByArtist(@PathVariable Long artistId) {
        List<AchievementResponseDTO> achievements = achievementService.getAchievementsByArtist(artistId);
        return ResponseEntity.ok(achievements);
    }

    @GetMapping("/{achievementId}")
    public ResponseEntity<AchievementResponseDTO> getAchievementById(@PathVariable Long achievementId) {
        AchievementResponseDTO achievement = achievementService.getAchievementById(achievementId);
        if (achievement != null) {
            return ResponseEntity.ok(achievement);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createAchievement(@RequestBody AchievementCreateDTO dto, HttpServletRequest request) {
        try {
            // Extract userId from JWT token
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (token == null) {
                return ResponseEntity.status(401).body("Missing token");
            }

            Long artistId;
            try {
                jwtUtil.validateToken(token);
                artistId = jwtUtil.extractUserId(token);
            } catch (Exception e) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            dto.setArtistId(artistId);
            dto.setCreatedAt(LocalDateTime.now());

            achievementService.createAchievement(dto);
            return ResponseEntity.ok("Achievement created successfully");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating achievement: " + e.getMessage());
        }
    }

    @PutMapping("/{achievementId}")
    public ResponseEntity<String> updateAchievement(
            @PathVariable Long achievementId,
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("achievement_date") String achievementDate,
            @RequestParam(value = "prize", required = false) String prize,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "icon_type", defaultValue = "award") String iconType,
            @RequestParam(value = "color_scheme", defaultValue = "gold") String colorScheme,
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

            AchievementUpdateDTO dto = new AchievementUpdateDTO();
            dto.setAchievementId(achievementId);
            dto.setTitle(title);
            dto.setType(type);
            dto.setAchievementDate(java.time.LocalDate.parse(achievementDate));
            dto.setPrize(prize);
            dto.setDescription(description);
            dto.setIconType(iconType);
            dto.setColorScheme(colorScheme);

            achievementService.updateAchievement(dto);
            return ResponseEntity.ok("Achievement updated successfully");

        } catch (Exception e) {
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
            return ResponseEntity.status(500).body("Error deleting achievement: " + e.getMessage());
        }
    }
}
