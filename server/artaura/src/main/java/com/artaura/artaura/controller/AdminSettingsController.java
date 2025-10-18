package com.artaura.artaura.controller;

import com.artaura.artaura.dto.admin.AdminSettingsDTO;
import com.artaura.artaura.service.AdminSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminSettingsController {

    @Autowired
    private AdminSettingsService adminSettingsService;

    /**
     * Get all admin settings
     * GET /api/admin/settings
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSettings() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<AdminSettingsDTO> settings = adminSettingsService.getAllSettings();
            
            response.put("success", true);
            response.put("settings", settings);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Failed to fetch admin settings");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get admin setting by ID
     * GET /api/admin/settings/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSettingById(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            AdminSettingsDTO setting = adminSettingsService.getSettingById(id);
            
            if (setting != null) {
                response.put("success", true);
                response.put("setting", setting);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Setting not found");
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Failed to fetch admin setting");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update admin setting
     * PUT /api/admin/settings/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateSetting(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String settingValue = request.get("settingValue");
            
            if (settingValue == null) {
                response.put("success", false);
                response.put("error", "Setting value is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = adminSettingsService.updateSetting(id, settingValue);
            
            if (updated) {
                response.put("success", true);
                response.put("message", "Admin setting updated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Failed to update admin setting");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update multiple settings at once (for "Update All" functionality)
     * PUT /api/admin/settings/batch
     */
    @PutMapping("/batch")
    public ResponseEntity<Map<String, Object>> updateMultipleSettings(
            @RequestBody List<Map<String, Object>> settingsUpdates) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            int successCount = 0;
            int totalCount = settingsUpdates.size();
            
            for (Map<String, Object> settingUpdate : settingsUpdates) {
                Integer settingId = (Integer) settingUpdate.get("settingId");
                String settingValue = (String) settingUpdate.get("settingValue");
                
                if (settingId != null && settingValue != null) {
                    boolean updated = adminSettingsService.updateSetting(settingId, settingValue);
                    if (updated) {
                        successCount++;
                    }
                }
            }
            
            if (successCount == totalCount) {
                response.put("success", true);
                response.put("message", "All admin settings updated successfully");
                response.put("updatedCount", successCount);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Some settings failed to update");
                response.put("updatedCount", successCount);
                response.put("totalCount", totalCount);
                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(response);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}