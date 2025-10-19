package com.artaura.artaura.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChallengeParticipant {

    private Long id;
    private Long challengeId;
    private Long artistId;
    private String artworkTitle;
    private String artworkDescription;
    private String artworkImagePath;
    private LocalDateTime submissionDate;
    private String status; // submitted, under_review, approved, rejected
    private Double rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
