package com.artaura.artaura.dao;

import com.artaura.artaura.dto.order.CustomOrderDTO;
import com.artaura.artaura.dto.order.OrderAcceptRequest;

import java.util.List;
import java.util.Optional;

public interface CustomOrderDAO {
    
    // Get all orders for a specific artist
    List<CustomOrderDTO> getOrdersByArtistId(Long artistId);
    
    // Get all orders for a specific buyer
    List<CustomOrderDTO> getOrdersByBuyerId(Long buyerId);
    
    // Get a specific order by ID
    Optional<CustomOrderDTO> getOrderById(Long orderId);
    
    // Accept an order
    void acceptOrder(Long orderId, OrderAcceptRequest acceptRequest);
    
    // Reject an order
    void rejectOrder(Long orderId, String rejectionReason);
    
    // Update order status
    void updateOrderStatus(Long orderId, String status);
    
    // Create a new order (for buyers)
    Long createOrder(CustomOrderDTO orderDTO);
    
    // Get orders count for artist
    int getOrdersCountByArtistId(Long artistId);
    
    // Get pending orders count for artist
    int getPendingOrdersCountByArtistId(Long artistId);
}
