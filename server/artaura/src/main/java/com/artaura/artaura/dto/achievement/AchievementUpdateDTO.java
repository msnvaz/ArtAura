package com.artaura.artaura.dto.achievement;

import java.time.LocalDate;

public class AchievementUpdateDTO {

    private Long achievementId;
    private String title;
    private String type;
    private LocalDate achievementDate;
    private String prize;
    private String description;
    private String iconType;
    private String colorScheme;

    // Default constructor
    public AchievementUpdateDTO() {
    }

    // Getters
    public Long getAchievementId() {
        return achievementId;
    }

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
    }

    public LocalDate getAchievementDate() {
        return achievementDate;
    }

    public String getPrize() {
        return prize;
    }

    public String getDescription() {
        return description;
    }

    public String getIconType() {
        return iconType;
    }

    public String getColorScheme() {
        return colorScheme;
    }

    // Setters
    public void setAchievementId(Long achievementId) {
        this.achievementId = achievementId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setAchievementDate(LocalDate achievementDate) {
        this.achievementDate = achievementDate;
    }

    public void setPrize(String prize) {
        this.prize = prize;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setIconType(String iconType) {
        this.iconType = iconType;
    }

    public void setColorScheme(String colorScheme) {
        this.colorScheme = colorScheme;
    }
}
