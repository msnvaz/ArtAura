package com.artaura.artaura.dto.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminPaymentDTO {
    private Integer id;
    private Integer awOrderId;
    private Integer commissionRequestId;
    private Long artistId;
    private Long buyerId;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Related entity information
    private String artistName;
    private String artistEmail;
    private String buyerName;
    private String buyerEmail;
    private String orderDescription;
    private String commissionTitle;
    private String paymentType; // "order" or "commission"

    public AdminPaymentDTO() {}

    // Constructor
    public AdminPaymentDTO(Integer id, Integer awOrderId, Integer commissionRequestId, 
                          Long artistId, Long buyerId, BigDecimal amount, String status, 
                          LocalDateTime createdAt, LocalDateTime updatedAt,
                          String artistName, String artistEmail, String buyerName, 
                          String buyerEmail, String orderDescription, String commissionTitle,
                          String paymentType) {
        this.id = id;
        this.awOrderId = awOrderId;
        this.commissionRequestId = commissionRequestId;
        this.artistId = artistId;
        this.buyerId = buyerId;
        this.amount = amount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.artistName = artistName;
        this.artistEmail = artistEmail;
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.orderDescription = orderDescription;
        this.commissionTitle = commissionTitle;
        this.paymentType = paymentType;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getAwOrderId() { return awOrderId; }
    public void setAwOrderId(Integer awOrderId) { this.awOrderId = awOrderId; }

    public Integer getCommissionRequestId() { return commissionRequestId; }
    public void setCommissionRequestId(Integer commissionRequestId) { this.commissionRequestId = commissionRequestId; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getArtistEmail() { return artistEmail; }
    public void setArtistEmail(String artistEmail) { this.artistEmail = artistEmail; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    public String getOrderDescription() { return orderDescription; }
    public void setOrderDescription(String orderDescription) { this.orderDescription = orderDescription; }

    public String getCommissionTitle() { return commissionTitle; }
    public void setCommissionTitle(String commissionTitle) { this.commissionTitle = commissionTitle; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
}