package com.artaura.artaura.dto.buyer;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String publishDateTime;
    private String deadlineDateTime;
    private String status;
    private Integer participantCount;
    private Integer submissionCount;
    
    // Constructor for backward compatibility (without counts)
    public ChallengeDTO(Long id, String title, String description, String category, 
                       String publishDateTime, String deadlineDateTime, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.publishDateTime = publishDateTime;
        this.deadlineDateTime = deadlineDateTime;
        this.status = status;
        this.participantCount = 0;
        this.submissionCount = 0;
    }
}
