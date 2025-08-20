package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.exhibition.UserProfileDTO;

public interface UserDAO {
    UserProfileDTO getUserProfileById(Long userId);
    int updateUserProfile(Long userId, UserProfileDTO updatedProfile);
    String getPasswordById(Long userId);
    void updatePassword(Long userId, String hashedPassword);
    int deactivateAccount(Long userId);
}
