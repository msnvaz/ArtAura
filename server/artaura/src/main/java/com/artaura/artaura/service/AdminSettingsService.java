package com.artaura.artaura.service;

import com.artaura.artaura.dao.AdminSettingsDAO;
import com.artaura.artaura.dto.admin.AdminSettingsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminSettingsService {

    @Autowired
    private AdminSettingsDAO adminSettingsDAO;

    public List<AdminSettingsDTO> getAllSettings() {
        try {
            return adminSettingsDAO.getAllSettings();
        } catch (Exception e) {
            System.err.println("Service error getting all admin settings: " + e.getMessage());
            throw e;
        }
    }

    public AdminSettingsDTO getSettingById(Integer settingId) {
        try {
            return adminSettingsDAO.getSettingById(settingId);
        } catch (Exception e) {
            System.err.println("Service error getting admin setting by ID: " + e.getMessage());
            throw e;
        }
    }

    public boolean updateSetting(Integer settingId, String settingValue) {
        try {
            // Validate input
            if (settingId == null || settingValue == null) {
                throw new IllegalArgumentException("Setting ID and value cannot be null");
            }

            // Check if setting exists
            AdminSettingsDTO existingSetting = adminSettingsDAO.getSettingById(settingId);
            if (existingSetting == null) {
                throw new IllegalArgumentException("Setting with ID " + settingId + " not found");
            }

            return adminSettingsDAO.updateSetting(settingId, settingValue);
        } catch (Exception e) {
            System.err.println("Service error updating admin setting: " + e.getMessage());
            throw e;
        }
    }
}