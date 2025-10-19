package com.artaura.artaura.dto.admin;

public class AdminSettingsDTO {
    private Integer settingId;
    private String settingName;
    private String settingValue;

    public AdminSettingsDTO() {}

    public AdminSettingsDTO(Integer settingId, String settingName, String settingValue) {
        this.settingId = settingId;
        this.settingName = settingName;
        this.settingValue = settingValue;
    }

    // Getters and Setters
    public Integer getSettingId() { return settingId; }
    public void setSettingId(Integer settingId) { this.settingId = settingId; }

    public String getSettingName() { return settingName; }
    public void setSettingName(String settingName) { this.settingName = settingName; }

    public String getSettingValue() { return settingValue; }
    public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
}