package com.artaura.artaura.dto.buyer;
import lombok.Data;

import java.util.List;
import java.time.LocalDateTime;

@Data
public class AWOrderDto {
    private Long id;
    private Long buyerId;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime orderDate;
    private double totalAmount;
    private double shippingFee;
    private String deliveryStatus; // Renamed delivery_status to deliveryStatus for consistency
    private String shippingAddress;
    private String contactNumber;
    private String status;
    private String paymentMethod;
    private String stripePaymentId;
    private List<AWOrderItemDto> items;
    private String imageUrl;
    private Long artistId; // Add missing artistId at order level (note: for multi-artist orders prefer reading from items)

    // Getter and Setter for deliveryStatus
    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }
}