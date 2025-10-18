package com.artaura.artaura.dto.artist;

import lombok.Data;

@Data
public class ChallengeParticipationDTO {

    private Long id;
    private Long challengeId;
    private String challengeTitle;
    private String challengeDescription;
    private String challengeImagePath;
    private String artworkTitle;
    private String artworkDescription;
    private String artworkImagePath;
    private String submissionDate;
    private String status;
    private Double rating;
    private String deadlineDateTime;
    private Integer maxParticipants;
    private String rewards;
}
