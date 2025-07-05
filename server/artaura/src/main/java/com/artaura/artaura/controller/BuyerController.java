package com.artaura.artaura.controller;

import com.artaura.artaura.dto.BuyerSignupRequest;
import com.artaura.artaura.service.BuyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buyer")
public class BuyerController {

    @Autowired
    private BuyerService buyerService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody BuyerSignupRequest req) {
        buyerService.register(req);
        return ResponseEntity.ok("Buyer registered successfully");
    }
}
