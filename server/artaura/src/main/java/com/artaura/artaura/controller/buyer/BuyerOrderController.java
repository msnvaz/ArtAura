package com.artaura.artaura.controller.buyer;
import com.artaura.artaura.dto.buyer.OrderRequest;
import com.artaura.artaura.service.buyer.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class BuyerOrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        // Optionally, set buyerId from authentication
        // orderRequest.setBuyerId(Long.valueOf(authentication.getName()));
        Long orderId = orderService.saveOrder(orderRequest);
        return ResponseEntity.ok(orderId);
    }
}
