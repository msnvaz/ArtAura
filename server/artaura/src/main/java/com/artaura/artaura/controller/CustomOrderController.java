package com.artaura.artaura.controller;

import com.artaura.artaura.dto.order.CustomOrderDTO;
import com.artaura.artaura.dto.order.OrderAcceptRequest;
import com.artaura.artaura.dto.order.OrderResponseDTO;
import com.artaura.artaura.service.CustomOrderService;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class CustomOrderController {

    @Autowired
    private CustomOrderService customOrderService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Get all orders for the logged-in artist
     */
    @GetMapping("/artist")
    public ResponseEntity<OrderResponseDTO> getArtistOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long artistId = jwtUtil.extractUserId(token);

            List<CustomOrderDTO> orders = customOrderService.getOrdersByArtistId(artistId);

            return ResponseEntity.ok(new OrderResponseDTO("Orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error retrieving orders: " + e.getMessage(), null, false));
        }
    }

    /**
     * Get orders count for the logged-in artist
     */
    @GetMapping("/artist/count")
    public ResponseEntity<OrderResponseDTO> getArtistOrdersCount(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long artistId = jwtUtil.extractUserId(token);

            int ordersCount = customOrderService.getOrdersCountByArtistId(artistId);

            return ResponseEntity.ok(new OrderResponseDTO("Orders count retrieved successfully", ordersCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error retrieving orders count: " + e.getMessage(), null, false));
        }
    }

    /**
     * Get pending orders count for the logged-in artist
     */
    @GetMapping("/artist/pending-count")
    public ResponseEntity<OrderResponseDTO> getArtistPendingOrdersCount(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long artistId = jwtUtil.extractUserId(token);

            int pendingCount = customOrderService.getPendingOrdersCountByArtistId(artistId);

            return ResponseEntity.ok(new OrderResponseDTO("Pending orders count retrieved successfully", pendingCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error retrieving pending orders count: " + e.getMessage(), null, false));
        }
    }

    /**
     * Get all orders for the logged-in buyer
     */
    @GetMapping("/buyer")
    public ResponseEntity<OrderResponseDTO> getBuyerOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long buyerId = jwtUtil.extractUserId(token);

            List<CustomOrderDTO> orders = customOrderService.getOrdersByBuyerId(buyerId);

            return ResponseEntity.ok(new OrderResponseDTO("Orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error retrieving orders: " + e.getMessage(), null, false));
        }
    }

    /**
     * Get a specific order by ID
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long orderId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Optional<CustomOrderDTO> orderOpt = customOrderService.getOrderById(orderId);

            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new OrderResponseDTO("Order not found", null, false));
            }

            // Verify that the requesting user is either the artist or buyer for this order
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            CustomOrderDTO order = orderOpt.get();

            if (!userId.equals(order.getArtistId()) && !userId.equals(order.getBuyerId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OrderResponseDTO("Access denied", null, false));
            }

            return ResponseEntity.ok(new OrderResponseDTO("Order retrieved successfully", order));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error retrieving order: " + e.getMessage(), null, false));
        }
    }

    /**
     * Accept an order (artist only)
     */
    @PostMapping("/{orderId}/accept")
    public ResponseEntity<OrderResponseDTO> acceptOrder(@PathVariable Long orderId,
            @RequestBody OrderAcceptRequest acceptRequest,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify that the requesting user is the artist for this order
            String token = authHeader.substring(7);
            Long artistId = jwtUtil.extractUserId(token);

            Optional<CustomOrderDTO> orderOpt = customOrderService.getOrderById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new OrderResponseDTO("Order not found", null, false));
            }

            CustomOrderDTO order = orderOpt.get();
            if (!artistId.equals(order.getArtistId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OrderResponseDTO("Access denied", null, false));
            }

            customOrderService.acceptOrder(orderId, acceptRequest);

            return ResponseEntity.ok(new OrderResponseDTO("Order accepted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error accepting order: " + e.getMessage(), null, false));
        }
    }

    /**
     * Reject an order (artist only)
     */
    @PostMapping("/{orderId}/reject")
    public ResponseEntity<OrderResponseDTO> rejectOrder(@PathVariable Long orderId,
            @RequestBody String rejectionReason,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify that the requesting user is the artist for this order
            String token = authHeader.substring(7);
            Long artistId = jwtUtil.extractUserId(token);

            Optional<CustomOrderDTO> orderOpt = customOrderService.getOrderById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new OrderResponseDTO("Order not found", null, false));
            }

            CustomOrderDTO order = orderOpt.get();
            if (!artistId.equals(order.getArtistId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OrderResponseDTO("Access denied", null, false));
            }

            customOrderService.rejectOrder(orderId, rejectionReason);

            return ResponseEntity.ok(new OrderResponseDTO("Order rejected successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error rejecting order: " + e.getMessage(), null, false));
        }
    }

    /**
     * Update order status (for workflow management)
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable Long orderId,
            @RequestParam String status,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify that the requesting user is the artist for this order
            String token = authHeader.substring(7);
            Long artistId = jwtUtil.extractUserId(token);

            Optional<CustomOrderDTO> orderOpt = customOrderService.getOrderById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new OrderResponseDTO("Order not found", null, false));
            }

            CustomOrderDTO order = orderOpt.get();
            if (!artistId.equals(order.getArtistId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OrderResponseDTO("Access denied", null, false));
            }

            customOrderService.updateOrderStatus(orderId, status);

            return ResponseEntity.ok(new OrderResponseDTO("Order status updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error updating order status: " + e.getMessage(), null, false));
        }
    }

    /**
     * Create a new order (buyer only)
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody CustomOrderDTO orderDTO,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long buyerId = jwtUtil.extractUserId(token);

            // Set the buyer ID from token
            orderDTO.setBuyerId(buyerId);

            Long orderId = customOrderService.createOrder(orderDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new OrderResponseDTO("Order created successfully", orderId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error creating order: " + e.getMessage(), null, false));
        }
    }
}
