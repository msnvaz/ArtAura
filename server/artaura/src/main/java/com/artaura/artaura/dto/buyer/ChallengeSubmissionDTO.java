package com.artaura.artaura.dto.buyer;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChallengeSubmissionDTO {
    private Long submissionId;
    private Integer challengeId;
    private Long artistId;
    private String title;
    private String description;
    private String imageUrl;
    private List<String> tags;
    private String softwareUsed;
    private String timeSpent;
    private Integer votesCount;
    private Integer viewsCount;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    // Artist information
    private String artistName;
    private String artistAvatar;
    private Integer artistFollowers;

    // User vote status
    private Boolean userHasVoted;
}
