package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.buyer.CommissionRequestDTO;
import com.artaura.artaura.dto.buyer.CommissionResponseDTO;

import java.util.List;

public interface ComissionRequestDAO {
    Long saveCommissionRequest(CommissionRequestDTO dto);
    void saveReferenceImages(Long commissionRequestId, List<String> imageUrls);

    List<CommissionResponseDTO> getCommissionRequestsByClientId(Long clientId);
}
