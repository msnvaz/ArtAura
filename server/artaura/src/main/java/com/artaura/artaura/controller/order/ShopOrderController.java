package com.artaura.artaura.controller.order;

import com.artaura.artaura.dto.order.ShopOrderDTO;
import com.artaura.artaura.service.order.ShopOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop/orders")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class ShopOrderController {

    private static final Logger logger = LoggerFactory.getLogger(ShopOrderController.class);

    @Autowired
    private ShopOrderService shopOrderService;

    @GetMapping
    public ResponseEntity<List<ShopOrderDTO>> getOrdersByShopId(@RequestParam Long shopId) {
        logger.info("Received request to get orders for shop ID: {}", shopId);
        try {
            List<ShopOrderDTO> orders = shopOrderService.getOrdersByShopId(shopId);
            logger.info("Returning {} orders for shop ID: {}", orders.size(), shopId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error fetching orders for shop ID: {}", shopId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ShopOrderDTO> getOrderById(@PathVariable Long orderId) {
        logger.info("Received request to get order ID: {}", orderId);
        try {
            ShopOrderDTO order = shopOrderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            logger.error("Order not found: {}", orderId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Error fetching order ID: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<ShopOrderDTO> createOrder(@RequestBody ShopOrderDTO order) {
        logger.info("Received request to create order: {}", order);
        try {
            ShopOrderDTO createdOrder = shopOrderService.createOrder(order);
            logger.info("Order created successfully with ID: {}", createdOrder.getOrderId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (Exception e) {
            logger.error("Error creating order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<ShopOrderDTO> updateOrder(@PathVariable Long orderId, @RequestBody ShopOrderDTO order) {
        logger.info("Received request to update order ID: {} with data: {}", orderId, order);
        try {
            order.setOrderId(orderId);
            ShopOrderDTO updatedOrder = shopOrderService.updateOrder(order);
            logger.info("Order updated successfully: {}", updatedOrder);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            logger.error("Error updating order ID: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        logger.info("Received request to delete order ID: {}", orderId);
        try {
            shopOrderService.deleteOrder(orderId);
            logger.info("Order deleted successfully: {}", orderId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting order ID: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ShopOrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        logger.info("Received request to update order ID: {} to status: {}", orderId, status);
        try {
            ShopOrderDTO order = shopOrderService.getOrderById(orderId);
            if (order == null) {
                logger.warn("Order not found with ID: {}", orderId);
                return ResponseEntity.notFound().build();
            }
            order.setStatus(status);
            ShopOrderDTO updatedOrder = shopOrderService.updateOrder(order);
            logger.info("Order status updated successfully: {}", updatedOrder);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            logger.error("Error updating order status for ID: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
