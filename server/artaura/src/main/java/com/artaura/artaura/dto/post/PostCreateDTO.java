package com.artaura.artaura.dto.post;

import lombok.Data;
import java.util.List;

@Data
public class PostCreateDTO {

    private Long userId;  // ✅ Changed from int to Long
    private String role;
    private String caption;
    private List<String> images; // ✅ Changed from single image to multiple images
    private String location;

    // Manual getters and setters (in case Lombok fails)
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
