package com.artaura.artaura.dto.order;

import lombok.Data;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
public class ShopOrderDTO {
    private Long orderId;
    private Long shopId;
    private Long artistId;

    // Artist details (fetched via JOIN)
    private String artistFirstName;
    private String artistLastName;
    private String artistEmail;
    private String artistContactNo;

    private String items; // Comma-separated item names
    private BigDecimal totalAmount;
    private String status; // pending, approved, cancelled
    private Timestamp date;

    public ShopOrderDTO() {
    }

    // Constructor for easy object creation
    public ShopOrderDTO(Long orderId, Long shopId, Long artistId,
            String artistFirstName, String artistLastName,
            String artistEmail, String artistContactNo,
            String items, BigDecimal totalAmount,
            String status, Timestamp date) {
        this.orderId = orderId;
        this.shopId = shopId;
        this.artistId = artistId;
        this.artistFirstName = artistFirstName;
        this.artistLastName = artistLastName;
        this.artistEmail = artistEmail;
        this.artistContactNo = artistContactNo;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.date = date;
    }
}
