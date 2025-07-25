package com.artaura.artaura.dto.exhibition;

public class UserProfileDTO {
    private Long userId;
    private String name;
    private String contactNo;

    public UserProfileDTO() {}
    public UserProfileDTO(Long userId, String name, String contactNo) {
        this.userId = userId;
        this.name = name;
        this.contactNo = contactNo;
    }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }
}