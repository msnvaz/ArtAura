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
            // Use client/public/uploads directory
            String currentDir = System.getProperty("user.dir");
            String projectRoot = currentDir.endsWith("artaura")
                    ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                    : currentDir + File.separator;

            String uploadDir = projectRoot + "client" + File.separator + "public" + File.separator + "uploads" + File.separator;
            String fileName = "profile_" + userId + "_" + System.currentTimeMillis() + ".jpg";
            File dest = new File(uploadDir + fileName);
            dest.getParentFile().mkdirs(); // Ensure directory exists
            imageFile.transferTo(dest);
            imagePath = "/uploads/" + fileName;
            updatedProfile.setImage(imagePath);
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
