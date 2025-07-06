package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dto.ShopOwnerSignupRequest;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;

import java.util.Optional;

public interface ShopOwnerDAO {
    // ✅ Declare it here
    boolean emailExists(String email);
    void save(ShopOwnerSignupRequest request, String hashedPassword);
    Optional<LoginUserDataDTO> findByEmail(String email);

}
