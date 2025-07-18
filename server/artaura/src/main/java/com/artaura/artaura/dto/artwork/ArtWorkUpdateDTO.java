package com.artaura.artaura.dto.artwork;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArtWorkUpdateDTO {
    private Long artworkId;
    private String title;
    private String medium;
    private String size;
    private String year;
    private Double price;
    private String description;
    private String category;
    private String tags;
    private String status;
    private String imageUrl;
    private Integer likesCount;
    private Integer viewsCount;
    private boolean featured;
    private LocalDateTime updatedAt;
}
