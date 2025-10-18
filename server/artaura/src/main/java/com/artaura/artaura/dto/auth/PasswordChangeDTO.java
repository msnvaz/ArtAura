package com.artaura.artaura.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for password change requests
 * Contains current password, new password, and confirmation password
 */
public class PasswordChangeDTO {
    
    @NotBlank(message = "Current password is required")
    private String currentPassword;
    
    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters long")
    private String newPassword;
    
    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
    
    // Default constructor
    public PasswordChangeDTO() {}
    
    // Constructor with all fields
    public PasswordChangeDTO(String currentPassword, String newPassword, String confirmPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }
    
    // Getters and Setters
    public String getCurrentPassword() {
        return currentPassword;
    }
    
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    
    public String getNewPassword() {
        return newPassword;
    }
    
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    
    public String getConfirmPassword() {
        return confirmPassword;
    }
    
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
    
    /**
     * Validates that new password and confirm password match
     * @return true if passwords match, false otherwise
     */
    public boolean isPasswordConfirmationValid() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }
    
    /**
     * Check if current password is different from new password
     * @return true if passwords are different, false otherwise
     */
    public boolean isPasswordChanged() {
        return currentPassword != null && newPassword != null && !currentPassword.equals(newPassword);
    }
    
    @Override
    public String toString() {
        return "PasswordChangeDTO{" +
                "currentPassword='[PROTECTED]'" +
                ", newPassword='[PROTECTED]'" +
                ", confirmPassword='[PROTECTED]'" +
                '}';
    }
}