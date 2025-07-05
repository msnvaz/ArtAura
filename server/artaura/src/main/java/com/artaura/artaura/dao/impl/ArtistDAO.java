package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dto.ArtistSignupRequest;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;

import java.util.Optional;

public interface ArtistDAO {
    // ✅ Declare it here
    boolean emailExists(String email);
    void save(ArtistSignupRequest request, String hashedPassword);
    Optional<LoginUserDataDTO> findByEmail(String email);

}
