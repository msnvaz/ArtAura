package com.artaura.artaura.dto.buyer;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class AWOrderItemDto {
    private Long id;
    private Long artworkId;
    private int quantity;
    private double price;
    private String title;
    @JsonProperty("artist_id")
    private Long artistId;
    private String medium;
    private String size;
    private String artistEmail;
    private String artistContactNo;
    private String artistLocation;
    private String artistName;
    private String artistAvatarUrl;
    private String imageUrl;
    // getters and setters
}
