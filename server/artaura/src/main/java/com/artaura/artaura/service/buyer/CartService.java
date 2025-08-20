package com.artaura.artaura.service.buyer;
import com.artaura.artaura.dao.buyer.CartDao;
import com.artaura.artaura.dto.buyer.CartItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartDao cartDao;

    public void addToCart(CartItemRequest request, Long buyerId) {
        cartDao.addToCart(request, buyerId);
    }

    public void removeFromCart(Long userId, Long artworkId) {
        cartDao.removeFromCart(userId, artworkId);
    }

    public void updateQuantity(Long buyerId, Long artworkId, Integer quantity) {
        cartDao.updateQuantity(buyerId, artworkId, quantity);
    }

    public List<?> getCartItems(Long buyerId) {
        return cartDao.getCartItems(buyerId);
    }
}
