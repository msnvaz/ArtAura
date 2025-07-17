package com.artaura.artaura.dto.admin;

import java.time.LocalDateTime;

public class AdminArtworkDTO {
    private Long artworkId;
    private Long artistId;
    private String artistName;
    private String title;
    private String medium;
    private String size;
    private Integer year;
    private Double price;
    private String description;
    private String category;
    private String tags;
    private String status;
    private String imageUrl;
    private Integer likesCount;
    private Integer viewsCount;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminArtworkDTO() {}

    // Constructor
    public AdminArtworkDTO(Long artworkId, Long artistId, String artistName, String title, 
                          String medium, String size, Integer year, Double price, String description, 
                          String category, String tags, String status, String imageUrl, 
                          Integer likesCount, Integer viewsCount, Boolean isFeatured, 
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.artworkId = artworkId;
        this.artistId = artistId;
        this.artistName = artistName;
        this.title = title;
        this.medium = medium;
        this.size = size;
        this.year = year;
        this.price = price;
        this.description = description;
        this.category = category;
        this.tags = tags;
        this.status = status;
        this.imageUrl = imageUrl;
        this.likesCount = likesCount;
        this.viewsCount = viewsCount;
        this.isFeatured = isFeatured;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getArtworkId() { return artworkId; }
    public void setArtworkId(Long artworkId) { this.artworkId = artworkId; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMedium() { return medium; }
    public void setMedium(String medium) { this.medium = medium; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getLikesCount() { return likesCount; }
    public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }

    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
