package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.service.buyer.BArtistService;
import com.artaura.artaura.dto.buyer.ArtistListDTO;
import com.artaura.artaura.dto.artist.ArtistProfileResponseDTO;
import com.artaura.artaura.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/buyer/artists")
public class BuyerArtistController {

    @Autowired
    private BArtistService artistService;

    @Autowired
    private ArtistService artistProfileService;

    @GetMapping("/list")
    public ResponseEntity<List<ArtistListDTO>> getAllArtistsForList() {
        List<ArtistListDTO> artists = artistService.getAllArtistsForList();
        return ResponseEntity.ok(artists);
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Map<String, Object>> followArtist(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = artistService.followArtist(id, token);
            response.put("success", success);
            response.put("message", success ? "Successfully followed artist" : "Already following this artist");
            response.put("isFollowing", success);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to follow artist: " + e.getMessage());
            response.put("isFollowing", false);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}/unfollow")
    public ResponseEntity<Map<String, Object>> unfollowArtist(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = artistService.unfollowArtist(id, token);
            response.put("success", success);
            response.put("message", success ? "Successfully unfollowed artist" : "Not following this artist");
            response.put("isFollowing", false);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to unfollow artist: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}/follow-status")
    public ResponseEntity<Map<String, Object>> getFollowStatus(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean isFollowing = artistService.isFollowing(id, token);
            response.put("isFollowing", isFollowing);
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("isFollowing", false);
            response.put("success", false);
            response.put("message", "Failed to check follow status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{artistId}/profile")
    public ResponseEntity<ArtistProfileResponseDTO> getPublicArtistProfile(@PathVariable Long artistId) {
        try {
            Optional<ArtistProfileResponseDTO> profileOpt = artistProfileService.getProfile(artistId);
            if (profileOpt.isPresent()) {
                return ResponseEntity.ok(profileOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
