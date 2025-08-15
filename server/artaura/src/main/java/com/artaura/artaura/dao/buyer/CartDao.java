package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.buyer.CartItemRequest;
import java.util.List;

public interface CartDao {
        void addToCart(CartItemRequest request, Long buyerId);
        void removeFromCart(Long buyerId, Long artworkId);
        void updateQuantity(Long buyerId, Long artworkId, Integer quantity);
        List<?> getCartItems(Long buyerId);
        void clearCart(Long buyerId);
}
