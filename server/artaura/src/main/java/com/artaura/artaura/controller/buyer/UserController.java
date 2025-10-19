package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.dto.exhibition.UserProfileDTO;
import com.artaura.artaura.dto.exhibition.ChangePasswordRequest;
import com.artaura.artaura.service.buyer.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable Long userId) {
        UserProfileDTO profile = userService.getUserProfileById(userId);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    @PutMapping(value = "/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserProfileDTO> updateUserProfile(
            @PathVariable Long userId,
            @RequestPart("profile") String profileJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        UserProfileDTO updatedProfile = objectMapper.readValue(profileJson, UserProfileDTO.class);
        String imagePath = null;
        
        if (imageFile != null && !imageFile.isEmpty()) {
            // Manual file handling - save to ArtAura/client/public/uploads/buyer directory
            String currentDir = System.getProperty("user.dir");
            System.out.println("Current working directory: " + currentDir);
            
            // Explicitly construct path to ArtAura/client (NOT server/client)
            // Find the ArtAura root directory
            String artAuraRoot;
            if (currentDir.contains("ArtAura")) {
                artAuraRoot = currentDir.substring(0, currentDir.indexOf("ArtAura") + "ArtAura".length()) + File.separator;
            } else {
                // Fallback - assume we're in a subdirectory of ArtAura
                artAuraRoot = "C:" + File.separator + "Users" + File.separator + "aaa" + File.separator + "Desktop" + File.separator + "ArtAura" + File.separator;
            }
            
            System.out.println("ArtAura root: " + artAuraRoot);

            // Build path to main client folder (not server/client)
            String uploadDir = artAuraRoot + "client" + File.separator + "public" + File.separator + "uploads" + File.separator + "buyer" + File.separator;
            System.out.println("Target upload directory: " + uploadDir);
            
            String fileName = "profile_" + userId + "_" + System.currentTimeMillis() + ".jpg";
            File dest = new File(uploadDir + fileName);
            
            // Create directory if it doesn't exist
            if (!dest.getParentFile().exists()) {
                boolean created = dest.getParentFile().mkdirs();
                System.out.println("Created directory: " + created + " at " + dest.getParentFile().getAbsolutePath());
            }
            
            imageFile.transferTo(dest);
            // Store the full Windows path instead of relative URL
            imagePath = dest.getAbsolutePath();
            updatedProfile.setImage(imagePath);
            
            System.out.println("File saved to: " + dest.getAbsolutePath());
            System.out.println("Full path stored in database: " + imagePath);
        }
        
        UserProfileDTO profile = userService.updateUserProfile(userId, updatedProfile);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request) {
        boolean success = userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        if (success) {
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect");
        }
    }

    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<?> deactivateAccount(@PathVariable Long userId) {
        System.out.println("Deactivate endpoint called for userId: " + userId);
        boolean success = userService.deactivateAccount(userId);
        if (success) {
            return ResponseEntity.ok("Account deactivated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to deactivate account");
        }
    }
}
