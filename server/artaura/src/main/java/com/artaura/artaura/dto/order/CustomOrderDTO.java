package com.artaura.artaura.dto.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomOrderDTO {
    private Long orderId;
    private Long buyerId;
    private Long artistId;
    private String buyerName;
    private String buyerEmail;
    private String title;
    private String description;
    private String referenceImageUrl;
    private BigDecimal budget;
    private String preferredSize;
    private String preferredMedium;
    private LocalDate deadlineDate;
    private String status;
    private Integer artistEstimatedDays;
    private String artistNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime rejectedAt;

    // Default constructor
    public CustomOrderDTO() {}

    // Constructor with all fields
    public CustomOrderDTO(Long orderId, Long buyerId, Long artistId, String buyerName, String buyerEmail,
                         String title, String description, String referenceImageUrl, BigDecimal budget,
                         String preferredSize, String preferredMedium, LocalDate deadlineDate, String status,
                         Integer artistEstimatedDays, String artistNotes, LocalDateTime createdAt,
                         LocalDateTime updatedAt, LocalDateTime acceptedAt, LocalDateTime rejectedAt) {
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.artistId = artistId;
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.title = title;
        this.description = description;
        this.referenceImageUrl = referenceImageUrl;
        this.budget = budget;
        this.preferredSize = preferredSize;
        this.preferredMedium = preferredMedium;
        this.deadlineDate = deadlineDate;
        this.status = status;
        this.artistEstimatedDays = artistEstimatedDays;
        this.artistNotes = artistNotes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.acceptedAt = acceptedAt;
        this.rejectedAt = rejectedAt;
    }

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReferenceImageUrl() { return referenceImageUrl; }
    public void setReferenceImageUrl(String referenceImageUrl) { this.referenceImageUrl = referenceImageUrl; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public String getPreferredSize() { return preferredSize; }
    public void setPreferredSize(String preferredSize) { this.preferredSize = preferredSize; }

    public String getPreferredMedium() { return preferredMedium; }
    public void setPreferredMedium(String preferredMedium) { this.preferredMedium = preferredMedium; }

    public LocalDate getDeadlineDate() { return deadlineDate; }
    public void setDeadlineDate(LocalDate deadlineDate) { this.deadlineDate = deadlineDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getArtistEstimatedDays() { return artistEstimatedDays; }
    public void setArtistEstimatedDays(Integer artistEstimatedDays) { this.artistEstimatedDays = artistEstimatedDays; }

    public String getArtistNotes() { return artistNotes; }
    public void setArtistNotes(String artistNotes) { this.artistNotes = artistNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }

    public LocalDateTime getRejectedAt() { return rejectedAt; }
    public void setRejectedAt(LocalDateTime rejectedAt) { this.rejectedAt = rejectedAt; }
}
