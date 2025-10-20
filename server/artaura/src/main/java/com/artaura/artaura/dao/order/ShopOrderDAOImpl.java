package com.artaura.artaura.dao.order;

import com.artaura.artaura.dto.order.ShopOrderDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class ShopOrderDAOImpl implements ShopOrderDAO {

    private static final Logger logger = LoggerFactory.getLogger(ShopOrderDAOImpl.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<ShopOrderDTO> orderRowMapper = (rs, rowNum) -> {
        ShopOrderDTO order = new ShopOrderDTO();
        order.setOrderId(rs.getLong("order_id"));
        order.setShopId(rs.getLong("shop_id"));
        order.setArtistId(rs.getLong("artist_id"));
        order.setArtistFirstName(rs.getString("first_name"));
        order.setArtistLastName(rs.getString("last_name"));
        order.setArtistEmail(rs.getString("email"));
        // Use contactNo (camelCase) as it appears in the artists table
        order.setArtistContactNo(rs.getString("contactNo"));
        order.setItems(rs.getString("items"));
        order.setTotalAmount(rs.getBigDecimal("total"));
        order.setStatus(rs.getString("status"));
        order.setDate(rs.getTimestamp("date"));
        // New fields for stock management
        order.setProductId(rs.getObject("product_id") != null ? rs.getLong("product_id") : null);
        order.setQuantity(rs.getObject("quantity") != null ? rs.getInt("quantity") : 1);
        return order;
    };

    @Override
    public List<ShopOrderDTO> findByShopId(Long shopId) {
        logger.info("Fetching orders for shop ID: {}", shopId);
        String sql = "SELECT so.order_id, so.shop_id, so.artist_id, " +
                "a.first_name, a.last_name, a.email, a.contactNo, " +
                "so.items, so.total, so.status, so.date, so.product_id, so.quantity " +
                "FROM shop_orders so " +
                "INNER JOIN artists a ON so.artist_id = a.artist_id " +
                "WHERE so.shop_id = ? ORDER BY so.date DESC";
        List<ShopOrderDTO> orders = jdbcTemplate.query(sql, orderRowMapper, shopId);
        logger.info("Found {} orders for shop ID: {}", orders.size(), shopId);
        return orders;
    }

    @Override
    public ShopOrderDTO findById(Long orderId) {
        logger.info("Fetching order with ID: {}", orderId);
        String sql = "SELECT so.order_id, so.shop_id, so.artist_id, " +
                "a.first_name, a.last_name, a.email, a.contactNo, " +
                "so.items, so.total, so.status, so.date, so.product_id, so.quantity " +
                "FROM shop_orders so " +
                "INNER JOIN artists a ON so.artist_id = a.artist_id " +
                "WHERE so.order_id = ?";
        try {
            ShopOrderDTO order = jdbcTemplate.queryForObject(sql, orderRowMapper, orderId);
            logger.info("Found order: {}", order);
            return order;
        } catch (EmptyResultDataAccessException e) {
            logger.warn("Order not found for ID: {}", orderId);
            return null;
        }
    }

    @Override
    public ShopOrderDTO save(ShopOrderDTO order) {
        logger.info("Creating new order: {}", order);
        String sql = "INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date, product_id, quantity) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, order.getShopId());
            ps.setLong(2, order.getArtistId());
            ps.setString(3, order.getItems());
            ps.setBigDecimal(4, order.getTotalAmount());
            ps.setString(5, order.getStatus());
            ps.setTimestamp(6, order.getDate());
            if (order.getProductId() != null) {
                ps.setLong(7, order.getProductId());
            } else {
                ps.setNull(7, java.sql.Types.BIGINT);
            }
            ps.setInt(8, order.getQuantity() != null ? order.getQuantity() : 1);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key != null) {
            order.setOrderId(key.longValue());
            logger.info("Order created with ID: {}", order.getOrderId());
        } else {
            logger.error("Failed to retrieve generated order ID");
            throw new RuntimeException("Failed to create order - no ID generated");
        }
        return order;
    }

    @Override
    public ShopOrderDTO update(ShopOrderDTO order) {
        logger.info("Updating order: {}", order);
        String sql = "UPDATE shop_orders SET shop_id = ?, artist_id = ?, " +
                "items = ?, total = ?, status = ?, date = ?, product_id = ?, quantity = ? WHERE order_id = ?";

        int rowsAffected = jdbcTemplate.update(sql,
                order.getShopId(),
                order.getArtistId(),
                order.getItems(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getDate(),
                order.getProductId(),
                order.getQuantity() != null ? order.getQuantity() : 1,
                order.getOrderId());

        logger.info("Updated {} row(s) for order ID: {}", rowsAffected, order.getOrderId());
        return order;
    }

    @Override
    public void deleteById(Long orderId) {
        logger.info("Deleting order with ID: {}", orderId);
        String sql = "DELETE FROM shop_orders WHERE order_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, orderId);
        logger.info("Deleted {} row(s) for order ID: {}", rowsAffected, orderId);
    }
}
