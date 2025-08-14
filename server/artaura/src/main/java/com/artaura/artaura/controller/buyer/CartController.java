package com.artaura.artaura.controller.buyer;
import com.artaura.artaura.dto.buyer.CartItemRequest;
import com.artaura.artaura.service.buyer.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest request, Authentication authentication) {
        Long buyerId = extractUserIdFromAuth(authentication);
        cartService.addToCart(request, buyerId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestParam Long artworkId, Authentication authentication) {
        Long buyerId = extractUserIdFromAuth(authentication);
        cartService.removeFromCart(buyerId, artworkId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateQuantity(@RequestBody CartItemRequest request, Authentication authentication) {
        Long buyerId = extractUserIdFromAuth(authentication);
        cartService.updateQuantity(buyerId, request.getArtworkId(), request.getQuantity());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/items")
    public ResponseEntity<?> getCartItems(Authentication authentication) {
        Long buyerId = extractUserIdFromAuth(authentication);
        // Fetch cart items for the buyer from the service
        var items = cartService.getCartItems(buyerId);
        return ResponseEntity.ok(items);
    }

    private Long extractUserIdFromAuth(Authentication authentication) {
        // If using standard Spring Security, userId may be in authentication.getName()
        // If using JWT with custom claims, extract from principal or claims
        // Example for custom UserDetails:
        // return ((CustomUserDetails) authentication.getPrincipal()).getUserId();
        // Example for JWT claims:
        // return Long.valueOf(((Jwt) authentication.getPrincipal()).getClaims().get("userId").toString());
        return Long.valueOf(authentication.getName()); // Adjust as needed for your setup
    }
}