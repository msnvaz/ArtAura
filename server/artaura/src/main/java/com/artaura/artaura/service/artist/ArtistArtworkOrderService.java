package com.artaura.artaura.service.artist;

import com.artaura.artaura.dto.artist.ArtistArtworkOrderDTO;
import java.util.List;

/**
 * Service interface for handling artist artwork orders business logic
 */
public interface ArtistArtworkOrderService {

    /**
     * Get all artwork orders for a specific artist
     *
     * @param artistId The ID of the artist
     * @return List of artwork orders with order items
     */
    List<ArtistArtworkOrderDTO> getArtworkOrdersByArtistId(Long artistId);

    /**
     * Get count of all artwork orders for a specific artist
     *
     * @param artistId The ID of the artist
     * @return Total count of artwork orders
     */
    int getArtworkOrdersCountByArtistId(Long artistId);

    /**
     * Get count of artwork orders with pending delivery status for a specific
     * artist
     *
     * @param artistId The ID of the artist
     * @return Count of orders with pending delivery status
     */
    int getPendingDeliveryOrdersCountByArtistId(Long artistId);

    /**
     * Request delivery for an artwork order (change status from N/A to pending)
     *
     * @param orderId The order ID
     * @param artistId The artist ID (for verification)
     * @return true if delivery request was successful
     */
    boolean requestDelivery(Long orderId, Long artistId);
}
