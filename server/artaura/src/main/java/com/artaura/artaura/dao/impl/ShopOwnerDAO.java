package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dto.ShopOwnerSignupRequest;

public interface ShopOwnerDAO {
    // ✅ Declare it here
    boolean emailExists(String email);
    void save(ShopOwnerSignupRequest request, String hashedPassword);
    ShopOwnerSignupRequest findByEmail(String email);
}
