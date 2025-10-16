package com.artaura.artaura.dto.buyer;

import lombok.Data;

import java.util.List;

@Data
public class CommissionResponseDTO {
    private Long id;
    private Long artistId;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String title;
    private String artworkType;
    private String style;
    private String dimensions;
    private String budget;
    private String deadline;
    private String additionalNotes;
    private String urgency;
    private String status;
    private String submittedAt;
    private List<String> imageUrls; // Reference images
}
