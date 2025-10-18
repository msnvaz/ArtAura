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
        String currentDir = System.getProperty("user.dir");
        System.out.println("Current working directory: " + currentDir);

        // Calculate the correct path to client/public/uploads using robust detection
        String projectRoot;
        if (currentDir.contains("ArtAura2")) {
            // Extract everything up to and including ArtAura2
            int artAuraIndex = currentDir.indexOf("ArtAura2");
            projectRoot = currentDir.substring(0, artAuraIndex + 8) + File.separator; // 8 is length of "ArtAura2"
        } else if (currentDir.contains("server" + File.separator + "artaura")) {
            // We're in server/artaura, need to go up two levels to project root
            projectRoot = currentDir.substring(0, currentDir.lastIndexOf("server" + File.separator + "artaura"));
        } else if (currentDir.endsWith("artaura")) {
            // Fallback: if just in artaura directory
            projectRoot = currentDir.substring(0, currentDir.lastIndexOf("artaura"));
        } else {
            // Fallback: assume we're already in project root
            projectRoot = currentDir + File.separator;
        }

        String uploadDirPath = projectRoot + "client" + File.separator + "public" + File.separator + "uploads"
                + File.separator + "profiles" + File.separator;
        System.out.println("Upload directory path: " + uploadDirPath);

        // Create upload directory if it doesn't exist
        File uploadDir = new File(uploadDirPath);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            System.out.println("Created upload directory: " + created + " at " + uploadDirPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID().toString() + extension;
        String relativePath = "/uploads/profiles/" + filename;

        // Save file
        Path filePath = Paths.get(uploadDirPath + filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        System.out.println("File saved to: " + filePath.toAbsolutePath());
        System.out.println("Returning relative path: " + relativePath);
        return relativePath;
    }

    public void deleteImage(String imagePath) {
        try {
            if (imagePath != null && !imagePath.isEmpty()) {
                String currentDir = System.getProperty("user.dir");

                // Use the same robust path calculation logic as saveImage
                String projectRoot;
                if (currentDir.contains("ArtAura2")) {
                    // Extract everything up to and including ArtAura2
                    int artAuraIndex = currentDir.indexOf("ArtAura2");
                    projectRoot = currentDir.substring(0, artAuraIndex + 8) + File.separator; // 8 is length of "ArtAura2"
                } else if (currentDir.contains("server" + File.separator + "artaura")) {
                    projectRoot = currentDir.substring(0, currentDir.lastIndexOf("server" + File.separator + "artaura"));
                } else if (currentDir.endsWith("artaura")) {
                    projectRoot = currentDir.substring(0, currentDir.lastIndexOf("artaura"));
                } else {
                    projectRoot = currentDir + File.separator;
                }

                // Convert URL path back to file path for client/public/uploads
                String filePath = imagePath.replace("/uploads/", projectRoot + "client" + File.separator + "public"
                        + File.separator + "uploads" + File.separator);
                Path path = Paths.get(filePath);
                boolean deleted = Files.deleteIfExists(path);
                System.out.println("Deleted file: " + deleted + " at " + path.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("Failed to delete image: " + imagePath);
            e.printStackTrace();
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
