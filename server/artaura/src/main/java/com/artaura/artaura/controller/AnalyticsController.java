package com.artaura.artaura.controller;

import com.artaura.artaura.dto.analytics.AnalyticsDTO;
import com.artaura.artaura.service.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop/analytics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * GET /api/shop/analytics?shopId=1&period=30days
     * Get analytics data for a shop
     */
    @GetMapping
    public ResponseEntity<?> getAnalytics(
            @RequestParam Long shopId,
            @RequestParam(defaultValue = "30days") String period) {
        
        try {
            logger.info("Fetching analytics for shop: {} with period: {}", shopId, period);
            
            if (shopId == null) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Shop ID is required"));
            }

            // Validate period parameter
            if (!isValidPeriod(period)) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Invalid period. Allowed values: 7days, 30days, 90days, 12months"));
            }

            AnalyticsDTO analytics = analyticsService.getAnalytics(shopId, period);
            
            return ResponseEntity.ok(analytics);
            
        } catch (Exception e) {
            logger.error("Error fetching analytics for shop: {}", shopId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch analytics: " + e.getMessage()));
        }
    }

    private boolean isValidPeriod(String period) {
        return period.equals("7days") || period.equals("30days") || 
               period.equals("90days") || period.equals("12months");
    }

    // Error response class
    private static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
