package com.artaura.artaura.dto.buyer;
import lombok.Data;
@Data
public class CartItemRequest {
    private Long artworkId;
    private Integer quantity; // Optional, default to 1
    // getters and setters
}
