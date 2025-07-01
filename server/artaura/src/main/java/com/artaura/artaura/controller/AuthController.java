package com.artaura.artaura.controller;

import com.artaura.artaura.dto.*;
import com.artaura.artaura.service.AuthService;
import com.artaura.artaura.service.RegisterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    @Autowired private RegisterService registerService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/artist")
    public ResponseEntity<?> registerArtist(@Valid @RequestBody ArtistRegisterRequest req) {
        registerService.registerArtist(req);
        return ResponseEntity.ok("Artist registered successfully");
    }

    @PostMapping("/buyer")
    public ResponseEntity<?> registerBuyer(@Valid @RequestBody BuyerRegisterRequest req) {
        registerService.registerBuyer(req);
        return ResponseEntity.ok("Buyer registered successfully");
    }

    @PostMapping("/shop")
    public ResponseEntity<?> registerShop(@Valid @RequestBody ShopRegisterRequest req) {
        registerService.registerShop(req);
        return ResponseEntity.ok("Shop account registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO.LoginRequest loginRequest) {
        try {
            LoginDTO.LoginResponse response = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", ex.getMessage()));
        }
    }
}
