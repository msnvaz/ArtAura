package com.artaura.artaura.dto.artist;

public class ArtistImageUpdateDTO {

    private String imageType; // "avatar" or "cover"
    private String imageUrl;

    // Constructors
    public ArtistImageUpdateDTO() {
    }

    public ArtistImageUpdateDTO(String imageType, String imageUrl) {
        this.imageType = imageType;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}