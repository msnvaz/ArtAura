package com.artaura.artaura.dto.order;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArtistOrderDTO {
    private Long orderId;
    private Long shopId;
    private String shopName;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private Double total;
    private String status; // pending, approved, cancelled
    private LocalDateTime date;
}
