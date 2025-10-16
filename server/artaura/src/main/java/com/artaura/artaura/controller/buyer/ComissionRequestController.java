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
        // Extract userId from JWT token
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.extractUserId(token);
        dto.setClientId(userId);

        Long commissionRequestId = commissionRequestService.createCommissionRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("commissionRequestId", commissionRequestId));
    }

    @GetMapping("/my-requests")
    public List<CommissionResponseDTO> getMyCommissionRequests(Authentication authentication) {
        Long buyerId = Long.valueOf(authentication.getName());
        return commissionRequestService.getRequestsByClientId(buyerId);
    }
}

