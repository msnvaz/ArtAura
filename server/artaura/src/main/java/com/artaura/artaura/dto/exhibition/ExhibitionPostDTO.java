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
    // getters and setters
}
