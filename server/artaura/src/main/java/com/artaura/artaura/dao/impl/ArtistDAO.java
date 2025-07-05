package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dto.ArtistSignupRequest;

public interface ArtistDAO {
    // ✅ Declare it here
    boolean emailExists(String email);
    void save(ArtistSignupRequest request, String hashedPassword);
    ArtistSignupRequest findByEmail(String email);
}
