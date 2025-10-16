package com.artaura.artaura.controller;

import com.artaura.artaura.dto.shop.ShopDTO;
import com.artaura.artaura.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop")
@CrossOrigin(origins = "http://localhost:5173")
public class ShopController {

    @Autowired
    private ShopService shopService;

    // Fetch shop profile by userId (from localStorage)
    @GetMapping("/profile/{userId}")
    public ResponseEntity<ShopDTO> getShopProfile(@PathVariable Long userId) {
        ShopDTO shop = shopService.getShopByUserId(userId);
        if (shop != null) {
            return ResponseEntity.ok(shop);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Optionally, fetch by shopId
    @GetMapping("/{shopId}")
    public ResponseEntity<ShopDTO> getShopById(@PathVariable Long shopId) {
        ShopDTO shop = shopService.getShopById(shopId);
        if (shop != null) {
            return ResponseEntity.ok(shop);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{shopId}")
    public ResponseEntity<String> updateShop(@PathVariable Long shopId, @RequestBody ShopDTO shopDTO) {
        shopService.updateShop(shopId, shopDTO);
        return ResponseEntity.ok("Shop updated successfully");
    }
}