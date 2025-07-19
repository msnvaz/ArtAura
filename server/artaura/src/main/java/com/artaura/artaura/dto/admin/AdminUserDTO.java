package com.artaura.artaura.dto.admin;

import java.time.LocalDateTime;

public class AdminUserDTO {
    private Long userId;
    private String userType; // "artist", "buyer", or "moderator"
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String status;
    private LocalDateTime createdAt;
    
    // Common fields
    private Boolean agreedTerms;
    private String contactNo;
    
    // Artist-specific fields
    private String badge;
    private String bio;
    private String nic;
    private Float rate;
    private String specialization;
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

    private Integer revenue;
    
    // Constructors
    public AdminUserDTO() {}
    
    public AdminUserDTO(Long userId, String userType, String email, String firstName, String lastName, 
                       String status, LocalDateTime createdAt) {
        this.userId = userId;
        this.userType = userType;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.status = status;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getAgreedTerms() { return agreedTerms; }
    public void setAgreedTerms(Boolean agreedTerms) { this.agreedTerms = agreedTerms; }
    
    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }
    
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }
    
    public Float getRate() { return rate; }
    public void setRate(Float rate) { this.rate = rate; }
    
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    
    public String getInstagram() { return instagram; }
    public void setInstagram(String instagram) { this.instagram = instagram; }
    
    public String getTwitter() { return twitter; }
    public void setTwitter(String twitter) { this.twitter = twitter; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    
    public LocalDateTime getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDateTime joinDate) { this.joinDate = joinDate; }
    
    public Integer getTotalViews() { return totalViews; }
    public void setTotalViews(Integer totalViews) { this.totalViews = totalViews; }
    
    public Integer getTotalFollowers() { return totalFollowers; }
    public void setTotalFollowers(Integer totalFollowers) { this.totalFollowers = totalFollowers; }
    
    public Integer getTotalSales() { return totalSales; }
    public void setTotalSales(Integer totalSales) { this.totalSales = totalSales; }

    public Integer getRevenue() {return revenue;}
    public void setRevenue(Integer revenue) { this.revenue = revenue; }


    // Helper methods
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        }
        return "";
    }
    
    public boolean isArtist() {
        return "artist".equals(userType);
    }
    
    public boolean isBuyer() {
        return "buyer".equals(userType);
    }
    
    public boolean isModerator() {
        return "moderator".equals(userType);
    }
    
    public boolean isActive() {
        return "Active".equals(status);
    }
    
    public boolean isSuspended() {
        return "Suspended".equals(status);
    }
    
    public boolean isPending() {
        return "Pending".equals(status);
    }

    @Override
    public String toString() {
        return "AdminUserDTO{" +
                "userId=" + userId +
                ", userType='" + userType + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
