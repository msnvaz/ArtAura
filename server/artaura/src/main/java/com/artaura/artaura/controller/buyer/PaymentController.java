package com.artaura.artaura.controller.buyer;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Value("${STRIPE_SECRET_KEY}")
    private String stripeSecretKey;

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
}
