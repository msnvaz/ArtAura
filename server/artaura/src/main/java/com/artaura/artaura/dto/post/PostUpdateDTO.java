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

    // Manual setters in case Lombok fails
    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    // Manual getters
    public Long getPostId() {
        return postId;
    }

    public String getCaption() {
        return caption;
    }

    public List<String> getImages() {
        return images;
    }

    public String getLocation() {
        return location;
    }
}
