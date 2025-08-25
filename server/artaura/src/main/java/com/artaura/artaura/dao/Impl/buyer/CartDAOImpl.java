package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.CartDao;
import com.artaura.artaura.dto.buyer.CartItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CartDAOImpl implements CartDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void addToCart(CartItemRequest request, Long buyerId) {
        String getCartIdSql = "SELECT cart_id FROM carts WHERE buyer_id = ?";
        Long cartId = null;
        try {
            cartId = jdbcTemplate.queryForObject(getCartIdSql, new Object[]{buyerId}, Long.class);
        } catch (Exception e) {
            String createCartSql = "INSERT INTO carts (buyer_id) VALUES (?)";
            jdbcTemplate.update(createCartSql, buyerId);
            try {
                cartId = jdbcTemplate.queryForObject(getCartIdSql, new Object[]{buyerId}, Long.class);
            } catch (Exception ex) {
                throw new RuntimeException("Cart creation failed for buyerId: " + buyerId);
            }
        }
        if (cartId == null) {
            throw new RuntimeException("Cart ID is null for buyerId: " + buyerId);
        }
        String sql = "INSERT INTO cart_items (cart_id, artwork_id, quantity, added_at) " +
                "VALUES (?, ?, ?, NOW()) " +
                "ON DUPLICATE KEY UPDATE quantity = quantity + ?";
        jdbcTemplate.update(sql,
                cartId,
                request.getArtworkId(),
                request.getQuantity() == null ? 1 : request.getQuantity(),
                request.getQuantity() == null ? 1 : request.getQuantity());
    }

    @Override
    public void removeFromCart(Long buyerId, Long artworkId) {
        String sql = "DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM carts WHERE buyer_id = ?) AND artwork_id = ?";
        jdbcTemplate.update(sql, buyerId, artworkId);
    }

    @Override
    public void updateQuantity(Long buyerId, Long artworkId, Integer quantity) {
        String sql = "UPDATE cart_items SET quantity = ? WHERE cart_id = (SELECT cart_id FROM carts WHERE buyer_id = ?) AND artwork_id = ?";
        jdbcTemplate.update(sql, quantity, buyerId, artworkId);
    }

    @Override
    public List<Map<String, Object>> getCartItems(Long buyerId) {
        String sql = "SELECT ci.artwork_id, ci.quantity, a.title, a.price, a.image_url, ar.first_name AS artist_name, ar.avatar_url AS artist_image " +
                "FROM cart_items ci " +
                "JOIN artworks a ON ci.artwork_id = a.artwork_id " +
                "JOIN artists ar ON a.artist_id = ar.artist_id " +
                "WHERE ci.cart_id = (SELECT cart_id FROM carts WHERE buyer_id = ?)";
        return jdbcTemplate.queryForList(sql, buyerId);
    }

    @Override
    public void clearCart(Long buyerId) {
        String sql = "DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM carts WHERE buyer_id = ?)";
        jdbcTemplate.update(sql, buyerId);
    }
}