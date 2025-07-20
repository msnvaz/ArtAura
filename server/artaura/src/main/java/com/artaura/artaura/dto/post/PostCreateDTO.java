package com.artaura.artaura.dto.post;
import lombok.Data;

@Data
public class PostCreateDTO {
    private int userId;  // ✅ Add this field
    private String role;
    private String caption;
    private String image;
    private String location;
}
