package com.artaura.artaura.dto.delivery;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ArtistPickupAddressDTO {
    private Long requestId;
    private String requestType; // "artwork_order" or "commission_request"
    private Long artistId;
    private String artistName;
    private String artistEmail;
    private String artistContactNo;
    
    // Address information
    private String streetAddress;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    
    // Request details
    private String artworkTitle;
    private String artworkType;
    private String deliveryStatus;
    private LocalDateTime requestDate;
    private BigDecimal totalAmount;
    
    // Buyer information for reference
    private String buyerName;
    private String buyerEmail;
    private String deliveryAddress;

    // Constructors
    public ArtistPickupAddressDTO() {}

    public ArtistPickupAddressDTO(Long requestId, String requestType, Long artistId, String artistName,
                                String artistEmail, String artistContactNo, String streetAddress,
                                String city, String state, String country, String zipCode,
                                String artworkTitle, String artworkType, String deliveryStatus,
                                LocalDateTime requestDate, BigDecimal totalAmount,
                                String buyerName, String buyerEmail, String deliveryAddress) {
        this.requestId = requestId;
        this.requestType = requestType;
        this.artistId = artistId;
        this.artistName = artistName;
        this.artistEmail = artistEmail;
        this.artistContactNo = artistContactNo;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipCode = zipCode;
        this.artworkTitle = artworkTitle;
        this.artworkType = artworkType;
        this.deliveryStatus = deliveryStatus;
        this.requestDate = requestDate;
        this.totalAmount = totalAmount;
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.deliveryAddress = deliveryAddress;
    }

    // Getters and Setters
    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getArtistEmail() { return artistEmail; }
    public void setArtistEmail(String artistEmail) { this.artistEmail = artistEmail; }

    public String getArtistContactNo() { return artistContactNo; }
    public void setArtistContactNo(String artistContactNo) { this.artistContactNo = artistContactNo; }

    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getArtworkTitle() { return artworkTitle; }
    public void setArtworkTitle(String artworkTitle) { this.artworkTitle = artworkTitle; }

    public String getArtworkType() { return artworkType; }
    public void setArtworkType(String artworkType) { this.artworkType = artworkType; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    // Helper method to get full address as string
    public String getFullAddress() {
        StringBuilder fullAddress = new StringBuilder();
        if (streetAddress != null && !streetAddress.trim().isEmpty()) {
            fullAddress.append(streetAddress);
        }
        if (city != null && !city.trim().isEmpty()) {
            if (fullAddress.length() > 0) fullAddress.append(", ");
            fullAddress.append(city);
        }
        if (state != null && !state.trim().isEmpty()) {
            if (fullAddress.length() > 0) fullAddress.append(", ");
            fullAddress.append(state);
        }
        if (country != null && !country.trim().isEmpty()) {
            if (fullAddress.length() > 0) fullAddress.append(", ");
            fullAddress.append(country);
        }
        if (zipCode != null && !zipCode.trim().isEmpty()) {
            if (fullAddress.length() > 0) fullAddress.append(" ");
            fullAddress.append(zipCode);
        }
        return fullAddress.toString();
    }
}