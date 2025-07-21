package com.artaura.artaura.dto.post;

import lombok.Data;

@Data
public class PostCreateDTO {

    private Long userId;  // ✅ Changed from int to Long
    private String role;
    private String caption;
    private String image;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
