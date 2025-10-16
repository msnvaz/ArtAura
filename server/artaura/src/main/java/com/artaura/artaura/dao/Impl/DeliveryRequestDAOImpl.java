package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.DeliveryRequestDAO;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class DeliveryRequestDAOImpl implements DeliveryRequestDAO {

    @Autowired
    private JdbcTemplate jdbc;

    // Row mapper for artwork orders
    private RowMapper<DeliveryRequestDTO> artworkOrderRowMapper = (rs, rowNum) -> {
        DeliveryRequestDTO dto = new DeliveryRequestDTO();
        dto.setId(rs.getLong("id"));
        dto.setRequestType("artwork_order");
        dto.setBuyerId(rs.getLong("buyer_id"));
        dto.setBuyerName(rs.getString("buyer_name"));
        dto.setBuyerEmail(rs.getString("email"));
        dto.setBuyerPhone(rs.getString("contact_number"));
        dto.setShippingAddress(rs.getString("shipping_address"));
        dto.setDeliveryStatus(rs.getString("delivery_status"));
        dto.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());
        dto.setArtworkTitle(rs.getString("artwork_title"));
        dto.setArtworkType("Artwork"); // Default for artwork orders
        dto.setTotalAmount(rs.getBigDecimal("total_amount"));
        dto.setArtistId(rs.getLong("artist_id"));
        dto.setArtistName(rs.getString("artist_name"));
        return dto;
    };

    // Row mapper for commission requests
    private RowMapper<DeliveryRequestDTO> commissionRowMapper = (rs, rowNum) -> {
        DeliveryRequestDTO dto = new DeliveryRequestDTO();
        dto.setId(rs.getLong("id"));
        dto.setRequestType("commission_request");
        dto.setBuyerId(rs.getLong("buyer_id"));
        dto.setBuyerName(rs.getString("name"));
        dto.setBuyerEmail(rs.getString("email"));
        dto.setBuyerPhone(rs.getString("phone"));
        dto.setShippingAddress(rs.getString("shipping_address"));
        dto.setDeliveryStatus(rs.getString("delivery_status"));
        dto.setOrderDate(rs.getTimestamp("submitted_at").toLocalDateTime());
        dto.setArtworkTitle(rs.getString("title"));
        dto.setArtworkType(rs.getString("artwork_type"));
        dto.setArtworkDimensions(rs.getString("dimensions"));
        dto.setArtistId(rs.getLong("artist_id"));
        dto.setArtistName(rs.getString("artist_name"));
        dto.setCommissionStyle(rs.getString("style"));
        dto.setDeadline(rs.getDate("deadline") != null ? rs.getDate("deadline").toLocalDate() : null);
        dto.setAdditionalNotes(rs.getString("additional_notes"));
        dto.setUrgency(rs.getString("urgency"));
        
        // Parse budget string to BigDecimal
        String budget = rs.getString("budget");
        if (budget != null) {
            try {
                // Remove currency symbols and parse
                String cleanBudget = budget.replaceAll("[^0-9.]", "");
                dto.setTotalAmount(new BigDecimal(cleanBudget));
            } catch (NumberFormatException e) {
                dto.setTotalAmount(BigDecimal.ZERO);
            }
        }
        
        return dto;
    };

    @Override
    public List<DeliveryRequestDTO> getAllPendingDeliveryRequests() {
        List<DeliveryRequestDTO> allRequests = new ArrayList<>();
        allRequests.addAll(getPendingArtworkOrderDeliveryRequests());
        allRequests.addAll(getPendingCommissionDeliveryRequests());
        return allRequests;
    }

    @Override
    public List<DeliveryRequestDTO> getPendingArtworkOrderDeliveryRequests() {
        try {
            String sql = """
                SELECT 
                    ao.id,
                    ao.buyer_id,
                    CONCAT(ao.first_name, ' ', ao.last_name) AS buyer_name,
                    ao.email,
                    ao.contact_number,
                    ao.shipping_address,
                    ao.delivery_status,
                    ao.order_date,
                    ao.total_amount,
                    aoi.title AS artwork_title,
                    aoi.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) AS artist_name
                FROM AW_orders ao
                LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
                LEFT JOIN artists a ON aoi.artist_id = a.artist_id
                WHERE ao.delivery_status = 'pending'
                ORDER BY ao.order_date DESC
            """;
            
            return jdbc.query(sql, artworkOrderRowMapper);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryRequestDAO: Error fetching pending artwork orders: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<DeliveryRequestDTO> getPendingCommissionDeliveryRequests() {
        try {
            String sql = """
                SELECT 
                    cr.id,
                    cr.buyer_id,
                    cr.name,
                    cr.email,
                    cr.phone,
                    cr.shipping_address,
                    cr.delivery_status,
                    cr.submitted_at,
                    cr.title,
                    cr.artwork_type,
                    cr.style,
                    cr.dimensions,
                    cr.budget,
                    cr.deadline,
                    cr.additional_notes,
                    cr.urgency,
                    cr.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) AS artist_name
                FROM commission_requests cr
                LEFT JOIN artists a ON cr.artist_id = a.artist_id
                WHERE cr.delivery_status = 'pending'
                ORDER BY cr.submitted_at DESC
            """;
            
            return jdbc.query(sql, commissionRowMapper);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryRequestDAO: Error fetching pending commission requests: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public boolean updateArtworkOrderDeliveryStatus(Long orderId, String newStatus) {
        try {
            String sql = "UPDATE AW_orders SET delivery_status = ? WHERE id = ?";
            int rowsAffected = jdbc.update(sql, newStatus, orderId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestDAO: Failed to update artwork order delivery status: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean updateCommissionDeliveryStatus(Long commissionId, String newStatus) {
        try {
            String sql = "UPDATE commission_requests SET delivery_status = ? WHERE id = ?";
            int rowsAffected = jdbc.update(sql, newStatus, commissionId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ DeliveryRequestDAO: Failed to update commission delivery status: " + e.getMessage());
            return false;
        }
    }

    @Override
    public Optional<DeliveryRequestDTO> getDeliveryRequestById(Long id, String requestType) {
        try {
            if ("artwork_order".equals(requestType)) {
                String sql = """
                    SELECT 
                        ao.id,
                        ao.buyer_id,
                        CONCAT(ao.first_name, ' ', ao.last_name) AS buyer_name,
                        ao.email,
                        ao.contact_number,
                        ao.shipping_address,
                        ao.delivery_status,
                        ao.order_date,
                        ao.total_amount,
                        aoi.title AS artwork_title,
                        aoi.artist_id,
                        CONCAT(a.first_name, ' ', a.last_name) AS artist_name
                    FROM AW_orders ao
                    LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
                    LEFT JOIN artists a ON aoi.artist_id = a.artist_id
                    WHERE ao.id = ?
                """;
                
                DeliveryRequestDTO result = jdbc.queryForObject(sql, artworkOrderRowMapper, id);
                return Optional.ofNullable(result);
                
            } else if ("commission_request".equals(requestType)) {
                String sql = """
                    SELECT 
                        cr.id,
                        cr.buyer_id,
                        cr.name,
                        cr.email,
                        cr.phone,
                        cr.shipping_address,
                        cr.delivery_status,
                        cr.submitted_at,
                        cr.title,
                        cr.artwork_type,
                        cr.style,
                        cr.dimensions,
                        cr.budget,
                        cr.deadline,
                        cr.additional_notes,
                        cr.urgency,
                        cr.artist_id,
                        CONCAT(a.first_name, ' ', a.last_name) AS artist_name
                    FROM commission_requests cr
                    LEFT JOIN artists a ON cr.artist_id = a.artist_id
                    WHERE cr.id = ?
                """;
                
                DeliveryRequestDTO result = jdbc.queryForObject(sql, commissionRowMapper, id);
                return Optional.ofNullable(result);
            }
            
            return Optional.empty();
        } catch (Exception e) {
            System.out.println("🔍 DeliveryRequestDAO: Error fetching delivery request by ID: " + e.getMessage());
            return Optional.empty();
        }
    }
}