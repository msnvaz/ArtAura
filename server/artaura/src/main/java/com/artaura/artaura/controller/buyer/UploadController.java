package com.artaura.artaura.controller.buyer;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // Fix path calculation to save in correct ArtAura/client directory
            String currentDir = System.getProperty("user.dir");
            String projectRoot;
            
            // Properly locate ArtAura root directory
            if (currentDir.contains("ArtAura")) {
                // Extract path up to and including ArtAura
                int artAuraIndex = currentDir.indexOf("ArtAura");
                projectRoot = currentDir.substring(0, artAuraIndex + 7) + File.separator; // 7 = "ArtAura".length()
            } else {
                // Fallback to explicit path
                projectRoot = "C:" + File.separator + "Users" + File.separator + "aaa" + File.separator + "Desktop" + File.separator + "ArtAura" + File.separator;
            }

            // Save to main client/public/uploads directory (NOT uploads/buyer)
            String uploadDir = projectRoot + "client" + File.separator + "public" + File.separator + "uploads" + File.separator;
            Files.createDirectories(Paths.get(uploadDir));
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            File dest = new File(uploadDir + fileName);
            imageFile.transferTo(dest);

            // Return the full Windows path as requested
            String imageUrl = dest.getAbsolutePath();
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image"));
        }
    }
}
