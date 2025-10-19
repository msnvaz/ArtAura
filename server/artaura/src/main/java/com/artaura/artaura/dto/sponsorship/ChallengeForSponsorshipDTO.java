package com.artaura.artaura.dto.sponsorship;

import java.time.LocalDateTime;

public class ChallengeForSponsorshipDTO {
    private Long id;
    private String title;
    private String category;
    private LocalDateTime publishDateTime;
    private LocalDateTime deadlineDateTime;
    private String description;
    private Integer maxParticipants;
    private String rewards;
    private Integer requestSponsorship; // 0 = no, 1 = yes
    private String status; // active, completed, etc.
    private Integer currentParticipants; // Count of submissions

    // Constructors
    public ChallengeForSponsorshipDTO() {
    }

    public ChallengeForSponsorshipDTO(Long id, String title, String category,
            LocalDateTime publishDateTime, LocalDateTime deadlineDateTime,
            String description, Integer maxParticipants, String rewards,
            Integer requestSponsorship, String status, Integer currentParticipants) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.publishDateTime = publishDateTime;
        this.deadlineDateTime = deadlineDateTime;
        this.description = description;
        this.maxParticipants = maxParticipants;
        this.rewards = rewards;
        this.requestSponsorship = requestSponsorship;
        this.status = status;
        this.currentParticipants = currentParticipants;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getPublishDateTime() {
        return publishDateTime;
    }

    public void setPublishDateTime(LocalDateTime publishDateTime) {
        this.publishDateTime = publishDateTime;
    }

    public LocalDateTime getDeadlineDateTime() {
        return deadlineDateTime;
    }

    public void setDeadlineDateTime(LocalDateTime deadlineDateTime) {
        this.deadlineDateTime = deadlineDateTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public String getRewards() {
        return rewards;
    }

    public void setRewards(String rewards) {
        this.rewards = rewards;
    }

    public Integer getRequestSponsorship() {
        return requestSponsorship;
    }

    public void setRequestSponsorship(Integer requestSponsorship) {
        this.requestSponsorship = requestSponsorship;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getCurrentParticipants() {
        return currentParticipants;
    }

    public void setCurrentParticipants(Integer currentParticipants) {
        this.currentParticipants = currentParticipants;
    }
}
