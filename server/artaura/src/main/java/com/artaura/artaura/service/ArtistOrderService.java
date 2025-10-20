package com.artaura.artaura.service;

import com.artaura.artaura.dao.ArtistOrderDAO;
import com.artaura.artaura.dto.order.ArtistOrderDTO;
import com.artaura.artaura.dto.order.CreateOrderRequestDTO;
import com.artaura.artaura.dto.order.ShopOrderDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArtistOrderService {

    @Autowired
    private ArtistOrderDAO artistOrderDAO;

    @Autowired
    private ProductService productService;

    /**
     * Create a new order when artist buys a product
     */
    @Transactional
    public Long createOrder(CreateOrderRequestDTO request) {
        // Validate product exists and has stock
        var product = productService.getProductById(request.getProductId());

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        // Check stock availability
        if (!artistOrderDAO.checkProductStock(request.getProductId(), request.getQuantity())) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }

        // Calculate total
        Double total = product.getPrice() * request.getQuantity();

        // Create order
        return artistOrderDAO.createOrder(
                request.getArtistId(),
                request.getProductId(),
                request.getQuantity(),
                total);
    }

    /**
     * Get all orders for a specific artist
     */
    public List<ArtistOrderDTO> getArtistOrders(Long artistId) {
        return artistOrderDAO.getOrdersByArtist(artistId);
    }

    /**
     * Get all orders for a specific shop
     */
    public List<ShopOrderDTO> getShopOrders(Long shopId) {
        return artistOrderDAO.getOrdersByShop(shopId);
    }

    /**
     * Approve order (shop accepts the order)
     * This will trigger the database trigger to decrease stock
     */
    @Transactional
    public void approveOrder(Long orderId) {
        ArtistOrderDTO order = artistOrderDAO.getOrderById(orderId);

        if (order == null) {
            throw new RuntimeException("Order not found");
        }

        if (!"pending".equals(order.getStatus())) {
            throw new RuntimeException("Only pending orders can be approved");
        }

        // Check stock one more time before approving
        if (!artistOrderDAO.checkProductStock(order.getProductId(), order.getQuantity())) {
            throw new RuntimeException("Insufficient stock to approve order");
        }

        // Update status to approved
        // The database trigger will automatically decrease stock
        artistOrderDAO.updateOrderStatus(orderId, "approved");
    }

    /**
     * Cancel order
     * If order was previously approved, the trigger will restore stock
     */
    @Transactional
    public void cancelOrder(Long orderId) {
        ArtistOrderDTO order = artistOrderDAO.getOrderById(orderId);

        if (order == null) {
            throw new RuntimeException("Order not found");
        }

        // Update status to cancelled
        // If it was approved, the database trigger will restore stock
        artistOrderDAO.updateOrderStatus(orderId, "cancelled");
    }

    /**
     * Get order by ID
     */
    public ArtistOrderDTO getOrderById(Long orderId) {
        return artistOrderDAO.getOrderById(orderId);
    }
}
