package com.artaura.artaura.service;

import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.dto.auth.PasswordChangeDTO;
import com.artaura.artaura.dto.auth.PasswordChangeResponseDTO;
import com.artaura.artaura.util.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DeliveryPartnerService {
    
    @Autowired
    private DeliveryPartnerDAO deliveryPartnerDAO;
    
    @Autowired
    private PasswordEncoderUtil passwordEncoder;
    
    public Optional<String> getPartnerNameById(Long partnerId) {
        return deliveryPartnerDAO.getPartnerNameById(partnerId);
    }
    
    public Optional<Map<String, String>> getPartnerProfileById(Long partnerId) {
        return deliveryPartnerDAO.getPartnerProfileById(partnerId);
    }
    
    public boolean updatePartnerName(Long partnerId, String newName) {
        return deliveryPartnerDAO.updatePartnerName(partnerId, newName);
    }
    
    public boolean changePassword(Long partnerId, String newPassword) {
        String hashedPassword = passwordEncoder.encode(newPassword);
        return deliveryPartnerDAO.updatePartnerPassword(partnerId, hashedPassword);
    }
    
    /**
     * Change password with current password validation
     * @param partnerId The delivery partner ID
     * @param passwordChangeDTO The password change request
     * @return PasswordChangeResponseDTO with success status and message
     */
    public PasswordChangeResponseDTO changePasswordWithValidation(Long partnerId, PasswordChangeDTO passwordChangeDTO) {
        try {
            // Validate that passwords match
            if (!passwordChangeDTO.isPasswordConfirmationValid()) {
                return PasswordChangeResponseDTO.passwordMismatch();
            }
            
            // Check if new password is different from current
            if (!passwordChangeDTO.isPasswordChanged()) {
                return PasswordChangeResponseDTO.samePassword();
            }
            
            // Get current password hash from database
            Optional<String> currentPasswordHash = deliveryPartnerDAO.getCurrentPasswordById(partnerId);
            if (currentPasswordHash.isEmpty()) {
                return PasswordChangeResponseDTO.userNotFound();
            }
            
            // Verify current password
            boolean currentPasswordValid = passwordEncoder.matches(
                passwordChangeDTO.getCurrentPassword(), 
                currentPasswordHash.get()
            );
            
            if (!currentPasswordValid) {
                return PasswordChangeResponseDTO.invalidCurrentPassword();
            }
            
            // Hash new password and update
            String hashedNewPassword = passwordEncoder.encode(passwordChangeDTO.getNewPassword());
            boolean updateSuccess = deliveryPartnerDAO.updatePartnerPassword(partnerId, hashedNewPassword);
            
            if (updateSuccess) {
                return PasswordChangeResponseDTO.success();
            } else {
                return PasswordChangeResponseDTO.failure("Failed to update password in database");
            }
            
        } catch (Exception e) {
            System.err.println("❌ DeliveryPartnerService: Error changing password for partner " + partnerId + ": " + e.getMessage());
            return PasswordChangeResponseDTO.failure("An unexpected error occurred while changing password");
        }
    }
    
    /**
     * Verify if the current password is correct
     * @param partnerId The delivery partner ID
     * @param currentPassword The current password to verify
     * @return true if password is correct, false otherwise
     */
    public boolean verifyCurrentPassword(Long partnerId, String currentPassword) {
        try {
            Optional<String> storedPasswordHash = deliveryPartnerDAO.getCurrentPasswordById(partnerId);
            if (storedPasswordHash.isEmpty()) {
                return false;
            }
            return passwordEncoder.matches(currentPassword, storedPasswordHash.get());
        } catch (Exception e) {
            System.err.println("❌ DeliveryPartnerService: Error verifying password for partner " + partnerId + ": " + e.getMessage());
            return false;
        }
    }
}