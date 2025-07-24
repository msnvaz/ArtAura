package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.UserDAO;
import com.artaura.artaura.dto.exhibition.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserDAO userDAO;

    public UserProfileDTO getUserProfileById(Long userId) {
        return userDAO.getUserProfileById(userId);
    }
}