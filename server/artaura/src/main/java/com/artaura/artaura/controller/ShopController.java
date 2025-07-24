package com.artaura.artaura.controller;

import com.artaura.artaura.dto.shop.ShopDTO;
import com.artaura.artaura.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop")
@CrossOrigin(origins = "http://localhost:5173")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/{id}")
    public ResponseEntity<ShopDTO> getShopById(@PathVariable Long id) {
        System.out.println("Received request for shop ID: " + id);
        try {
            ShopDTO shop = shopService.getShopById(id);
            System.out.println("Found shop: " + shop.getShopName());
            return ResponseEntity.ok(shop);
        } catch (RuntimeException e) {
            System.err.println("Shop not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Server error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ShopDTO> getShopProfile(@RequestParam String email) {
        System.out.println("Received request for email: " + email);
        try {
            ShopDTO shop = shopService.getShopByEmail(email);
            System.out.println("Found shop: " + shop.getShopName());
            return ResponseEntity.ok(shop);
        } catch (RuntimeException e) {
            System.err.println("Shop not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Server error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateShop(@PathVariable Long id, @RequestBody ShopDTO shopDTO) {
        System.out.println("Received update request for shop ID: " + id);
        try {
            shopService.updateShop(id, shopDTO);
            System.out.println("Shop updated successfully");
            return ResponseEntity.ok("Shop updated successfully");
        } catch (RuntimeException e) {
            System.err.println("Update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Server error during update: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error occurred while updating shop");
        }
    }
}