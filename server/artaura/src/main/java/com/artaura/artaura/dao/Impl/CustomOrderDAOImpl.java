package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.CustomOrderDAO;
import com.artaura.artaura.dto.order.CustomOrderDTO;
import com.artaura.artaura.dto.order.OrderAcceptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class CustomOrderDAOImpl implements CustomOrderDAO {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public List<CustomOrderDTO> getOrdersByArtistId(Long artistId) {
        String sql = """
            SELECT o.order_id, o.buyer_id, o.artist_id, 
                   CONCAT(b.first_name, ' ', b.last_name) as buyer_name,
                   b.email as buyer_email,
                   o.title, o.description, o.reference_image_url, o.budget,
                   o.preferred_size, o.preferred_medium, o.deadline_date, o.status,
                   o.artist_estimated_days, o.artist_notes, 
                   o.created_at, o.updated_at, o.accepted_at, o.rejected_at
            FROM orders o
            JOIN buyers b ON o.buyer_id = b.buyer_id
            WHERE o.artist_id = ?
            ORDER BY o.created_at DESC
            """;

        return jdbc.query(sql, (rs, rowNum) -> new CustomOrderDTO(
                rs.getLong("order_id"),
                rs.getLong("buyer_id"),
                rs.getLong("artist_id"),
                rs.getString("buyer_name"),
                rs.getString("buyer_email"),
                rs.getString("title"),
                rs.getString("description"),
                rs.getString("reference_image_url"),
                rs.getBigDecimal("budget"),
                rs.getString("preferred_size"),
                rs.getString("preferred_medium"),
                rs.getDate("deadline_date") != null ? rs.getDate("deadline_date").toLocalDate() : null,
                rs.getString("status"),
                rs.getObject("artist_estimated_days", Integer.class),
                rs.getString("artist_notes"),
                rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null,
                rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null,
                rs.getTimestamp("accepted_at") != null ? rs.getTimestamp("accepted_at").toLocalDateTime() : null,
                rs.getTimestamp("rejected_at") != null ? rs.getTimestamp("rejected_at").toLocalDateTime() : null
        ), artistId);
    }

    @Override
    public List<CustomOrderDTO> getOrdersByBuyerId(Long buyerId) {
        String sql = """
            SELECT o.order_id, o.buyer_id, o.artist_id, 
                   CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                   a.email as artist_email,
                   o.title, o.description, o.reference_image_url, o.budget,
                   o.preferred_size, o.preferred_medium, o.deadline_date, o.status,
                   o.artist_estimated_days, o.artist_notes, 
                   o.created_at, o.updated_at, o.accepted_at, o.rejected_at
            FROM orders o
            JOIN artists a ON o.artist_id = a.artist_id
            WHERE o.buyer_id = ?
            ORDER BY o.created_at DESC
            """;

        return jdbc.query(sql, (rs, rowNum) -> new CustomOrderDTO(
                rs.getLong("order_id"),
                rs.getLong("buyer_id"),
                rs.getLong("artist_id"),
                rs.getString("artist_name"), // This will be artist name for buyer view
                rs.getString("artist_email"),
                rs.getString("title"),
                rs.getString("description"),
                rs.getString("reference_image_url"),
                rs.getBigDecimal("budget"),
                rs.getString("preferred_size"),
                rs.getString("preferred_medium"),
                rs.getDate("deadline_date") != null ? rs.getDate("deadline_date").toLocalDate() : null,
                rs.getString("status"),
                rs.getObject("artist_estimated_days", Integer.class),
                rs.getString("artist_notes"),
                rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null,
                rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null,
                rs.getTimestamp("accepted_at") != null ? rs.getTimestamp("accepted_at").toLocalDateTime() : null,
                rs.getTimestamp("rejected_at") != null ? rs.getTimestamp("rejected_at").toLocalDateTime() : null
        ), buyerId);
    }

    @Override
    public Optional<CustomOrderDTO> getOrderById(Long orderId) {
        String sql = """
            SELECT o.order_id, o.buyer_id, o.artist_id, 
                   CONCAT(b.first_name, ' ', b.last_name) as buyer_name,
                   b.email as buyer_email,
                   o.title, o.description, o.reference_image_url, o.budget,
                   o.preferred_size, o.preferred_medium, o.deadline_date, o.status,
                   o.artist_estimated_days, o.artist_notes, 
                   o.created_at, o.updated_at, o.accepted_at, o.rejected_at
            FROM orders o
            JOIN buyers b ON o.buyer_id = b.buyer_id
            WHERE o.order_id = ?
            """;

        try {
            CustomOrderDTO order = jdbc.queryForObject(sql, (rs, rowNum) -> new CustomOrderDTO(
                    rs.getLong("order_id"),
                    rs.getLong("buyer_id"),
                    rs.getLong("artist_id"),
                    rs.getString("buyer_name"),
                    rs.getString("buyer_email"),
                    rs.getString("title"),
                    rs.getString("description"),
                    rs.getString("reference_image_url"),
                    rs.getBigDecimal("budget"),
                    rs.getString("preferred_size"),
                    rs.getString("preferred_medium"),
                    rs.getDate("deadline_date") != null ? rs.getDate("deadline_date").toLocalDate() : null,
                    rs.getString("status"),
                    rs.getObject("artist_estimated_days", Integer.class),
                    rs.getString("artist_notes"),
                    rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null,
                    rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null,
                    rs.getTimestamp("accepted_at") != null ? rs.getTimestamp("accepted_at").toLocalDateTime() : null,
                    rs.getTimestamp("rejected_at") != null ? rs.getTimestamp("rejected_at").toLocalDateTime() : null
            ), orderId);
            return Optional.of(order);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public void acceptOrder(Long orderId, OrderAcceptRequest acceptRequest) {
        String sql = """
            UPDATE orders 
            SET status = 'ACCEPTED', 
                artist_estimated_days = ?, 
                artist_notes = ?, 
                accepted_at = ?, 
                updated_at = ?
            WHERE order_id = ?
            """;

        LocalDateTime now = LocalDateTime.now();
        jdbc.update(sql,
                acceptRequest.getEstimatedDays(),
                acceptRequest.getArtistNotes(),
                now,
                now,
                orderId);
    }

    @Override
    public void rejectOrder(Long orderId, String rejectionReason) {
        String sql = """
            UPDATE orders 
            SET status = 'REJECTED', 
                artist_notes = ?, 
                rejected_at = ?, 
                updated_at = ?
            WHERE order_id = ?
            """;

        LocalDateTime now = LocalDateTime.now();
        jdbc.update(sql, rejectionReason, now, now, orderId);
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) {
        String sql = "UPDATE orders SET status = ?, updated_at = ? WHERE order_id = ?";
        jdbc.update(sql, status, LocalDateTime.now(), orderId);
    }

    @Override
    public Long createOrder(CustomOrderDTO orderDTO) {
        String sql = """
            INSERT INTO orders (buyer_id, artist_id, title, description, reference_image_url,
                               budget, preferred_size, preferred_medium, deadline_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, orderDTO.getBuyerId());
            ps.setLong(2, orderDTO.getArtistId());
            ps.setString(3, orderDTO.getTitle());
            ps.setString(4, orderDTO.getDescription());
            ps.setString(5, orderDTO.getReferenceImageUrl());
            ps.setBigDecimal(6, orderDTO.getBudget());
            ps.setString(7, orderDTO.getPreferredSize());
            ps.setString(8, orderDTO.getPreferredMedium());
            if (orderDTO.getDeadlineDate() != null) {
                ps.setDate(9, java.sql.Date.valueOf(orderDTO.getDeadlineDate()));
            } else {
                ps.setNull(9, java.sql.Types.DATE);
            }
            return ps;
        }, keyHolder);

        return keyHolder.getKey() != null ? keyHolder.getKey().longValue() : null;
    }

    @Override
    public int getOrdersCountByArtistId(Long artistId) {
        String sql = "SELECT COUNT(*) FROM orders WHERE artist_id = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, artistId);
        return count != null ? count : 0;
    }

    @Override
    public int getPendingOrdersCountByArtistId(Long artistId) {
        String sql = "SELECT COUNT(*) FROM orders WHERE artist_id = ? AND status = 'PENDING'";
        Integer count = jdbc.queryForObject(sql, Integer.class, artistId);
        return count != null ? count : 0;
    }
}
