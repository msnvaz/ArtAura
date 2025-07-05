package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dto.BuyerSignupRequest;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;

import java.util.Optional;

public interface BuyerDAO {
    // ✅ Declare it here
    boolean emailExists(String email);
    void save(BuyerSignupRequest request, String hashedPassword);
    Optional<LoginUserDataDTO> findByEmail(String email);

}
