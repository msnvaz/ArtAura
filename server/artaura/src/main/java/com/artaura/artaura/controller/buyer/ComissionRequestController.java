package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.dto.buyer.AWOrderDto;
import com.artaura.artaura.dto.buyer.CommissionResponseDTO;
import com.artaura.artaura.dto.buyer.CommissionRequestDTO;
import com.artaura.artaura.service.buyer.CommissionRequestService;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commissions")
public class ComissionRequestController {

    @Autowired
    private CommissionRequestService commissionRequestService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/request")
    @PreAuthorize("hasAnyRole('BUYER','ARTIST','SHOP')")
    public ResponseEntity<?> createCommissionRequest(
            @RequestBody CommissionRequestDTO dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            // Debug logging
            System.out.println("=== Commission Request Debug ===");
            System.out.println("Received DTO: " + dto);
            System.out.println("Artist ID: " + dto.getArtistId());
            System.out.println("Client Name: " + dto.getClientName());
            System.out.println("Title: " + dto.getTitle());

            // Extract userId from JWT token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Long userId = jwtUtil.extractUserId(token);
            dto.setClientId(userId);

            System.out.println("User ID from token: " + userId);

            // Validate required fields
            if (dto.getArtistId() == null) {
                System.err.println("ERROR: Artist ID is null");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "message", "Artist ID is required"
                ));
            }

            // Set default status if not provided
            if (dto.getStatus() == null || dto.getStatus().isEmpty()) {
                dto.setStatus("PENDING");
            }

            System.out.println("About to save commission request...");
            Long commissionRequestId = commissionRequestService.createCommissionRequest(dto);
            System.out.println("Commission request saved with ID: " + commissionRequestId);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "Commission request submitted successfully",
                    "commissionRequestId", commissionRequestId
            ));
        } catch (Exception e) {
            System.err.println("ERROR creating commission request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Error creating commission request: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/my-requests")
    public List<CommissionResponseDTO> getMyCommissionRequests(Authentication authentication) {
        Long buyerId = Long.valueOf(authentication.getName());
        return commissionRequestService.getRequestsByClientId(buyerId);
    }
}
