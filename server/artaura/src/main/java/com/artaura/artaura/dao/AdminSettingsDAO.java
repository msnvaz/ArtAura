package com.artaura.artaura.dao;

import com.artaura.artaura.dto.admin.AdminSettingsDTO;
import java.util.List;

public interface AdminSettingsDAO {
    List<AdminSettingsDTO> getAllSettings();
    boolean updateSetting(Integer settingId, String settingValue);
    AdminSettingsDTO getSettingById(Integer settingId);
}