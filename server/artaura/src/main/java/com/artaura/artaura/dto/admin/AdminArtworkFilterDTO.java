package com.artaura.artaura.dto.admin;

public class AdminArtworkFilterDTO {
    private String category;
    private String status;
    private String artistName;
    private Double minPrice;
    private Double maxPrice;
    private Integer minYear;
    private Integer maxYear;
    private String medium;
    private Boolean isFeatured;
    private String sortBy; // "title", "price", "year", "created_at", "views_count", "likes_count"
    private String sortOrder; // "ASC" or "DESC"
    private Integer page;
    private Integer size;

    public AdminArtworkFilterDTO() {}

    // Constructor
    public AdminArtworkFilterDTO(String category, String status, String artistName, 
                                Double minPrice, Double maxPrice, Integer minYear, Integer maxYear,
                                String medium, Boolean isFeatured, String sortBy, String sortOrder,
                                Integer page, Integer size) {
        this.category = category;
        this.status = status;
        this.artistName = artistName;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.minYear = minYear;
        this.maxYear = maxYear;
        this.medium = medium;
        this.isFeatured = isFeatured;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.page = page;
        this.size = size;
    }

    // Getters and Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }

    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }

    public Integer getMinYear() { return minYear; }
    public void setMinYear(Integer minYear) { this.minYear = minYear; }

    public Integer getMaxYear() { return maxYear; }
    public void setMaxYear(Integer maxYear) { this.maxYear = maxYear; }

    public String getMedium() { return medium; }
    public void setMedium(String medium) { this.medium = medium; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }

    public String getSortOrder() { return sortOrder; }
    public void setSortOrder(String sortOrder) { this.sortOrder = sortOrder; }

    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }

    public Integer getSize() { return size; }
    public void setSize(Integer size) { this.size = size; }
}