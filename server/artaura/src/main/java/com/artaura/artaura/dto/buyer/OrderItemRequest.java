package com.artaura.artaura.dto.buyer;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class OrderItemRequest {
    private Long artworkId;
    private Integer quantity;
    private Double price;
    private String title;
    @JsonProperty("artist_id")
    private Long artistId;
}
