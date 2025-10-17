package com.artaura.artaura.dto.delivery;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DeliveryRequestDTO {
    private Long id;
    private String requestType; // "artwork_order" or "commission_request"
    private Long buyerId;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    private String shippingAddress;
    private String deliveryStatus;
    private LocalDateTime orderDate;
    
    // Artwork/Commission details
    private String artworkTitle;
    private String artworkType;
    private String artworkDimensions;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private Long artistId;
    private String artistName;
    
    // Commission specific fields
    private String commissionStyle;
    private LocalDate deadline;
    private String additionalNotes;
    private String urgency;
    
    // Artist pickup address fields
    private String pickupAddress;
    private String pickupCity;
    
    // Constructors
    public DeliveryRequestDTO() {}

    public DeliveryRequestDTO(Long id, String requestType, Long buyerId, String buyerName, 
                            String buyerEmail, String buyerPhone, String shippingAddress, 
                            String deliveryStatus, LocalDateTime orderDate, String artworkTitle, 
                            String artworkType, String artworkDimensions, BigDecimal totalAmount, 
                            Long artistId, String artistName) {
        this.id = id;
        this.requestType = requestType;
        this.buyerId = buyerId;
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.buyerPhone = buyerPhone;
        this.shippingAddress = shippingAddress;
        this.deliveryStatus = deliveryStatus;
        this.orderDate = orderDate;
        this.artworkTitle = artworkTitle;
        this.artworkType = artworkType;
        this.artworkDimensions = artworkDimensions;
        this.totalAmount = totalAmount;
        this.artistId = artistId;
        this.artistName = artistName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    public String getBuyerPhone() { return buyerPhone; }
    public void setBuyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getArtworkTitle() { return artworkTitle; }
    public void setArtworkTitle(String artworkTitle) { this.artworkTitle = artworkTitle; }

    public String getArtworkType() { return artworkType; }
    public void setArtworkType(String artworkType) { this.artworkType = artworkType; }

    public String getArtworkDimensions() { return artworkDimensions; }
    public void setArtworkDimensions(String artworkDimensions) { this.artworkDimensions = artworkDimensions; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getCommissionStyle() { return commissionStyle; }
    public void setCommissionStyle(String commissionStyle) { this.commissionStyle = commissionStyle; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getPickupCity() { return pickupCity; }
    public void setPickupCity(String pickupCity) { this.pickupCity = pickupCity; }
}