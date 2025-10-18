package com.artaura.artaura.controller;

import com.artaura.artaura.dto.signup.ArtistSignupRequest;
import com.artaura.artaura.dto.artist.ArtistProfileResponseDTO;
import com.artaura.artaura.dto.artist.ArtistProfileUpdateDTO;
import com.artaura.artaura.service.ArtistService;
import com.artaura.artaura.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/artist")
@CrossOrigin(origins = "http://localhost:5173")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @RequestPart("artist") ArtistSignupRequest req,
            @RequestPart(value = "nicImage", required = true) MultipartFile nicImageFile) {
        artistService.register(req, nicImageFile);
        return ResponseEntity.ok("Artist registered successfully");
    }

    @GetMapping("/profile/{artistId}")
    public ResponseEntity<ArtistProfileResponseDTO> getProfile(@PathVariable("artistId") Long artistId) {
        Optional<ArtistProfileResponseDTO> profile = artistService.getProfile(artistId);
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        } else {
            throw new CustomException("Artist profile not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/profile/{artistId}")
    public ResponseEntity<String> updateProfile(@PathVariable("artistId") Long artistId,
            @RequestBody ArtistProfileUpdateDTO updateDTO) {
        try {
            artistService.updateProfile(artistId, updateDTO);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (CustomException e) {
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update profile: " + e.getMessage());
        }
    }

    @PostMapping("/profile/{artistId}/avatar")
    public ResponseEntity<?> uploadAvatar(@PathVariable("artistId") Long artistId,
            @RequestParam("image") MultipartFile imageFile) {
        try {
            System.out.println("Received avatar upload request for artist: " + artistId);
            System.out.println("File details - Name: " + imageFile.getOriginalFilename()
                    + ", Size: " + imageFile.getSize()
                    + ", Type: " + imageFile.getContentType());

            String imageUrl = artistService.updateAvatarImage(artistId, imageFile);
            System.out.println("Avatar upload successful. Image URL: " + imageUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Avatar updated successfully");
            response.put("imageUrl", imageUrl);

            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            System.err.println("Custom exception during avatar upload: " + e.getMessage());
            return ResponseEntity.status(e.getStatus()).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Exception during avatar upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload avatar: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/{artistId}/cover")
    public ResponseEntity<?> uploadCoverImage(@PathVariable("artistId") Long artistId,
            @RequestParam("image") MultipartFile imageFile) {
        try {
            String imageUrl = artistService.updateCoverImage(artistId, imageFile);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cover image updated successfully");
            response.put("imageUrl", imageUrl);

            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            return ResponseEntity.status(e.getStatus()).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload cover image: " + e.getMessage()));
        }
    }
}