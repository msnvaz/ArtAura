package com.artaura.artaura.dto.notification;

import com.artaura.artaura.entity.UserNotification.UserType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserNotificationDTO {
    private Long id;
    private Long userId;
    private UserType userType;
    private String type;
    private String title;
    private String message;
    private Integer commissionRequestId;
    private LocalDate artistDeadline;
    private String rejectionReason;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public UserNotificationDTO() {
    }

    // Constructor for creating notifications
    public UserNotificationDTO(Long userId, UserType userType, String type, String title, String message) {
        this.userId = userId;
        this.userType = userType;
        this.type = type;
        this.title = title;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getCommissionRequestId() {
        return commissionRequestId;
    }

    public void setCommissionRequestId(Integer commissionRequestId) {
        this.commissionRequestId = commissionRequestId;
    }

    public LocalDate getArtistDeadline() {
        return artistDeadline;
    }

    public void setArtistDeadline(LocalDate artistDeadline) {
        this.artistDeadline = artistDeadline;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
