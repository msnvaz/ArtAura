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
@RequestMapping("/api/order-management")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private CustomOrderService customOrderService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/artist")
    public ResponseEntity<OrderResponseDTO> getArtistOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long artistId = jwtUtil.extractUserId(token);

            List<CustomOrderDTO> orders = customOrderService.getOrdersByArtistId(artistId);

            return ResponseEntity.ok(new OrderResponseDTO("Orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderResponseDTO("Error retrieving orders: " + e.getMessage(), null, false));
        }
    }

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

    @PostMapping("/{orderId}/accept")
    public ResponseEntity<OrderResponseDTO> acceptOrder(@PathVariable Long orderId,
            @RequestBody OrderAcceptRequest acceptRequest,
            @RequestHeader("Authorization") String authHeader) {
        try {
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

    @PostMapping("/{orderId}/reject")
    public ResponseEntity<OrderResponseDTO> rejectOrder(@PathVariable Long orderId,
            @RequestBody String rejectionReason,
            @RequestHeader("Authorization") String authHeader) {
        try {
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

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable Long orderId,
            @RequestParam String status,
            @RequestHeader("Authorization") String authHeader) {
        try {
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
}
