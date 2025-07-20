package com.artaura.artaura.controller;

import com.artaura.artaura.dto.auth.LoginRequest;
import com.artaura.artaura.dto.auth.LoginResponse;
//import com.artaura.artaura.dto.ApiResponse;
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
        System.out.println("📧 Login attempt for email: " + request.getEmail());
        
        try {
            LoginResponse response = authService.login(request);
            System.out.println("✅ Login successful - Token created and returned to client");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Login failed: " + e.getMessage());
            throw e;
        }
    }
}
