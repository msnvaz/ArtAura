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

        String uploadDirPath;
        String relativePath;
        String filename;

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf('.')) : ".jpg";

        if ("nic".equals(imageType)) {
            // Save to client/public/nic
            uploadDirPath = "c:/Users/aaa/Desktop/ArtAura/client/public/nic/";
            filename = System.currentTimeMillis() + "_" + originalFilename;
            relativePath = "/nic/" + filename;
        } else {
            // Save to default uploads/profiles
            String serverDir = currentDir.endsWith("artaura")
                    ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                    : currentDir + File.separator;
            uploadDirPath = serverDir + "uploads" + File.separator + "profiles" + File.separator;
            filename = artistId + "_" + imageType + "_" + System.currentTimeMillis() + extension;
            relativePath = "/uploads/profiles/" + filename;
        }

        // Create upload directory if it doesn't exist
        File uploadDir = new File(uploadDirPath);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            System.out.println("Created upload directory: " + created + " at " + uploadDirPath);
        }

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
                String serverDir = currentDir.endsWith("artaura")
                        ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                        : currentDir + File.separator;

                // Convert URL path back to file path
                String filePath = imagePath.replace("/uploads/", serverDir + "uploads" + File.separator);
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
