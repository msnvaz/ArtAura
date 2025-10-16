package com.artaura.artaura.dto.buyer;
import lombok.Data;
@Data
public class CartItemRequest {
    private Long artworkId;
    private Integer quantity; // Optional, default to 1
    // Add price, title, artistId for order item creation
    private Double price;
    private String title;
    private Long artistId;
    // getters and setters
}
