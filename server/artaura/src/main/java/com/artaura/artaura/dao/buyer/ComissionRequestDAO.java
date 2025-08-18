package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.buyer.CommissionRequestDTO;

import java.util.List;

public interface ComissionRequestDAO {
    Long saveCommissionRequest(CommissionRequestDTO dto);
    void saveReferenceImages(Long commissionRequestId, List<String> imageUrls);
}
