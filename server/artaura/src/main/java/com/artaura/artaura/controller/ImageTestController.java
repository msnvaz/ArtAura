package com.artaura.artaura.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5174")
public class ImageTestController {

    @GetMapping("/images")
    public ResponseEntity<Map<String, Object>> listImages() {
        Map<String, Object> response = new HashMap<>();

        // Get project root
        String currentDir = System.getProperty("user.dir");
        String projectRoot = currentDir.endsWith("artaura")
                ? currentDir.substring(0, currentDir.lastIndexOf("artaura")) : currentDir;

        String uploadsPath = projectRoot + "uploads" + File.separator;
        String profilesPath = uploadsPath + "profiles" + File.separator;

        // List files in uploads directory
        File uploadsDir = new File(uploadsPath);
        List<String> uploadFiles = new ArrayList<>();
        if (uploadsDir.exists()) {
            for (File file : uploadsDir.listFiles()) {
                if (file.isFile()) {
                    uploadFiles.add("/uploads/" + file.getName());
                }
            }
        }

        // List files in profiles directory
        File profilesDir = new File(profilesPath);
        List<String> profileFiles = new ArrayList<>();
        if (profilesDir.exists()) {
            for (File file : profilesDir.listFiles()) {
                if (file.isFile()) {
                    profileFiles.add("/uploads/profiles/" + file.getName());
                }
            }
        }

        response.put("uploadsPath", uploadsPath);
        response.put("profilesPath", profilesPath);
        response.put("uploadFiles", uploadFiles);
        response.put("profileFiles", profileFiles);
        response.put("serverUrl", "http://localhost:8081");

        return ResponseEntity.ok(response);
    }
}