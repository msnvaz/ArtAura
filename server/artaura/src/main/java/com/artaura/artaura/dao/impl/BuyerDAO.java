package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dto.BuyerSignupRequest;

public interface BuyerDAO {
    // ✅ Declare it here
    boolean emailExists(String email);
    void save(BuyerSignupRequest request, String hashedPassword);
    BuyerSignupRequest findByEmail(String email);
}
