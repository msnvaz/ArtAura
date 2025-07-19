package com.artaura.artaura.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExhibitionDTO {

    private Integer exhibitionId;
    private Integer artistId;
    private String title;
    private String description;
    private String location;
    private String venue;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status; // upcoming, ongoing, completed, cancelled
    private String exhibitionType; // solo, group, virtual, popup
    private Integer artworksCount;
    private Integer totalVisitors;
    private String featuredImageUrl;
    private String websiteUrl;
    private String contactEmail;
    private String contactPhone;
    private BigDecimal entryFee;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public ExhibitionDTO() {
    }

    // Constructor with all fields
    public ExhibitionDTO(Integer exhibitionId, Integer artistId, String title, String description,
            String location, String venue, LocalDate startDate, LocalDate endDate,
            String status, String exhibitionType, Integer artworksCount, Integer totalVisitors,
            String featuredImageUrl, String websiteUrl, String contactEmail, String contactPhone,
            BigDecimal entryFee, Boolean isFeatured, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.exhibitionId = exhibitionId;
        this.artistId = artistId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.venue = venue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.exhibitionType = exhibitionType;
        this.artworksCount = artworksCount;
        this.totalVisitors = totalVisitors;
        this.featuredImageUrl = featuredImageUrl;
        this.websiteUrl = websiteUrl;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.entryFee = entryFee;
        this.isFeatured = isFeatured;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Integer getExhibitionId() {
        return exhibitionId;
    }

    public void setExhibitionId(Integer exhibitionId) {
        this.exhibitionId = exhibitionId;
    }

    public Integer getArtistId() {
        return artistId;
    }

    public void setArtistId(Integer artistId) {
        this.artistId = artistId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getExhibitionType() {
        return exhibitionType;
    }

    public void setExhibitionType(String exhibitionType) {
        this.exhibitionType = exhibitionType;
    }

    public Integer getArtworksCount() {
        return artworksCount;
    }

    public void setArtworksCount(Integer artworksCount) {
        this.artworksCount = artworksCount;
    }

    public Integer getTotalVisitors() {
        return totalVisitors;
    }

    public void setTotalVisitors(Integer totalVisitors) {
        this.totalVisitors = totalVisitors;
    }

    public String getFeaturedImageUrl() {
        return featuredImageUrl;
    }

    public void setFeaturedImageUrl(String featuredImageUrl) {
        this.featuredImageUrl = featuredImageUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public BigDecimal getEntryFee() {
        return entryFee;
    }

    public void setEntryFee(BigDecimal entryFee) {
        this.entryFee = entryFee;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "ExhibitionDTO{"
                + "exhibitionId=" + exhibitionId
                + ", artistId=" + artistId
                + ", title='" + title + '\''
                + ", description='" + description + '\''
                + ", location='" + location + '\''
                + ", venue='" + venue + '\''
                + ", startDate=" + startDate
                + ", endDate=" + endDate
                + ", status='" + status + '\''
                + ", exhibitionType='" + exhibitionType + '\''
                + ", artworksCount=" + artworksCount
                + ", totalVisitors=" + totalVisitors
                + ", featuredImageUrl='" + featuredImageUrl + '\''
                + ", websiteUrl='" + websiteUrl + '\''
                + ", contactEmail='" + contactEmail + '\''
                + ", contactPhone='" + contactPhone + '\''
                + ", entryFee=" + entryFee
                + ", isFeatured=" + isFeatured
                + ", createdAt=" + createdAt
                + ", updatedAt=" + updatedAt
                + '}';
    }
}
