package com.artaura.artaura.dao.artist;

import com.artaura.artaura.dto.artist.ArtistArtworkOrderDTO;
import java.util.List;

/**
 * DAO interface for handling artwork orders from the artist's perspective
 * Provides access to AW_orders and AW_order_items data filtered by artist
 */
public interface ArtistArtworkOrderDAO {

    /**
     * Get all artwork orders for a specific artist
     *
     * @param artistId The ID of the artist
     * @return List of artwork orders containing order and item details
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
     * Update delivery status for an artwork order
     *
     * @param orderId The order ID
     * @param deliveryStatus The new delivery status (pending, accepted,
     * outForDelivery, delivered, N/A)
     * @return true if update was successful
     */
    boolean updateOrderDeliveryStatus(Long orderId, String deliveryStatus);
}
