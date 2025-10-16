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
     * @return true if accepted successfully
     */
    boolean acceptCommissionRequest(Long requestId);

    /**
     * Reject a commission request
     *
     * @param requestId The ID of the commission request
     * @return true if rejected successfully
     */
    boolean rejectCommissionRequest(Long requestId);

    /**
     * Get a specific commission request by ID
     *
     * @param requestId The ID of the commission request
     * @return Commission request DTO
     */
    CommissionRequestDTO getCommissionRequestById(Long requestId);
}
