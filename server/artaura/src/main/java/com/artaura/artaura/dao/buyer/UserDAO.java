package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.exhibition.UserProfileDTO;

public interface UserDAO {
    UserProfileDTO getUserProfileById(Long userId);
}
