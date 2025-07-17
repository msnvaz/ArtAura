package com.artaura.artaura.controller;

import com.artaura.artaura.dto.auth.LoginRequest;
import com.artaura.artaura.dto.auth.LoginResponse;
import com.artaura.artaura.dto.ApiResponse;
import com.artaura.artaura.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint for admin dashboard and other users
     * For JWT tokens, logout is typically handled on the client side
     * by removing the token from storage
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletRequest request) {
        try {
            // Extract token from Authorization header for logging purposes
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // Token exists, logout successful
                // In a production app, you might want to:
                // 1. Add token to a blacklist/redis cache
                // 2. Log the logout event
                // 3. Clear any server-side sessions
                
                return ResponseEntity.ok(new ApiResponse(
                    true, 
                    "Logout successful. Please remove the token from client storage.", 
                    null
                ));
            } else {
                return ResponseEntity.ok(new ApiResponse(
                    true, 
                    "Logout successful. No active session found.", 
                    null
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(
                false, 
                "Logout failed: " + e.getMessage(), 
                null
            ));
        }
    }

    /**
     * Check if user is authenticated (useful for frontend to verify login status)
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verifyToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // In a real implementation, you would validate the JWT token here
                // For now, we'll just check if the header exists
                return ResponseEntity.ok(new ApiResponse(
                    true, 
                    "Token header found", 
                    null
                ));
            } else {
                return ResponseEntity.status(401).body(new ApiResponse(
                    false, 
                    "No token provided", 
                    null
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(
                false, 
                "Token verification failed: " + e.getMessage(), 
                null
            ));
        }
    }
}
