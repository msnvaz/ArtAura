package com.artaura.artaura.dto.exhibition;

public class UserProfileDTO {
    private Long userId;
    private String name;
    private String contactNo;
    private String email;
    private String bio;
    private String city;
    private String country;
    private String state;
    private String streetAddress;
    private String zipCode;
    private String image;

    public UserProfileDTO() {}
    public UserProfileDTO(Long userId, String name, String contactNo, String email, String bio, String city, String country, String state, String streetAddress, String zipCode, String image) {
        this.userId = userId;
        this.name = name;
        this.contactNo = contactNo;
        this.email = email;
        this.bio = bio;
        this.city = city;
        this.country = country;
        this.state = state;
        this.streetAddress = streetAddress;
        this.zipCode = zipCode;
        this.image = image;
    }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public String getImage() { return image; }
    public void setImage(String image) {
        // Accept null or empty string to clear image, otherwise set new image path
        this.image = (image != null && !image.isEmpty()) ? image : this.image;
    }

    // For image updating, add a helper to check if image is present
    public boolean hasImage() {
        return image != null && !image.isEmpty();
    }
}