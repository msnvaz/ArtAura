package com.artaura.artaura.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class ImageUploadController {

    // Directory to save uploaded images - absolute path to
    // client/public/uploads/products
    private static final String UPLOAD_DIR = "D:/Artaura/ArtAura/client/public/uploads/products/";

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();

        try {
            System.out.println("📤 Image upload request received");
            System.out.println("📁 Upload directory: " + UPLOAD_DIR);

            // Validate file
            if (file.isEmpty()) {
                response.put("error", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file type
            String contentType = file.getContentType();
            System.out.println("📝 File content type: " + contentType);
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("error", "Only image files are allowed");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("error", "File size must be less than 5MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Create upload directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                System.out.println("📂 Creating upload directory: " + UPLOAD_DIR);
                boolean created = uploadDir.mkdirs();
                System.out.println("✅ Directory created: " + created);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            System.out.println("🆔 Generated filename: " + uniqueFilename);

            // Save file
            Path filePath = Paths.get(UPLOAD_DIR + uniqueFilename);
            System.out.println("💾 Saving file to: " + filePath.toAbsolutePath());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("✅ File saved successfully");

            // Return only the relative path for database storage (works on any computer)
            String relativePath = "/uploads/products/" + uniqueFilename;

            System.out.println("� Relative path for database: " + relativePath);

            response.put("imageUrl", relativePath); // For both frontend display and database storage
            response.put("message", "Image uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println("❌ Error uploading image: " + e.getMessage());
            e.printStackTrace();
            response.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/image")
    public ResponseEntity<Map<String, String>> deleteImage(@RequestParam("imageUrl") String imageUrl) {
        Map<String, String> response = new HashMap<>();

        try {
            // Extract filename from URL
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(UPLOAD_DIR + filename);

            // Delete file if it exists
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                response.put("message", "Image deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Image not found");
                return ResponseEntity.notFound().build();
            }

        } catch (IOException e) {
            response.put("error", "Failed to delete image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
