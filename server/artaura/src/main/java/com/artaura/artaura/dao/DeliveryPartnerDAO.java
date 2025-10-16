package com.artaura.artaura.dao;

import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import java.util.Optional;
import java.util.Map;

public interface DeliveryPartnerDAO {
    Optional<LoginUserDataDTO> findByEmail(String email);
    Optional<String> getPartnerNameById(Long partnerId);
    Optional<Map<String, String>> getPartnerProfileById(Long partnerId);
    boolean updatePartnerName(Long partnerId, String newName);
    boolean updatePartnerPassword(Long partnerId, String hashedPassword);
}