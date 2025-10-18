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

    // Fetch shop profile by userId (which is actually the shop_id from
    // authentication)
    // This endpoint is called after login with the userId from JWT token
    @GetMapping("/profile/{userId}")
    public ResponseEntity<ShopDTO> getShopProfile(@PathVariable Long userId) {
        System.out.println("📋 ShopController: Fetching shop profile for userId/shopId: " + userId);
        ShopDTO shop = shopService.getShopByUserId(userId);
        if (shop != null) {
            System.out.println("✅ Shop found: " + shop.getShopName() + " (ID: " + shop.getShopId() + ")");
            return ResponseEntity.ok(shop);
        } else {
            System.out.println("❌ Shop not found for userId/shopId: " + userId);
            return ResponseEntity.notFound().build();
        }
    }

    // Alternative endpoint: fetch by shopId directly
    @GetMapping("/{shopId}")
    public ResponseEntity<ShopDTO> getShopById(@PathVariable Long shopId) {
        System.out.println("📋 ShopController: Fetching shop by shopId: " + shopId);
        ShopDTO shop = shopService.getShopById(shopId);
        if (shop != null) {
            System.out.println("✅ Shop found: " + shop.getShopName() + " (ID: " + shop.getShopId() + ")");
            return ResponseEntity.ok(shop);
        } else {
            System.out.println("❌ Shop not found for shopId: " + shopId);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{shopId}")
    public ResponseEntity<String> updateShop(@PathVariable Long shopId, @RequestBody ShopDTO shopDTO) {
        System.out.println("📝 ShopController: Updating shop with ID: " + shopId);
        System.out.println("📄 Update data: " + shopDTO.getShopName() + ", " + shopDTO.getEmail());
        try {
            shopService.updateShop(shopId, shopDTO);
            System.out.println("✅ Shop updated successfully");
            return ResponseEntity.ok("Shop updated successfully");
        } catch (Exception e) {
            System.out.println("❌ Error updating shop: " + e.getMessage());
            return ResponseEntity.status(500).body("Error updating shop: " + e.getMessage());
        }
    }

    @DeleteMapping("/deactivate/{shopId}")
    public ResponseEntity<String> deactivateShop(@PathVariable Long shopId) {
        System.out.println("🗑️ ShopController: Deactivating (deleting) shop with ID: " + shopId);
        try {
            // First check if shop exists
            ShopDTO shop = shopService.getShopById(shopId);
            if (shop == null) {
                System.out.println("❌ Shop not found for deactivation: " + shopId);
                return ResponseEntity.notFound().build();
            }

            // Delete the shop
            shopService.deleteShop(shopId);
            System.out.println("✅ Shop deactivated (deleted) successfully: " + shop.getShopName());
            return ResponseEntity.ok("Shop account deactivated successfully");
        } catch (Exception e) {
            System.out.println("❌ Error deactivating shop: " + e.getMessage());
            return ResponseEntity.status(500).body("Error deactivating shop: " + e.getMessage());
        }
    }
}