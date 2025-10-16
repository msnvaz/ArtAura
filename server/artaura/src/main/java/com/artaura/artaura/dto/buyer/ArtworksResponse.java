package com.artaura.artaura.dto.buyer;

import lombok.Data;

@Data
public class ArtworksResponse {
    private Long artworkId;
    private String title;
    private String medium;
    private String size;
    private Integer year;
    private Double price;
    private String description;
    private String category;
    private String tags;
    private String imageUrl;
    private Integer likesCount;
    private Long artistId;
    private String artistName;
    private String artistAvatarUrl;
}
