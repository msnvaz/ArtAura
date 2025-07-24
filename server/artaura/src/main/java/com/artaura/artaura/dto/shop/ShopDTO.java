package com.artaura.artaura.dto.shop;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShopDTO {
    private Long shopId;
    private String shopName;
    private String ownerName;
    private String email;
    private String contactNo;
    private String businessType;
    private String businessLicense;
    private String taxId;
    private String description;
    private Boolean agreedTerms;
    private String status;
    private LocalDateTime createdAt;

    // Default constructor
    public ShopDTO() {
    }

    // Constructor with all fields
    public ShopDTO(Long shopId, String shopName, String ownerName, String email,
            String contactNo, String businessType, String businessLicense,
            String taxId, String description, Boolean agreedTerms,
            String status, LocalDateTime createdAt) {
        this.shopId = shopId;
        this.shopName = shopName;
        this.ownerName = ownerName;
        this.email = email;
        this.contactNo = contactNo;
        this.businessType = businessType;
        this.businessLicense = businessLicense;
        this.taxId = taxId;
        this.description = description;
        this.agreedTerms = agreedTerms;
        this.status = status;
        this.createdAt = createdAt;
    }
}