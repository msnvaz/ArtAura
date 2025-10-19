package com.artaura.artaura.controller;

import com.artaura.artaura.dto.order.ArtistOrderDTO;
import com.artaura.artaura.dto.order.CreateOrderRequestDTO;
import com.artaura.artaura.dto.order.ShopOrderDTO;
import com.artaura.artaura.service.ArtistOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/artist-orders")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class ArtistOrderController {

    @Autowired
    private ArtistOrderService artistOrderService;

    /**
     * Create a new order when artist buys a product
     * POST /api/artist-orders/create
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody CreateOrderRequestDTO request) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("📦 Creating order for artist " + request.getArtistId() +
                    ", product " + request.getProductId() +
                    ", quantity " + request.getQuantity());

            Long orderId = artistOrderService.createOrder(request);

            response.put("success", true);
            response.put("message", "Order created successfully");
            response.put("orderId", orderId);

            System.out.println("✅ Order created with ID: " + orderId);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Error creating order: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            System.err.println("❌ Unexpected error creating order: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all orders for an artist
     * GET /api/artist-orders/artist/{artistId}
     */
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<ArtistOrderDTO>> getArtistOrders(@PathVariable Long artistId) {
        try {
            System.out.println("📋 Fetching orders for artist: " + artistId);
            List<ArtistOrderDTO> orders = artistOrderService.getArtistOrders(artistId);
            System.out.println("✅ Found " + orders.size() + " orders for artist " + artistId);
            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            System.err.println("❌ Error fetching artist orders: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get all orders for a shop
     * GET /api/artist-orders/shop/{shopId}
     */
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<ShopOrderDTO>> getShopOrders(@PathVariable Long shopId) {
        try {
            System.out.println("📋 Fetching orders for shop: " + shopId);
            List<ShopOrderDTO> orders = artistOrderService.getShopOrders(shopId);
            System.out.println("✅ Found " + orders.size() + " orders for shop " + shopId);
            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            System.err.println("❌ Error fetching shop orders: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Approve an order (shop owner action)
     * PUT /api/artist-orders/{orderId}/approve
     */
    @PutMapping("/{orderId}/approve")
    public ResponseEntity<Map<String, Object>> approveOrder(@PathVariable Long orderId) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("✅ Approving order: " + orderId);
            artistOrderService.approveOrder(orderId);

            response.put("success", true);
            response.put("message", "Order approved successfully");

            System.out.println("✅ Order " + orderId + " approved");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Error approving order: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            System.err.println("❌ Unexpected error approving order: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to approve order");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Cancel an order
     * PUT /api/artist-orders/{orderId}/cancel
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable Long orderId) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("❌ Cancelling order: " + orderId);
            artistOrderService.cancelOrder(orderId);

            response.put("success", true);
            response.put("message", "Order cancelled successfully");

            System.out.println("✅ Order " + orderId + " cancelled");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Error cancelling order: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            System.err.println("❌ Unexpected error cancelling order: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to cancel order");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get order by ID
     * GET /api/artist-orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ArtistOrderDTO> getOrderById(@PathVariable Long orderId) {
        try {
            System.out.println("📋 Fetching order: " + orderId);
            ArtistOrderDTO order = artistOrderService.getOrderById(orderId);
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            System.err.println("❌ Error fetching order: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
