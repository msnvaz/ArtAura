package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.dto.exhibition.UserProfileDTO;
import com.artaura.artaura.dto.exhibition.ExhibitionPostDTO;
import com.artaura.artaura.service.buyer.UserService;
import com.artaura.artaura.service.buyer.ExhibitionPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.artaura.artaura.util.JwtUtil;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/buyer/exhibitions")
public class ExhibitionPostController {
    @Autowired
    private ExhibitionPostService exhibitionPostService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createExhibition(@RequestBody ExhibitionPostDTO post, @RequestHeader("Authorization") String tokenHeader) {
        // Extract JWT token from header
        String token = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7).trim() : tokenHeader.trim();
        Long userId = jwtUtil.extractUserId(token);
        exhibitionPostService.saveExhibition(post, userId);
        // Fetch the latest post (assuming auto-increment ID)
        List<ExhibitionPostDTO> allPosts = exhibitionPostService.getAllExhibitions();
        ExhibitionPostDTO latestPost = allPosts.get(allPosts.size() - 1); // or fetch by ID if available
        return ResponseEntity.ok(latestPost);
    }

    @GetMapping
    public ResponseEntity<List<ExhibitionPostDTO>> getAllExhibitions() {
        List<ExhibitionPostDTO> exhibitions = exhibitionPostService.getAllExhibitions();
        return ResponseEntity.ok(exhibitions);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ExhibitionPostDTO>> getAllExhibitionsFromBackend() {
        List<ExhibitionPostDTO> exhibitions = exhibitionPostService.getAllExhibitions();
        return ResponseEntity.ok(exhibitions);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<ExhibitionPostDTO> getExhibitionById(@PathVariable Long id) {
    //     ExhibitionPostDTO exhibition = exhibitionPostService.getExhibitionById(id);
    //     return ResponseEntity.ok(exhibition);
    // }
}