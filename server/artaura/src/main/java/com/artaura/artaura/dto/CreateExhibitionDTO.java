package com.artaura.artaura.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateExhibitionDTO {

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
    private String websiteUrl;
    private String contactEmail;
    private String contactPhone;
    private BigDecimal entryFee;
    private Boolean isFeatured;

    // Default constructor
    public CreateExhibitionDTO() {
    }

    // Constructor with required fields
    public CreateExhibitionDTO(String title, String location, LocalDate startDate, LocalDate endDate) {
        this.title = title;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = "upcoming"; // default status
        this.exhibitionType = "group"; // default type
        this.artworksCount = 0;
        this.totalVisitors = 0;
        this.entryFee = BigDecimal.ZERO;
        this.isFeatured = false;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "CreateExhibitionDTO{"
                + "title='" + title + '\''
                + ", description='" + description + '\''
                + ", location='" + location + '\''
                + ", venue='" + venue + '\''
                + ", startDate=" + startDate
                + ", endDate=" + endDate
                + ", status='" + status + '\''
                + ", exhibitionType='" + exhibitionType + '\''
                + ", artworksCount=" + artworksCount
                + ", totalVisitors=" + totalVisitors
                + ", websiteUrl='" + websiteUrl + '\''
                + ", contactEmail='" + contactEmail + '\''
                + ", contactPhone='" + contactPhone + '\''
                + ", entryFee=" + entryFee
                + ", isFeatured=" + isFeatured
                + '}';
    }
}
