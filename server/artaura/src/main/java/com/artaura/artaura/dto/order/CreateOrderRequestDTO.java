package com.artaura.artaura.dto.order;

import lombok.Data;

@Data
public class CreateOrderRequestDTO {
    private Long productId;
    private Integer quantity;
    private Long artistId;
}
