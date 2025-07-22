package com.artaura.artaura.dto.artist;

public class ArtistProfileUpdateDTO {

    private String firstName;
    private String lastName;
    private String bio;
    private String location;
    private String website;
    private String instagram;
    private String twitter;
    private String contactNo;

    // Constructors
    public ArtistProfileUpdateDTO() {
    }

    public ArtistProfileUpdateDTO(String firstName, String lastName, String bio, String location,
            String website, String instagram, String twitter, String contactNo) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.location = location;
        this.website = website;
        this.instagram = instagram;
        this.twitter = twitter;
        this.contactNo = contactNo;
    }

    // Getters and Setters
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

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }
}