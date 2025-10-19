package com.artaura.artaura.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class CentralizedUploadService {

    /**
     * Save uploaded file to client/public/uploads directory This ensures all
     * images are accessible via the web server
     */
    public String saveImageToPublicUploads(MultipartFile file, String subDirectory, String prefix) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        // Validate image file
        if (!isValidImageFile(file)) {
            throw new IllegalArgumentException("Invalid image file type. Only JPEG, PNG, GIF, and WebP are allowed.");
        }

        if (!isFileSizeValid(file)) {
            throw new IllegalArgumentException("File size too large. Maximum size is 5MB.");
        }

        // Get the project root directory (parent of server folder or artaura folder)
        String currentDir = System.getProperty("user.dir");
        String projectRoot;

        if (currentDir.endsWith("artaura")) {
            // If running from artaura folder, go up two levels to get project root
            projectRoot = currentDir.substring(0, currentDir.lastIndexOf("artaura"));
        } else if (currentDir.contains("server")) {
            // If running from server folder or any subfolder, go up to project root
            int serverIndex = currentDir.indexOf("server");
            projectRoot = currentDir.substring(0, serverIndex);
        } else {
            // Fallback: assume we're already in project root
            projectRoot = currentDir + File.separator;
        }

        System.out.println("Current working directory: " + currentDir);
        System.out.println("Calculated project root: " + projectRoot);

        // Build the upload path: projectRoot/client/public/uploads/subDirectory/
        String uploadDirPath = projectRoot + "client" + File.separator + "public" + File.separator + "uploads" + File.separator;
        if (subDirectory != null && !subDirectory.trim().isEmpty()) {
            uploadDirPath += subDirectory + File.separator;
        }

        System.out.println("Upload directory path: " + uploadDirPath);

        // Create upload directory if it doesn't exist
        File uploadDir = new File(uploadDirPath);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            System.out.println("Created upload directory: " + created + " at " + uploadDirPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf('.')) : ".jpg";

        String filename = (prefix != null ? prefix + "_" : "") + System.currentTimeMillis() + extension;
        System.out.println("Generated filename: " + filename);

        // Save file
        Path filePath = Paths.get(uploadDirPath + filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("File saved to: " + filePath.toAbsolutePath());

        // Return relative path for database storage and frontend access
        String relativePath = "/uploads/" + (subDirectory != null && !subDirectory.trim().isEmpty() ? subDirectory + "/" : "") + filename;
        System.out.println("Returning relative path: " + relativePath);

        return relativePath;
    }

    /**
     * Delete image from client/public/uploads directory
     */
    public void deleteImageFromPublicUploads(String imagePath) {
        try {
            if (imagePath != null && !imagePath.isEmpty()) {
                String currentDir = System.getProperty("user.dir");
                String projectRoot = currentDir.endsWith("artaura")
                        ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                        : currentDir + File.separator;

                // Convert URL path back to file path
                String filePath = imagePath.replace("/uploads/", projectRoot + "client" + File.separator + "public" + File.separator + "uploads" + File.separator);
                Path path = Paths.get(filePath);
                boolean deleted = Files.deleteIfExists(path);
                System.out.println("Deleted file: " + deleted + " at " + path.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("Failed to delete image: " + imagePath);
            e.printStackTrace();
        }
    }

    /**
     * Validate image file type
     */
    public boolean isValidImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        return contentType != null && (contentType.equals("image/jpeg")
                || contentType.equals("image/jpg")
                || contentType.equals("image/png")
                || contentType.equals("image/gif")
                || contentType.equals("image/webp"));
    }

    /**
     * Validate file size (max 5MB)
     */
    public boolean isFileSizeValid(MultipartFile file) {
        // Max file size: 5MB
        long maxSize = 5 * 1024 * 1024;
        return file.getSize() <= maxSize;
    }

    /**
     * Convenience method for artwork uploads
     */
    public String saveArtworkImage(MultipartFile file, Long artistId) throws IOException {
        return saveImageToPublicUploads(file, "artworks", "artwork_" + artistId);
    }

    /**
     * Convenience method for profile picture uploads
     */
    public String saveProfileImage(MultipartFile file, Long userId, String userType) throws IOException {
        return saveImageToPublicUploads(file, "profiles", userType + "_" + userId);
    }

    /**
     * Convenience method for cover image uploads
     */
    public String saveCoverImage(MultipartFile file, Long artistId) throws IOException {
        return saveImageToPublicUploads(file, "covers", "cover_" + artistId);
    }

    /**
     * Convenience method for post images
     */
    public String savePostImage(MultipartFile file, Long userId) throws IOException {
        return saveImageToPublicUploads(file, "posts", "post_" + userId);
    }

    /**
     * Convenience method for general uploads (no subdirectory)
     */
    public String saveGeneralImage(MultipartFile file, String prefix) throws IOException {
        return saveImageToPublicUploads(file, null, prefix);
    }
}
