package com.artaura.artaura.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageUploadService {

    public String saveImage(MultipartFile file, String imageType, Long artistId) throws IOException {
        // Get the current working directory
        String currentDir = System.getProperty("user.dir");

        // Calculate the correct path to project root
        String projectRoot;
        if (currentDir.contains("ArtAura")) {
            // Extract everything up to and including ArtAura
            int artAuraIndex = currentDir.indexOf("ArtAura");
            projectRoot = currentDir.substring(0, artAuraIndex + 7); // 7 is length of "ArtAura"
        } else {
            // Fallback: assume we're already in project root
            projectRoot = currentDir;
        }

        // Build the upload directory path to client/public/nic
        String uploadDirPath = projectRoot + File.separator + "client" + File.separator + "public" + File.separator + "nic" + File.separator;

        // Create upload directory if it doesn't exist
        File uploadDir = new File(uploadDirPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf('.')) : ".jpg";

        String filename = artistId + "_" + imageType + "_" + System.currentTimeMillis() + extension;

        // Save file
        Path filePath = Paths.get(uploadDirPath + filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path for database storage
        String relativePath = "/nic/" + filename;

        return relativePath;
    }

    public void deleteImage(String imagePath) {
        try {
            if (imagePath != null && !imagePath.isEmpty()) {
                String currentDir = System.getProperty("user.dir");

                // Calculate the correct path to project root
                String projectRoot;
                if (currentDir.contains("ArtAura")) {
                    int artAuraIndex = currentDir.indexOf("ArtAura");
                    projectRoot = currentDir.substring(0, artAuraIndex + 7);
                } else {
                    projectRoot = currentDir;
                }

                // Convert URL path back to file path
                // If imagePath is "/nic/filename.jpg", extract just the filename
                String filename = imagePath.substring(imagePath.lastIndexOf('/') + 1);
                String filePath = projectRoot + File.separator + "client" + File.separator + "public" + File.separator + "nic" + File.separator + filename;
                
                Path path = Paths.get(filePath);
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            System.err.println("Failed to delete image: " + imagePath);
        }
    }

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

    public boolean isFileSizeValid(MultipartFile file) {
        // Max file size: 5MB
        long maxSize = 5 * 1024 * 1024;
        return file.getSize() <= maxSize;
    }
}