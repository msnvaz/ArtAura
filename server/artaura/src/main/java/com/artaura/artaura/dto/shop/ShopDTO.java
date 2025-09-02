package com.artaura.artaura.dto.shop;

import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class ShopDTO {
    private Long shopId;
    private Long userId;
    private String shopName;
    private String ownerName;
    private String email;
    private String contactNo;
    private String businessType;
    private String businessLicense;
    private String taxId;
    private String description;
    private String status;
    private Boolean agreedTerms;
    private Timestamp createdAt;

    // Default constructor
    public ShopDTO() {
    }

    // Getters and Setters
    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Constructor with all fields
    public ShopDTO(Long shopId, String shopName, String ownerName, String email,
            String contactNo, String businessType, String businessLicense,
            String taxId, String description, Boolean agreedTerms,
            String status, Timestamp createdAt) {
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

    public void setCreatedAt(Timestamp timestamp) {
        this.createdAt = timestamp;
    }

    public void setCreatedAt(LocalDateTime localDateTime) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCreatedAt'");
    }
}