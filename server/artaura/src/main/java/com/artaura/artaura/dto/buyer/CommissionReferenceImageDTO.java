package com.artaura.artaura.dto.buyer;


import lombok.Data;

@Data
public class CommissionReferenceImageDTO {
    private Long id;
    private Long commissionRequestId;
    private String imageUrl;
    private String uploadedAt;
    // getters and setters
}
