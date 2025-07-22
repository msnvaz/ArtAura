package com.artaura.artaura.dto.post;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Data
public class PostUpdateDTO {

    private Long postId;
    private String caption;
    private List<String> images; // ✅ Changed from single image to multiple images
    private String location;
}
