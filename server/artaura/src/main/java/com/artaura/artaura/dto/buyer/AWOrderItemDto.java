package com.artaura.artaura.dto.buyer;

import lombok.Data;

@Data
public class AWOrderItemDto {
    private Long id;
    private Long artworkId;
    private int quantity;
    private double price;
    private String title;
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
