package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.dto.exhibition.ExhibitionPostDTO;
import com.artaura.artaura.service.buyer.ExhibitionPostService;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyer/exhibitions")
public class ExhibitionPostController {
    @Autowired
    private ExhibitionPostService exhibitionPostService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ExhibitionPostDTO> createExhibition(@RequestBody ExhibitionPostDTO post, @RequestHeader("Authorization") String tokenHeader) {
        // Extract JWT token from header
        String token = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7).trim() : tokenHeader.trim();
        Long userId = jwtUtil.extractUserId(token);
        exhibitionPostService.saveExhibition(post, userId);
        // Fetch the latest post (assuming auto-increment ID)
        List<ExhibitionPostDTO> allPosts = exhibitionPostService.getAllExhibitions();
        ExhibitionPostDTO latestPost = allPosts.isEmpty() ? null : allPosts.get(allPosts.size() - 1); // or fetch by ID if available
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExhibitionPostDTO>> getPostsByUser(@PathVariable Long userId) {
        List<ExhibitionPostDTO> posts = exhibitionPostService.getExhibitionsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updateExhibitionPost(
            @PathVariable Long postId,
            @RequestBody ExhibitionPostDTO postDTO,
            @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7).trim() : tokenHeader.trim();
        Long userId = jwtUtil.extractUserId(token);
        ExhibitionPostDTO updated = exhibitionPostService.updateExhibitionPost(postId, postDTO, userId);
        if (updated == null) {
            return ResponseEntity.status(404).body("Post not found or not editable");
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deleteExhibitionPost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7).trim() : tokenHeader.trim();
        Long userId = jwtUtil.extractUserId(token);
        boolean deleted = exhibitionPostService.deleteExhibitionPost(postId, userId);
        if (!deleted) {
            return ResponseEntity.status(404).body("Post not found or not deletable");
        }
        return ResponseEntity.ok("Post deleted successfully");
    }
}