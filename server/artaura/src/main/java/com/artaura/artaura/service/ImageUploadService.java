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
        // Get the current working directory and print it for debugging
        String currentDir = System.getProperty("user.dir");
        System.out.println("Current working directory: " + currentDir);

        // Use absolute path from project root
        String projectRoot = currentDir.endsWith("artaura")
                ? currentDir.substring(0, currentDir.lastIndexOf("artaura")) : currentDir;

        String uploadDirPath = projectRoot + "uploads" + File.separator + "profiles" + File.separator;
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

        String filename = artistId + "_" + imageType + "_" + System.currentTimeMillis() + extension;
        System.out.println("Generated filename: " + filename);

        // Save file
        Path filePath = Paths.get(uploadDirPath + filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("File saved to: " + filePath.toAbsolutePath());

        // Return relative path for database storage
        String relativePath = "/uploads/profiles/" + filename;
        System.out.println("Returning relative path: " + relativePath);

        return relativePath;
    }

    public void deleteImage(String imagePath) {
        try {
            if (imagePath != null && !imagePath.isEmpty()) {
                String currentDir = System.getProperty("user.dir");
                String projectRoot = currentDir.endsWith("artaura")
                        ? currentDir.substring(0, currentDir.lastIndexOf("artaura")) : currentDir;

                // Convert URL path back to file path
                String filePath = imagePath.replace("/uploads/", projectRoot + "uploads" + File.separator);
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