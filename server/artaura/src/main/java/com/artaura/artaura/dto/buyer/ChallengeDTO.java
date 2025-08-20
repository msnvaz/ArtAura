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
}
