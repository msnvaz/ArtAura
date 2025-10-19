package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ArtistOrderDAO;
import com.artaura.artaura.dto.order.ArtistOrderDTO;
import com.artaura.artaura.dto.order.ShopOrderDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class ArtistOrderDAOImpl implements ArtistOrderDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Long createOrder(Long artistId, Long productId, Integer quantity, Double total) {
        // Get product info for order
        String getProductSql = "SELECT shop_id, name FROM products WHERE id = ?";

        try {
            var productInfo = jdbcTemplate.queryForMap(getProductSql, productId);
            Long shopId = ((Number) productInfo.get("shop_id")).longValue();
            String productName = (String) productInfo.get("name");

            String sql = "INSERT INTO shop_orders (shop_id, artist_id, items, total, status, product_id, quantity, date) "
                    +
                    "VALUES (?, ?, ?, ?, 'pending', ?, ?, NOW())";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, shopId);
                ps.setLong(2, artistId);
                ps.setString(3, productName); // items field stores product name
                ps.setDouble(4, total);
                ps.setLong(5, productId);
                ps.setInt(6, quantity);
                return ps;
            }, keyHolder);

            System.out.println("✅ Order created successfully for artist " + artistId + ", product " + productId);

            return keyHolder.getKey().longValue();

        } catch (Exception e) {
            System.err.println("❌ Error creating order: " + e.getMessage());
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }

    @Override
    public List<ArtistOrderDTO> getOrdersByArtist(Long artistId) {
        String sql = "SELECT so.order_id, so.shop_id, s.shop_name, so.product_id, p.name as product_name, " +
                "p.image as product_image, so.quantity, so.total, so.status, so.date " +
                "FROM shop_orders so " +
                "JOIN shops s ON so.shop_id = s.shop_id " +
                "LEFT JOIN products p ON so.product_id = p.id " +
                "WHERE so.artist_id = ? " +
                "ORDER BY so.date DESC";

        return jdbcTemplate.query(sql, this::mapToArtistOrderDTO, artistId);
    }

    @Override
    public List<ShopOrderDTO> getOrdersByShop(Long shopId) {
        String sql = "SELECT so.order_id, so.shop_id, so.artist_id, u.username as artist_name, " +
                "so.items, so.total, so.status, so.date, so.product_id, so.quantity, " +
                "p.name as product_name, p.image as product_image " +
                "FROM shop_orders so " +
                "LEFT JOIN users u ON so.artist_id = u.id " +
                "LEFT JOIN products p ON so.product_id = p.id " +
                "WHERE so.shop_id = ? " +
                "ORDER BY so.date DESC";

        return jdbcTemplate.query(sql, this::mapToShopOrderDTO, shopId);
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) {
        String sql = "UPDATE shop_orders SET status = ? WHERE order_id = ?";

        int rows = jdbcTemplate.update(sql, status, orderId);

        if (rows == 0) {
            throw new RuntimeException("Order not found: " + orderId);
        }

        System.out.println("✅ Order " + orderId + " status updated to: " + status);
    }

    @Override
    public ArtistOrderDTO getOrderById(Long orderId) {
        String sql = "SELECT so.order_id, so.shop_id, s.shop_name, so.product_id, p.name as product_name, " +
                "p.image as product_image, so.quantity, so.total, so.status, so.date " +
                "FROM shop_orders so " +
                "JOIN shops s ON so.shop_id = s.shop_id " +
                "LEFT JOIN products p ON so.product_id = p.id " +
                "WHERE so.order_id = ?";

        return jdbcTemplate.queryForObject(sql, this::mapToArtistOrderDTO, orderId);
    }

    @Override
    public boolean checkProductStock(Long productId, Integer quantity) {
        String sql = "SELECT stock FROM products WHERE id = ?";

        try {
            Integer stock = jdbcTemplate.queryForObject(sql, Integer.class, productId);
            return stock != null && stock >= quantity;
        } catch (Exception e) {
            return false;
        }
    }

    // Helper method to map ResultSet to ArtistOrderDTO
    private ArtistOrderDTO mapToArtistOrderDTO(ResultSet rs, int rowNum) throws SQLException {
        ArtistOrderDTO dto = new ArtistOrderDTO();
        dto.setOrderId(rs.getLong("order_id"));
        dto.setShopId(rs.getLong("shop_id"));
        dto.setShopName(rs.getString("shop_name"));

        // Handle nullable product_id
        long productId = rs.getLong("product_id");
        dto.setProductId(rs.wasNull() ? null : productId);

        dto.setProductName(rs.getString("product_name"));
        dto.setProductImage(rs.getString("product_image"));

        // Handle nullable quantity
        int quantity = rs.getInt("quantity");
        dto.setQuantity(rs.wasNull() ? null : quantity);

        dto.setTotal(rs.getDouble("total"));
        dto.setStatus(rs.getString("status"));

        Timestamp timestamp = rs.getTimestamp("date");
        if (timestamp != null) {
            dto.setDate(timestamp.toLocalDateTime());
        }

        return dto;
    }

    // Helper method to map ResultSet to ShopOrderDTO
    private ShopOrderDTO mapToShopOrderDTO(ResultSet rs, int rowNum) throws SQLException {
        ShopOrderDTO dto = new ShopOrderDTO();
        dto.setOrderId(rs.getLong("order_id"));
        dto.setShopId(rs.getLong("shop_id"));
        dto.setArtistId(rs.getLong("artist_id"));
        dto.setArtistName(rs.getString("artist_name"));
        dto.setItems(rs.getString("items"));
        dto.setTotal(rs.getDouble("total"));
        dto.setStatus(rs.getString("status"));

        // Handle nullable product_id
        long productId = rs.getLong("product_id");
        dto.setProductId(rs.wasNull() ? null : productId);

        // Handle nullable quantity
        int quantity = rs.getInt("quantity");
        dto.setQuantity(rs.wasNull() ? null : quantity);

        dto.setProductName(rs.getString("product_name"));
        dto.setProductImage(rs.getString("product_image"));

        Timestamp timestamp = rs.getTimestamp("date");
        if (timestamp != null) {
            dto.setDateTime(timestamp.toLocalDateTime());
        }

        return dto;
    }
}
