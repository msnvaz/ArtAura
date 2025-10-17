package com.artaura.artaura.dao;

import com.artaura.artaura.dto.commission.CommissionRequestDTO;
import java.util.List;

public interface CommissionRequestDAO {

    /**
     * Get all commission requests for a specific artist
     *
     * @param artistId The ID of the artist
     * @return List of commission requests
     */
    List<CommissionRequestDTO> getCommissionRequestsByArtistId(Long artistId);

    /**
     * Get all commission requests made by a specific buyer
     *
     * @param buyerId The ID of the buyer
     * @return List of commission requests
     */
    List<CommissionRequestDTO> getCommissionRequestsByBuyerId(Long buyerId);

    /**
     * Accept a commission request
     *
     * @param requestId The ID of the commission request
     * @param deadline The artist's proposed deadline for the commission
     * @return true if accepted successfully
     */
    boolean acceptCommissionRequest(Long requestId, String deadline);

    /**
     * Reject a commission request
     *
     * @param requestId The ID of the commission request
     * @param rejectionReason The reason for rejecting the commission
     * @return true if rejected successfully
     */
    boolean rejectCommissionRequest(Long requestId, String rejectionReason);

    /**
     * Get a specific commission request by ID
     *
     * @param requestId The ID of the commission request
     * @return Commission request DTO
     */
    CommissionRequestDTO getCommissionRequestById(Long requestId);
}
