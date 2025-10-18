package com.artaura.artaura.controller.buyer;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.artaura.artaura.dto.buyer.CommissionPaymentRequestDTO;
import com.artaura.artaura.service.buyer.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
    
    @Autowired
    private OrderService orderService;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Map<String, Object> data) {
        try {
            // Stripe expects amount in the smallest currency unit (cents)
            long amount = 0;
            Object amountObj = data.get("amount");
            if (amountObj instanceof Number) {
                amount = ((Number) amountObj).longValue();
            } else if (amountObj instanceof String) {
                amount = Long.parseLong((String) amountObj);
            }
            String currency = data.getOrDefault("currency", "lkr").toString();
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency(currency)
                    .addPaymentMethodType("card")
                    .build();
            PaymentIntent intent = PaymentIntent.create(params);
            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", intent.getClientSecret());
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Stripe error: " + e.getMessage());
        }
    }

    @PostMapping("/commissions/process")
    public ResponseEntity<?> processCommissionPayment(
            @RequestBody CommissionPaymentRequestDTO paymentRequest) {

        try {
            // Get the authenticated user ID from SecurityContext (set by JwtAuthFilter)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Authentication required");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Extract buyerId from the authenticated user (principal contains userId as string)
            String userIdStr = (String) authentication.getPrincipal();
            Long buyerId;
            
            try {
                buyerId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid user ID format");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Process the commission payment using orderService
            boolean success = orderService.processCommissionPayment(paymentRequest, buyerId);

            if (success) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Commission payment processed successfully");
                response.put("status", "success");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Failed to process commission payment");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error processing commission payment: " + e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
