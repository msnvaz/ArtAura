package com.artaura.artaura.dao;

import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import java.util.Optional;

public interface DeliveryPartnerDAO {
    Optional<LoginUserDataDTO> findByEmail(String email);
}