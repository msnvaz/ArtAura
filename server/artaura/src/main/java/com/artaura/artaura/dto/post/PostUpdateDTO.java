package com.artaura.artaura.dto.post;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PostUpdateDTO {
    private Long postId;
    private String caption;
    private String image;
    private String location;
}
