package com.artaura.artaura.dto.artist;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for representing artwork orders from the perspective of artists Contains
 * order and order items information for display in artist dashboard
 */
public class ArtistArtworkOrderDTO {

    private Long orderId;
    private Long buyerId;
    private String buyerFirstName;
    private String buyerLastName;
    private String buyerEmail;
    private String buyerContactNumber;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private String shippingAddress;
    private String status;
    private String deliveryStatus;
    private String paymentMethod;
    private String stripePaymentId;
    private List<ArtistArtworkOrderItemDTO> orderItems;

    // Constructors
    public ArtistArtworkOrderDTO() {
    }

    public ArtistArtworkOrderDTO(Long orderId, Long buyerId, String buyerFirstName, String buyerLastName,
            String buyerEmail, String buyerContactNumber, LocalDateTime orderDate,
            BigDecimal totalAmount, BigDecimal shippingFee, String shippingAddress,
            String status, String deliveryStatus, String paymentMethod,
            String stripePaymentId) {
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.buyerFirstName = buyerFirstName;
        this.buyerLastName = buyerLastName;
        this.buyerEmail = buyerEmail;
        this.buyerContactNumber = buyerContactNumber;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.shippingFee = shippingFee;
        this.shippingAddress = shippingAddress;
        this.status = status;
        this.deliveryStatus = deliveryStatus;
        this.paymentMethod = paymentMethod;
        this.stripePaymentId = stripePaymentId;
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getBuyerFirstName() {
        return buyerFirstName;
    }

    public void setBuyerFirstName(String buyerFirstName) {
        this.buyerFirstName = buyerFirstName;
    }

    public String getBuyerLastName() {
        return buyerLastName;
    }

    public void setBuyerLastName(String buyerLastName) {
        this.buyerLastName = buyerLastName;
    }

    public String getBuyerEmail() {
        return buyerEmail;
    }

    public void setBuyerEmail(String buyerEmail) {
        this.buyerEmail = buyerEmail;
    }

    public String getBuyerContactNumber() {
        return buyerContactNumber;
    }

    public void setBuyerContactNumber(String buyerContactNumber) {
        this.buyerContactNumber = buyerContactNumber;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStripePaymentId() {
        return stripePaymentId;
    }

    public void setStripePaymentId(String stripePaymentId) {
        this.stripePaymentId = stripePaymentId;
    }

    public List<ArtistArtworkOrderItemDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<ArtistArtworkOrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }

    // Helper methods
    public String getBuyerFullName() {
        if (buyerFirstName != null && buyerLastName != null) {
            return buyerFirstName + " " + buyerLastName;
        } else if (buyerFirstName != null) {
            return buyerFirstName;
        } else if (buyerLastName != null) {
            return buyerLastName;
        }
        return "Unknown Buyer";
    }

    public int getTotalItemsCount() {
        if (orderItems == null) {
            return 0;
        }
        return orderItems.stream().mapToInt(ArtistArtworkOrderItemDTO::getQuantity).sum();
    }
}
