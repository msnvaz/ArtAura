package com.artaura.artaura.dto.post;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostResponseDTO {
    private Long post_id;
    private String caption;
    private String image;
    private String location;
    private LocalDateTime created_at;
    private int likes;

}