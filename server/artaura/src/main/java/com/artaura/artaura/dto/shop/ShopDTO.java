package com.artaura.artaura.dto.shop;

import lombok.Data;

import java.sql.Timestamp;

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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getBusinessLicense() {
        return businessLicense;
    }

    public void setBusinessLicense(String businessLicense) {
        this.businessLicense = businessLicense;
    }

    public String getTaxId() {
        return taxId;
    }

    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getAgreedTerms() {
        return agreedTerms;
    }

    public void setAgreedTerms(Boolean agreedTerms) {
        this.agreedTerms = agreedTerms;
    }
}