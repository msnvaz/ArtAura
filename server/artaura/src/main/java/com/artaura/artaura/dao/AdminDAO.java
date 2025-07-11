package com.artaura.artaura.dao;

import com.artaura.artaura.dto.auth.LoginUserDataDTO;

import java.util.Optional;

public interface AdminDAO {
    Optional<LoginUserDataDTO> findByEmail(String email);

}
