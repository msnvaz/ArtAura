package com.artaura.artaura.dto.achievement;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AchievementResponseDTO {

    private Long achievementId;
    private Long artistId;
    private String title;
    private String type;
    private LocalDate achievementDate;
    private String prize;
    private String description;
    private String iconType;
    private String colorScheme;
    private LocalDateTime createdAt;

    // Default constructor
    public AchievementResponseDTO() {
    }

    // Getters
    public Long getAchievementId() {
        return achievementId;
    }

    public Long getArtistId() {
        return artistId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setAchievementId(Long achievementId) {
        this.achievementId = achievementId;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
