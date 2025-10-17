package com.artaura.artaura.dao.artist.Impl;

import com.artaura.artaura.dao.artist.ArtistArtworkOrderDAO;
import com.artaura.artaura.dto.artist.ArtistArtworkOrderDTO;
import com.artaura.artaura.dto.artist.ArtistArtworkOrderItemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Implementation of ArtistArtworkOrderDAO Handles database operations for
 * artwork orders from artist perspective
 */
@Repository
public class ArtistArtworkOrderDAOImpl implements ArtistArtworkOrderDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Row mapper for main order data
    private final RowMapper<ArtistArtworkOrderDTO> orderRowMapper = new RowMapper<ArtistArtworkOrderDTO>() {
        @Override
        public ArtistArtworkOrderDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ArtistArtworkOrderDTO order = new ArtistArtworkOrderDTO();
            order.setOrderId(rs.getLong("id"));
            order.setBuyerId(rs.getLong("buyer_id"));
            order.setBuyerFirstName(rs.getString("first_name"));
            order.setBuyerLastName(rs.getString("last_name"));
            order.setBuyerEmail(rs.getString("email"));
            order.setBuyerContactNumber(rs.getString("contact_number"));
            order.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());
            order.setTotalAmount(rs.getBigDecimal("total_amount"));
            order.setShippingFee(rs.getBigDecimal("shipping_fee"));
            order.setShippingAddress(rs.getString("shipping_address"));
            order.setStatus(rs.getString("status"));
            order.setDeliveryStatus(rs.getString("delivery_status"));
            order.setPaymentMethod(rs.getString("payment_method"));
            order.setStripePaymentId(rs.getString("stripe_payment_id"));
            return order;
        }
    };

    // Row mapper for order items
    private final RowMapper<ArtistArtworkOrderItemDTO> orderItemRowMapper = new RowMapper<ArtistArtworkOrderItemDTO>() {
        @Override
        public ArtistArtworkOrderItemDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ArtistArtworkOrderItemDTO item = new ArtistArtworkOrderItemDTO();
            item.setItemId(rs.getLong("item_id"));
            item.setOrderId(rs.getLong("order_id"));
            item.setArtworkId(rs.getLong("artwork_id"));
            item.setQuantity(rs.getInt("quantity"));
            item.setPrice(rs.getBigDecimal("price"));
            item.setArtworkTitle(rs.getString("title"));
            item.setArtworkMedium(rs.getString("medium"));
            item.setArtworkSize(rs.getString("size"));
            item.setArtworkImageUrl(rs.getString("image_url"));
            return item;
        }
    };

    @Override
    public List<ArtistArtworkOrderDTO> getArtworkOrdersByArtistId(Long artistId) {
        try {
            // First, get all orders that contain artworks by this artist
            String orderSql = """
                SELECT DISTINCT o.id, o.buyer_id, o.first_name, o.last_name, o.email, 
                       o.contact_number, o.order_date, o.total_amount, o.shipping_fee, 
                       o.shipping_address, o.status, o.delivery_status, o.payment_method, 
                       o.stripe_payment_id
                FROM AW_orders o
                INNER JOIN AW_order_items oi ON o.id = oi.order_id
                WHERE oi.artist_id = ?
                ORDER BY o.order_date DESC
                """;

            List<ArtistArtworkOrderDTO> orders = jdbcTemplate.query(orderSql, orderRowMapper, artistId);

            // For each order, get its items that belong to this artist
            for (ArtistArtworkOrderDTO order : orders) {
                String itemsSql = """
                    SELECT oi.id as item_id, oi.order_id, oi.artwork_id, oi.quantity, 
                           oi.price, oi.title, a.medium, a.size, a.image_url
                    FROM AW_order_items oi
                    LEFT JOIN artworks a ON oi.artwork_id = a.artwork_id
                    WHERE oi.order_id = ? AND oi.artist_id = ?
                    ORDER BY oi.id
                    """;

                List<ArtistArtworkOrderItemDTO> items = jdbcTemplate.query(
                        itemsSql, orderItemRowMapper, order.getOrderId(), artistId);
                order.setOrderItems(items);
            }

            return orders;
        } catch (Exception e) {
            System.err.println("Error fetching artwork orders for artist " + artistId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public int getArtworkOrdersCountByArtistId(Long artistId) {
        try {
            String sql = """
                SELECT COUNT(DISTINCT o.id)
                FROM AW_orders o
                INNER JOIN AW_order_items oi ON o.id = oi.order_id
                WHERE oi.artist_id = ?
                """;

            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, artistId);
            return count != null ? count : 0;
        } catch (Exception e) {
            System.err.println("Error getting artwork orders count for artist " + artistId + ": " + e.getMessage());
            return 0;
        }
    }

    @Override
    public int getPendingDeliveryOrdersCountByArtistId(Long artistId) {
        try {
            String sql = """
                SELECT COUNT(DISTINCT o.id)
                FROM AW_orders o
                INNER JOIN AW_order_items oi ON o.id = oi.order_id
                WHERE oi.artist_id = ? AND o.delivery_status = 'pending'
                """;

            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, artistId);
            return count != null ? count : 0;
        } catch (Exception e) {
            System.err.println("Error getting pending delivery orders count for artist " + artistId + ": " + e.getMessage());
            return 0;
        }
    }

    @Override
    public boolean updateOrderDeliveryStatus(Long orderId, String deliveryStatus) {
        try {
            String sql = "UPDATE AW_orders SET delivery_status = ? WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, deliveryStatus, orderId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.err.println("Error updating delivery status for order " + orderId + ": " + e.getMessage());
            return false;
        }
    }
}
