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
    private String shippingAddress;
    private String contactNumber;
    private String status;
    private String paymentMethod;
    private String stripePaymentId;
    private List<AWOrderItemDto> items;
    private String imageUrl;
    // getters and setters
}