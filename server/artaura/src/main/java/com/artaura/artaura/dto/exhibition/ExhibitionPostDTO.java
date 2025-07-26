package com.artaura.artaura.dto.exhibition;

import lombok.Data;

@Data
public class ExhibitionPostDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String category;
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;
    private String organizer;
    private String entryFee;
    private Integer maxParticipants;
    private String contactEmail;
    private String contactPhone;
    private String requirements;
    private Long createdBy;
    private String createdAt;
    private String status; // pending, verified, rejected
    private String creatorName;
    private Integer likes;
    // getters and setters

    // Manual setters in case Lombok fails
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public void setStatus(String status) { this.status = status; }
    public String getStatus() { return status; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }
    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }
}
