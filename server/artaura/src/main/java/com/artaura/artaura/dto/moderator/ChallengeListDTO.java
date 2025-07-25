package com.artaura.artaura.dto.moderator;

import lombok.Data;

@Data
public class ChallengeListDTO {
    private int id;
    private String title;
    private String category;
    private String publishDateTime;
    private String deadlineDateTime;
    private String description;
    private int maxParticipants;
    private String rewards;
    private String sponsorshipType;
    private String sponsorshipMessage;
    private boolean requestSponsorship;
    private String status;
    private int moderatorId;
}
