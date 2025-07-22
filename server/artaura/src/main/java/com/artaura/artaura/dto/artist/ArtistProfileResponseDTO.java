package com.artaura.artaura.dto.artist;

import java.time.LocalDateTime;

public class ArtistProfileResponseDTO {

    private Long artistId;
    private String firstName;
    private String lastName;
    private String email;
    private String contactNo;
    private String bio;
    private String location;
    private String website;
    private String instagram;
    private String twitter;
    private String avatarUrl;
    private String coverImageUrl;
    private LocalDateTime joinDate;
    private Integer totalViews;
    private Integer totalFollowers;
    private Integer totalSales;
    private String specialization;

    // Stats
    private Integer artworksCount;

    // Constructors
    public ArtistProfileResponseDTO() {
    }

    public ArtistProfileResponseDTO(Long artistId, String firstName, String lastName, String email,
            String contactNo, String bio, String location, String website,
            String instagram, String twitter, String avatarUrl,
            String coverImageUrl, LocalDateTime joinDate, Integer totalViews,
            Integer totalFollowers, Integer totalSales, String specialization) {
        this.artistId = artistId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.contactNo = contactNo;
        this.bio = bio;
        this.location = location;
        this.website = website;
        this.instagram = instagram;
        this.twitter = twitter;
        this.avatarUrl = avatarUrl;
        this.coverImageUrl = coverImageUrl;
        this.joinDate = joinDate;
        this.totalViews = totalViews;
        this.totalFollowers = totalFollowers;
        this.totalSales = totalSales;
        this.specialization = specialization;
    }

    // Getters and Setters
    public Long getArtistId() {
        return artistId;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }

    public Integer getTotalViews() {
        return totalViews;
    }

    public void setTotalViews(Integer totalViews) {
        this.totalViews = totalViews;
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

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getArtworksCount() {
        return artworksCount;
    }

    public void setArtworksCount(Integer artworksCount) {
        this.artworksCount = artworksCount;
    }

    // Helper method to get full name
    public String getFullName() {
        return firstName + " " + lastName;
    }
}