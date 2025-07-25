
package com.artaura.artaura.dto.moderator;

import lombok.Data;

@Data
public class ChallengeDTO {
    private String title;
    private String category;
    private String publishDateTime;
    private String deadlineDateTime;
    private String description;
    private int maxParticipants;
    private String rewards;
    private SponsorshipRequestDTO sponsorshipRequest;
}
