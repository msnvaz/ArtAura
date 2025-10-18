package com.artaura.artaura.controller;

import com.artaura.artaura.service.AdminOverviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/overview")
@CrossOrigin(origins = "*")
public class AdminOverviewController {

    @Autowired
    private AdminOverviewService adminOverviewService;

    /**
     * Get comprehensive overview statistics for admin dashboard
     * @return ResponseEntity with overview statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOverviewStatistics() {
        try {
            Map<String, Object> statistics = adminOverviewService.getOverviewStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get user statistics breakdown
     * @return ResponseEntity with user statistics
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Integer>> getUserStatistics() {
        try {
            Map<String, Integer> userStats = adminOverviewService.getUserStatistics();
            return ResponseEntity.ok(userStats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get financial statistics including platform fees
     * @return ResponseEntity with financial statistics
     */
    @GetMapping("/financial")
    public ResponseEntity<Map<String, Object>> getFinancialStatistics() {
        try {
            Map<String, Object> financialStats = adminOverviewService.getFinancialStatistics();
            return ResponseEntity.ok(financialStats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get moderation statistics
     * @return ResponseEntity with moderation statistics
     */
    @GetMapping("/moderation")
    public ResponseEntity<Map<String, Integer>> getModerationStatistics() {
        try {
            Map<String, Integer> moderationStats = adminOverviewService.getModerationStatistics();
            return ResponseEntity.ok(moderationStats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}