package com.artaura.artaura.dto.buyer;

public class ArtistListDTO {

    private Long id;
    private String name;
    private String specialization;
    private String bio;
    private Double rate;
    private Integer totalFollowers;
    private Integer totalSales;
    private String avatarUrl;
    private String location;
    private String badge;
    private String contactNo;
    private String email;
    private String coverImageUrl;
    private String status;

    public ArtistListDTO() {
    }

    public ArtistListDTO(Long id, String name, String specialization, String bio, Double rate, Integer totalFollowers, Integer totalSales, String avatarUrl, String location, String badge, String contactNo, String email, String coverImageUrl, String status) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.bio = bio;
        this.rate = rate;
        this.totalFollowers = totalFollowers;
        this.totalSales = totalSales;
        this.avatarUrl = avatarUrl;
        this.location = location;
        this.badge = badge;
        this.contactNo = contactNo;
        this.email = email;
        this.coverImageUrl = coverImageUrl;
        this.status = status;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public Integer getTotalFollowers() {
        return totalFollowers;
    }

    public void setTotalFollowers(Integer totalFollowers) {
        this.totalFollowers = totalFollowers;
    }

    public Integer getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Integer totalSales) {
        this.totalSales = totalSales;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
