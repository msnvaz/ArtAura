package com.artaura.artaura.dto.auth;

/**
 * DTO for password change response
 * Contains status and message information
 */
public class PasswordChangeResponseDTO {
    
    private boolean success;
    private String message;
    private String timestamp;
    
    // Default constructor
    public PasswordChangeResponseDTO() {
        this.timestamp = java.time.LocalDateTime.now().toString();
    }
    
    // Constructor with success and message
    public PasswordChangeResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.timestamp = java.time.LocalDateTime.now().toString();
    }
    
    // Static factory methods for common responses
    public static PasswordChangeResponseDTO success(String message) {
        return new PasswordChangeResponseDTO(true, message);
    }
    
    public static PasswordChangeResponseDTO failure(String message) {
        return new PasswordChangeResponseDTO(false, message);
    }
    
    public static PasswordChangeResponseDTO success() {
        return new PasswordChangeResponseDTO(true, "Password changed successfully");
    }
    
    public static PasswordChangeResponseDTO invalidCurrentPassword() {
        return new PasswordChangeResponseDTO(false, "Current password is incorrect");
    }
    
    public static PasswordChangeResponseDTO passwordMismatch() {
        return new PasswordChangeResponseDTO(false, "New password and confirmation do not match");
    }
    
    public static PasswordChangeResponseDTO userNotFound() {
        return new PasswordChangeResponseDTO(false, "User not found");
    }
    
    public static PasswordChangeResponseDTO samePassword() {
        return new PasswordChangeResponseDTO(false, "New password must be different from current password");
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
    
    @Override
    public String toString() {
        return "PasswordChangeResponseDTO{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}