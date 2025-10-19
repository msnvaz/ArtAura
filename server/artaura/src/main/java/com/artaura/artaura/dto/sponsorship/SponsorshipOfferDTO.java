package com.artaura.artaura.dto.sponsorship;

import java.time.LocalDateTime;

public class SponsorshipOfferDTO {
    private Long id;
    private Long challengeId;
    private Long shopId;
    private String challengeTitle;
    private String shopName;
    private String discountCode;
    private Integer discountPercentage;
    private LocalDateTime createdAt;

    // Constructors
    public SponsorshipOfferDTO() {
    }

    public SponsorshipOfferDTO(Long id, Long challengeId, Long shopId, String challengeTitle,
            String shopName, String discountCode, Integer discountPercentage,
            LocalDateTime createdAt) {
        this.id = id;
        this.challengeId = challengeId;
        this.shopId = shopId;
        this.challengeTitle = challengeTitle;
        this.shopName = shopName;
        this.discountCode = discountCode;
        this.discountPercentage = discountPercentage;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(Long challengeId) {
        this.challengeId = challengeId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getChallengeTitle() {
        return challengeTitle;
    }

    public void setChallengeTitle(String challengeTitle) {
        this.challengeTitle = challengeTitle;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getDiscountCode() {
        return discountCode;
    }

    public void setDiscountCode(String discountCode) {
        this.discountCode = discountCode;
    }

    public Integer getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
