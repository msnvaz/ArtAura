package com.artaura.artaura.dto.post;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponseDTO {

    private Long post_id;
    private String caption;
    private List<String> images; // ✅ Changed from single image to multiple images
    private String location;
    private LocalDateTime created_at;
    private int likes;

}
