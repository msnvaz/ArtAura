
package com.artaura.artaura.dto.moderator;

import lombok.Data;

@Data
public class ChallengeDTO {
    private int id;
    private String title;
    private String category;
    private String publishDateTime;
    private String deadlineDateTime;
    private String description;
    private int maxParticipants;
    private String rewards;
    private boolean requestSponsorship;
    private String sponsorship; // ENUM: 'none', 'pending', 'active' from database
    private String status; // Challenge status: 'draft', 'active', 'completed'
    // Removed scoringCriteria - using fixed marks scoring now
    // Each Like = +10 marks, Each Dislike = -5 marks, Minimum score = 0
}
