package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.ComissionRequestDAO;
import com.artaura.artaura.dto.buyer.CommissionRequestDTO;
import com.artaura.artaura.dto.buyer.CommissionResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommissionRequestService {
    @Autowired
    private ComissionRequestDAO commissionRequestDAO;

    public Long createCommissionRequest(CommissionRequestDTO dto) {
        Long commissionRequestId = commissionRequestDAO.saveCommissionRequest(dto);
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            commissionRequestDAO.saveReferenceImages(commissionRequestId, dto.getImageUrls());
        }
        return commissionRequestId;
    }

    public List<CommissionResponseDTO> getRequestsByClientId(Long clientId) {
        return commissionRequestDAO.getCommissionRequestsByClientId(clientId);
    }
}