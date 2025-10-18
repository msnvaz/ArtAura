package com.artaura.artaura.controller;

import com.artaura.artaura.dto.dashboard.DashboardStatsDTO;
import com.artaura.artaura.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop/dashboard")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private DashboardService dashboardService;

    /**
     * GET /api/shop/dashboard/stats?shopId=1
     * Get dashboard statistics for a shop
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(@RequestParam Long shopId) {

        try {
            logger.info("Fetching dashboard stats for shop: {}", shopId);

            if (shopId == null) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Shop ID is required"));
            }

            DashboardStatsDTO stats = dashboardService.getDashboardStats(shopId);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            logger.error("Error fetching dashboard stats for shop: {}", shopId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch dashboard statistics: " + e.getMessage()));
        }
    }

    // Error Response DTO
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
