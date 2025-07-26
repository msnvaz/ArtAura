package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.UserDAO;
import com.artaura.artaura.dto.exhibition.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserDAO userDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserProfileDTO getUserProfileById(Long userId) {
        return userDAO.getUserProfileById(userId);
    }

    public UserProfileDTO updateUserProfile(Long userId, UserProfileDTO updatedProfile) {
        int rows = userDAO.updateUserProfile(userId, updatedProfile);
        if (rows > 0) {
            return userDAO.getUserProfileById(userId);
        }
        return null;
    }

    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        // Fetch hashed password from DB
        String hashedPassword = userDAO.getPasswordById(userId);
        if (hashedPassword == null || !passwordEncoder.matches(currentPassword, hashedPassword)) {
            return false;
        }
        String newHashed = passwordEncoder.encode(newPassword);
        userDAO.updatePassword(userId, newHashed);
        return true;
    }

    public boolean deactivateAccount(Long userId) {
        try {
            int rows = userDAO.deactivateAccount(userId);
            System.out.println("Deactivate rows affected: " + rows);
            return rows > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}