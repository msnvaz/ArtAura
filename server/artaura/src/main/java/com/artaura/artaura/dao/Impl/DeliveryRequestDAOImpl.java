package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.DeliveryRequestDAO;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import com.artaura.artaura.dto.delivery.ArtistPickupAddressDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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
        dto.setOrderDate(rs.getTimestamp("order_date") != null ? rs.getTimestamp("order_date").toLocalDateTime() : null);
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
        dto.setOrderDate(rs.getTimestamp("submitted_at") != null ? rs.getTimestamp("submitted_at").toLocalDateTime() : null);
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

    // Row mapper for artist pickup addresses
    private RowMapper<ArtistPickupAddressDTO> pickupAddressRowMapper = (rs, rowNum) -> {
        ArtistPickupAddressDTO dto = new ArtistPickupAddressDTO();
        dto.setRequestId(rs.getLong("request_id"));
        dto.setRequestType(rs.getString("request_type"));
        dto.setArtistId(rs.getLong("artist_id"));
        dto.setArtistName(rs.getString("artist_name"));
        dto.setArtistEmail(rs.getString("artist_email"));
        dto.setArtistContactNo(rs.getString("artist_contact"));
        dto.setStreetAddress(rs.getString("street_address"));
        dto.setCity(rs.getString("city"));
        dto.setState(rs.getString("state"));
        dto.setCountry(rs.getString("country"));
        dto.setZipCode(rs.getString("zip_code"));
        dto.setArtworkTitle(rs.getString("artwork_title"));
        dto.setArtworkType(rs.getString("artwork_type"));
        dto.setDeliveryStatus(rs.getString("delivery_status"));
        dto.setRequestDate(rs.getTimestamp("request_date") != null ? rs.getTimestamp("request_date").toLocalDateTime() : null);
        dto.setTotalAmount(rs.getBigDecimal("total_amount"));
        dto.setBuyerName(rs.getString("buyer_name"));
        dto.setBuyerEmail(rs.getString("buyer_email"));
        dto.setDeliveryAddress(rs.getString("delivery_address"));
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

    @Override
    public List<ArtistPickupAddressDTO> getAllArtistPickupAddresses() {
        List<ArtistPickupAddressDTO> allAddresses = new ArrayList<>();
        allAddresses.addAll(getArtworkOrderPickupAddresses());
        allAddresses.addAll(getCommissionPickupAddresses());
        return allAddresses;
    }

    @Override
    public List<ArtistPickupAddressDTO> getArtworkOrderPickupAddresses() {
        try {
            String sql = """
                SELECT 
                    ao.id AS request_id,
                    'artwork_order' AS request_type,
                    a.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) AS artist_name,
                    a.email AS artist_email,
                    a.contactNo AS artist_contact,
                    addr.street_address,
                    addr.city,
                    addr.state,
                    addr.country,
                    addr.zip_code,
                    aoi.title AS artwork_title,
                    'Artwork' AS artwork_type,
                    ao.delivery_status,
                    ao.order_date AS request_date,
                    ao.total_amount,
                    CONCAT(ao.first_name, ' ', ao.last_name) AS buyer_name,
                    ao.email AS buyer_email,
                    ao.shipping_address AS delivery_address
                FROM AW_orders ao
                LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
                LEFT JOIN artists a ON aoi.artist_id = a.artist_id
                LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
                WHERE ao.delivery_status = 'pending' 
                AND a.artist_id IS NOT NULL
                ORDER BY ao.order_date DESC
            """;
            return jdbc.query(sql, pickupAddressRowMapper);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryRequestDAO: Error fetching artwork order pickup addresses: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<ArtistPickupAddressDTO> getCommissionPickupAddresses() {
        try {
            String sql = """
                SELECT 
                    cr.id AS request_id,
                    'commission_request' AS request_type,
                    a.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) AS artist_name,
                    a.email AS artist_email,
                    a.contactNo AS artist_contact,
                    addr.street_address,
                    addr.city,
                    addr.state,
                    addr.country,
                    addr.zip_code,
                    cr.title AS artwork_title,
                    cr.artwork_type,
                    cr.delivery_status,
                    cr.submitted_at AS request_date,
                    CAST(REGEXP_REPLACE(cr.budget, '[^0-9.]', '') AS DECIMAL(10,2)) AS total_amount,
                    cr.name AS buyer_name,
                    cr.email AS buyer_email,
                    cr.shipping_address AS delivery_address
                FROM commission_requests cr
                LEFT JOIN artists a ON cr.artist_id = a.artist_id
                LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
                WHERE cr.delivery_status = 'pending' 
                AND a.artist_id IS NOT NULL
                ORDER BY cr.submitted_at DESC
            """;
            return jdbc.query(sql, pickupAddressRowMapper);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryRequestDAO: Error fetching commission pickup addresses: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    @Override
    public List<DeliveryRequestDTO> getAllActiveDeliveryRequests() {
        List<DeliveryRequestDTO> allRequests = new ArrayList<>();
        allRequests.addAll(getActiveArtworkOrderDeliveryRequests());
        allRequests.addAll(getActiveCommissionDeliveryRequests());
        return allRequests;
    }

    @Override
    public List<DeliveryRequestDTO> getActiveArtworkOrderDeliveryRequests() {
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
                WHERE ao.delivery_status IN ('accepted', 'outForDelivery')
                ORDER BY ao.order_date DESC
            """;
            
            return jdbc.query(sql, artworkOrderRowMapper);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryRequestDAO: Error fetching active artwork orders: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<DeliveryRequestDTO> getActiveCommissionDeliveryRequests() {
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
                WHERE cr.delivery_status IN ('accepted', 'outForDelivery')
                ORDER BY cr.submitted_at DESC
            """;
            
            return jdbc.query(sql, commissionRowMapper);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryRequestDAO: Error fetching active commission requests: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}