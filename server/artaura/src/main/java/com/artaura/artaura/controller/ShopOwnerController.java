package com.artaura.artaura.controller;

import com.artaura.artaura.dto.ShopOwnerSignupRequest;
import com.artaura.artaura.service.ShopOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop")
public class ShopOwnerController {

    @Autowired
    private ShopOwnerService shopOwnerService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody ShopOwnerSignupRequest req) {
        shopOwnerService.register(req);
        return ResponseEntity.ok("Shop owner registered successfully");
    }
}
