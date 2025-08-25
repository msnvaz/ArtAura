package com.artaura.artaura.dto.buyer;
import lombok.Data;

@Data
public class OrderItemRequest {
    private Long artworkId;
    private Integer quantity;
    private Double price;
    private String title;
    private Long artistId;
}
