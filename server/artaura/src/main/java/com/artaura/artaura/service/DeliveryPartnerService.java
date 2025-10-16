package com.artaura.artaura.service;

import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.util.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DeliveryPartnerService {
    
    @Autowired
    private DeliveryPartnerDAO deliveryPartnerDAO;
    
    @Autowired
    private PasswordEncoderUtil passwordEncoder;
    
    public Optional<String> getPartnerNameById(Long partnerId) {
        return deliveryPartnerDAO.getPartnerNameById(partnerId);
    }
    
    public Optional<Map<String, String>> getPartnerProfileById(Long partnerId) {
        return deliveryPartnerDAO.getPartnerProfileById(partnerId);
    }
    
    public boolean updatePartnerName(Long partnerId, String newName) {
        return deliveryPartnerDAO.updatePartnerName(partnerId, newName);
    }
    
    public boolean changePassword(Long partnerId, String newPassword) {
        String hashedPassword = passwordEncoder.encode(newPassword);
        return deliveryPartnerDAO.updatePartnerPassword(partnerId, hashedPassword);
    }
}