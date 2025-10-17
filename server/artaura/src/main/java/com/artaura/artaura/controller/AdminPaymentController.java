package com.artaura.artaura.controller;

import com.artaura.artaura.dto.admin.AdminPaymentDTO;
import com.artaura.artaura.dto.admin.AdminPaymentFilterDTO;
import com.artaura.artaura.dto.admin.AdminPaymentResponseDTO;
import com.artaura.artaura.service.AdminPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminPaymentController {

    @Autowired
    private AdminPaymentService adminPaymentService;

    /**
     * Get all payments with pagination and filtering
     * GET /api/admin/payments?page=0&size=10&status=escrow&paymentType=order&sortBy=created_at&sortOrder=DESC
     */
    @GetMapping
    public ResponseEntity<AdminPaymentResponseDTO> getAllPayments(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "paymentType", required = false) String paymentType,
            @RequestParam(value = "artistId", required = false) Long artistId,
            @RequestParam(value = "buyerId", required = false) Long buyerId,
            @RequestParam(value = "sortBy", defaultValue = "created_at") String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "DESC") String sortOrder) {
        
        try {
            AdminPaymentFilterDTO filter = new AdminPaymentFilterDTO(
                status, paymentType, artistId, buyerId, sortBy, sortOrder, page, size
            );
            
            AdminPaymentResponseDTO response = adminPaymentService.getAllPayments(filter);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payment by ID
     * GET /api/admin/payments/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminPaymentDTO> getPaymentById(@PathVariable Integer id) {
        try {
            Optional<AdminPaymentDTO> payment = adminPaymentService.getPaymentById(id);
            
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payments by artist ID
     * GET /api/admin/payments/artist/{artistId}
     */
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<AdminPaymentDTO>> getPaymentsByArtistId(@PathVariable Long artistId) {
        try {
            List<AdminPaymentDTO> payments = adminPaymentService.getPaymentsByArtistId(artistId);
            return ResponseEntity.ok(payments);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payments by buyer ID
     * GET /api/admin/payments/buyer/{buyerId}
     */
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<AdminPaymentDTO>> getPaymentsByBuyerId(@PathVariable Long buyerId) {
        try {
            List<AdminPaymentDTO> payments = adminPaymentService.getPaymentsByBuyerId(buyerId);
            return ResponseEntity.ok(payments);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payment statistics
     * GET /api/admin/payments/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Object> getPaymentStatistics() {
        try {
            Object statistics = adminPaymentService.getPaymentStatistics();
            return ResponseEntity.ok(statistics);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update payment status
     * PUT /api/admin/payments/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String status = request.get("status");
            
            if (status == null || status.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Status is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = adminPaymentService.updatePaymentStatus(id, status);
            
            if (updated) {
                response.put("success", true);
                response.put("message", "Payment status updated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Payment not found or failed to update");
                return ResponseEntity.notFound().build();
            }
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Search payments
     * GET /api/admin/payments/search?query=searchTerm
     */
    @GetMapping("/search")
    public ResponseEntity<List<AdminPaymentDTO>> searchPayments(
            @RequestParam("query") String query) {
        
        try {
            List<AdminPaymentDTO> payments = adminPaymentService.searchPayments(query);
            return ResponseEntity.ok(payments);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get distinct payment statuses
     * GET /api/admin/payments/statuses
     */
    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getDistinctStatuses() {
        try {
            List<String> statuses = adminPaymentService.getDistinctStatuses();
            return ResponseEntity.ok(statuses);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}