package com.artaura.artaura.dao;

import com.artaura.artaura.dto.order.ArtistOrderDTO;
import com.artaura.artaura.dto.order.ShopOrderDTO;
import java.util.List;

public interface ArtistOrderDAO {

    /**
     * Create a new order when artist buys a product
     */
    Long createOrder(Long artistId, Long productId, Integer quantity, Double total);

    /**
     * Get all orders for a specific artist
     */
    List<ArtistOrderDTO> getOrdersByArtist(Long artistId);

    /**
     * Get all orders for a specific shop
     */
    List<ShopOrderDTO> getOrdersByShop(Long shopId);

    /**
     * Update order status (approve or cancel)
     */
    void updateOrderStatus(Long orderId, String status);

    /**
     * Get order by ID
     */
    ArtistOrderDTO getOrderById(Long orderId);

    /**
     * Check if product has enough stock
     */
    boolean checkProductStock(Long productId, Integer quantity);
}
