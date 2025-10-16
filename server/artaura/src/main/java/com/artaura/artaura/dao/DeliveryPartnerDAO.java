package com.artaura.artaura.dao;

import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import com.artaura.artaura.dto.auth.DeliveryPartnerDTO;
import java.util.Optional;

public interface DeliveryPartnerDAO {
    Optional<LoginUserDataDTO> findByEmail(String email);
    Optional<DeliveryPartnerDTO> findByEmailWithName(String email);
    Optional<DeliveryPartnerDTO> findByUserId(Long userId);
}