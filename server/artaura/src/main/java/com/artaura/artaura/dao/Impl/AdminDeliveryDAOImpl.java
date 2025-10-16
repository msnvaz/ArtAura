package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AdminDeliveryDAO;
import com.artaura.artaura.dto.delivery.DeliveryRequestDTO;
import com.artaura.artaura.dto.delivery.ArtistPickupAddressDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class AdminDeliveryDAOImpl implements AdminDeliveryDAO {

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
        // Set artist pickup address information
        dto.setPickupAddress(rs.getString("pickup_address"));
        dto.setPickupCity(rs.getString("pickup_city"));
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
        // Set artist pickup address information
        dto.setPickupAddress(rs.getString("pickup_address"));
        dto.setPickupCity(rs.getString("pickup_city"));
        
        // Parse budget string to BigDecimal
        String budget = rs.getString("budget");
        if (budget != null) {
            try {
                // Remove currency symbols and parse
                String cleanBudget = budget.replaceAll("[^\\d.]", "");
                if (!cleanBudget.isEmpty()) {
                    dto.setTotalAmount(new BigDecimal(cleanBudget));
                }
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
    public List<DeliveryRequestDTO> getAllDeliveryRequests() {
        List<DeliveryRequestDTO> allRequests = new ArrayList<>();
        allRequests.addAll(getAllArtworkOrderDeliveryRequests());
        allRequests.addAll(getAllCommissionDeliveryRequests());
        
        // Sort by order date descending
        allRequests.sort((a, b) -> {
            if (a.getOrderDate() == null && b.getOrderDate() == null) return 0;
            if (a.getOrderDate() == null) return 1;
            if (b.getOrderDate() == null) return -1;
            return b.getOrderDate().compareTo(a.getOrderDate());
        });
        
        return allRequests;
    }

    @Override
    public List<DeliveryRequestDTO> getDeliveryRequestsByStatus(String status) {
        List<DeliveryRequestDTO> requests = new ArrayList<>();
        
        // Get artwork orders with specific status
        String artworkQuery = """
            SELECT 
                ao.id,
                ao.buyer_id,
                CONCAT(ao.first_name, ' ', ao.last_name) as buyer_name,
                ao.email,
                ao.contact_number,
                ao.shipping_address,
                ao.delivery_status,
                ao.order_date,
                ao.total_amount,
                ai.title as artwork_title,
                ai.artist_id,
                CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                       COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                COALESCE(addr.city, 'N/A') as pickup_city
            FROM AW_orders ao
            LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
            LEFT JOIN artworks ai ON aoi.artwork_id = ai.artwork_id
            LEFT JOIN artists a ON ai.artist_id = a.artist_id
            LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
            WHERE ao.delivery_status = ?
            ORDER BY ao.order_date DESC
            """;
        
        requests.addAll(jdbc.query(artworkQuery, artworkOrderRowMapper, status));
        
        // Get commission requests with specific status
        String commissionQuery = """
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
                cr.dimensions,
                cr.artist_id,
                CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                cr.style,
                cr.deadline,
                cr.additional_notes,
                cr.urgency,
                cr.budget,
                CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                       COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                COALESCE(addr.city, 'N/A') as pickup_city
            FROM commission_requests cr
            LEFT JOIN artists a ON cr.artist_id = a.artist_id
            LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
            WHERE cr.delivery_status = ?
            ORDER BY cr.submitted_at DESC
            """;
        
        requests.addAll(jdbc.query(commissionQuery, commissionRowMapper, status));
        
        // Sort by order date descending
        requests.sort((a, b) -> {
            if (a.getOrderDate() == null && b.getOrderDate() == null) return 0;
            if (a.getOrderDate() == null) return 1;
            if (b.getOrderDate() == null) return -1;
            return b.getOrderDate().compareTo(a.getOrderDate());
        });
        
        return requests;
    }

    @Override
    public List<DeliveryRequestDTO> getAllArtworkOrderDeliveryRequests() {
        String query = """
            SELECT 
                ao.id,
                ao.buyer_id,
                CONCAT(ao.first_name, ' ', ao.last_name) as buyer_name,
                ao.email,
                ao.contact_number,
                ao.shipping_address,
                COALESCE(ao.delivery_status, 'N/A') as delivery_status,
                ao.order_date,
                ao.total_amount,
                ai.title as artwork_title,
                ai.artist_id,
                CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                       COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                COALESCE(addr.city, 'N/A') as pickup_city
            FROM AW_orders ao
            LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
            LEFT JOIN artworks ai ON aoi.artwork_id = ai.artwork_id
            LEFT JOIN artists a ON ai.artist_id = a.artist_id
            LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
            ORDER BY ao.order_date DESC
            """;

        return jdbc.query(query, artworkOrderRowMapper);
    }

    @Override
    public List<DeliveryRequestDTO> getAllCommissionDeliveryRequests() {
        String query = """
            SELECT 
                cr.id,
                cr.buyer_id,
                cr.name,
                cr.email,
                cr.phone,
                cr.shipping_address,
                COALESCE(cr.delivery_status, 'N/A') as delivery_status,
                cr.submitted_at,
                cr.title,
                cr.artwork_type,
                cr.dimensions,
                cr.artist_id,
                CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                cr.style,
                cr.deadline,
                cr.additional_notes,
                cr.urgency,
                cr.budget,
                CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                       COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                COALESCE(addr.city, 'N/A') as pickup_city
            FROM commission_requests cr
            LEFT JOIN artists a ON cr.artist_id = a.artist_id
            LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
            ORDER BY cr.submitted_at DESC
            """;

        return jdbc.query(query, commissionRowMapper);
    }

    @Override
    public List<DeliveryRequestDTO> getDeliveryRequestsByDateRange(String startDate, String endDate) {
        List<DeliveryRequestDTO> requests = new ArrayList<>();
        
        // Get artwork orders within date range
        String artworkQuery = """
            SELECT 
                ao.id,
                ao.buyer_id,
                CONCAT(ao.first_name, ' ', ao.last_name) as buyer_name,
                ao.email,
                ao.contact_number,
                ao.shipping_address,
                COALESCE(ao.delivery_status, 'N/A') as delivery_status,
                ao.order_date,
                ao.total_amount,
                ai.title as artwork_title,
                ai.artist_id,
                CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                       COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                COALESCE(addr.city, 'N/A') as pickup_city
            FROM AW_orders ao
            LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
            LEFT JOIN artworks ai ON aoi.artwork_id = ai.artwork_id
            LEFT JOIN artists a ON ai.artist_id = a.artist_id
            LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
            WHERE DATE(ao.order_date) BETWEEN ? AND ?
            ORDER BY ao.order_date DESC
            """;
        
        requests.addAll(jdbc.query(artworkQuery, artworkOrderRowMapper, startDate, endDate));
        
        // Get commission requests within date range
        String commissionQuery = """
            SELECT 
                cr.id,
                cr.buyer_id,
                cr.name,
                cr.email,
                cr.phone,
                cr.shipping_address,
                COALESCE(cr.delivery_status, 'N/A') as delivery_status,
                cr.submitted_at,
                cr.title,
                cr.artwork_type,
                cr.dimensions,
                cr.artist_id,
                CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                cr.style,
                cr.deadline,
                cr.additional_notes,
                cr.urgency,
                cr.budget,
                CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                       COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                COALESCE(addr.city, 'N/A') as pickup_city
            FROM commission_requests cr
            LEFT JOIN artists a ON cr.artist_id = a.artist_id
            LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
            WHERE DATE(cr.submitted_at) BETWEEN ? AND ?
            ORDER BY cr.submitted_at DESC
            """;
        
        requests.addAll(jdbc.query(commissionQuery, commissionRowMapper, startDate, endDate));
        
        // Sort by order date descending
        requests.sort((a, b) -> {
            if (a.getOrderDate() == null && b.getOrderDate() == null) return 0;
            if (a.getOrderDate() == null) return 1;
            if (b.getOrderDate() == null) return -1;
            return b.getOrderDate().compareTo(a.getOrderDate());
        });
        
        return requests;
    }

    @Override
    public List<DeliveryRequestDTO> getFilteredDeliveryRequests(Map<String, String> filters) {
        List<DeliveryRequestDTO> requests = new ArrayList<>();
        
        StringBuilder artworkWhereClause = new StringBuilder(" WHERE 1=1 ");
        StringBuilder commissionWhereClause = new StringBuilder(" WHERE 1=1 ");
        List<Object> artworkParams = new ArrayList<>();
        List<Object> commissionParams = new ArrayList<>();
        
        // Apply filters
        if (filters.containsKey("status") && !"all".equals(filters.get("status"))) {
            artworkWhereClause.append(" AND ao.delivery_status = ? ");
            commissionWhereClause.append(" AND cr.delivery_status = ? ");
            artworkParams.add(filters.get("status"));
            commissionParams.add(filters.get("status"));
        }
        
        if (filters.containsKey("startDate") && filters.containsKey("endDate")) {
            artworkWhereClause.append(" AND DATE(ao.order_date) BETWEEN ? AND ? ");
            commissionWhereClause.append(" AND DATE(cr.submitted_at) BETWEEN ? AND ? ");
            artworkParams.add(filters.get("startDate"));
            artworkParams.add(filters.get("endDate"));
            commissionParams.add(filters.get("startDate"));
            commissionParams.add(filters.get("endDate"));
        }
        
        if (filters.containsKey("artistId")) {
            artworkWhereClause.append(" AND ai.artist_id = ? ");
            commissionWhereClause.append(" AND cr.artist_id = ? ");
            artworkParams.add(Long.parseLong(filters.get("artistId")));
            commissionParams.add(Long.parseLong(filters.get("artistId")));
        }
        
        if (filters.containsKey("buyerId")) {
            artworkWhereClause.append(" AND ao.buyer_id = ? ");
            commissionWhereClause.append(" AND cr.buyer_id = ? ");
            artworkParams.add(Long.parseLong(filters.get("buyerId")));
            commissionParams.add(Long.parseLong(filters.get("buyerId")));
        }
        
        // Include artwork orders if requestType is not specified or is "artwork_order"
        if (!filters.containsKey("requestType") || "artwork_order".equals(filters.get("requestType"))) {
            String artworkQuery = """
                SELECT 
                    ao.id,
                    ao.buyer_id,
                    CONCAT(ao.first_name, ' ', ao.last_name) as buyer_name,
                    ao.email,
                    ao.contact_number,
                    ao.shipping_address,
                    COALESCE(ao.delivery_status, 'N/A') as delivery_status,
                    ao.order_date,
                    ao.total_amount,
                    ai.title as artwork_title,
                    ai.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                    CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                           COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                    COALESCE(addr.city, 'N/A') as pickup_city
                FROM AW_orders ao
                LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
                LEFT JOIN artworks ai ON aoi.artwork_id = ai.artwork_id
                LEFT JOIN artists a ON ai.artist_id = a.artist_id
                LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
                """ + artworkWhereClause.toString() + " ORDER BY ao.order_date DESC";
            
            requests.addAll(jdbc.query(artworkQuery, artworkOrderRowMapper, artworkParams.toArray()));
        }
        
        // Include commission requests if requestType is not specified or is "commission_request"
        if (!filters.containsKey("requestType") || "commission_request".equals(filters.get("requestType"))) {
            String commissionQuery = """
                SELECT 
                    cr.id,
                    cr.buyer_id,
                    cr.name,
                    cr.email,
                    cr.phone,
                    cr.shipping_address,
                    COALESCE(cr.delivery_status, 'N/A') as delivery_status,
                    cr.submitted_at,
                    cr.title,
                    cr.artwork_type,
                    cr.dimensions,
                    cr.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                    cr.style,
                    cr.deadline,
                    cr.additional_notes,
                    cr.urgency,
                    cr.budget,
                    CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                           COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                    COALESCE(addr.city, 'N/A') as pickup_city
                FROM commission_requests cr
                LEFT JOIN artists a ON cr.artist_id = a.artist_id
                LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
                """ + commissionWhereClause.toString() + " ORDER BY cr.submitted_at DESC";
            
            requests.addAll(jdbc.query(commissionQuery, commissionRowMapper, commissionParams.toArray()));
        }
        
        // Sort by order date descending
        requests.sort((a, b) -> {
            if (a.getOrderDate() == null && b.getOrderDate() == null) return 0;
            if (a.getOrderDate() == null) return 1;
            if (b.getOrderDate() == null) return -1;
            return b.getOrderDate().compareTo(a.getOrderDate());
        });
        
        return requests;
    }

    @Override
    public Map<String, Object> getDeliveryStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Total deliveries (both artwork orders and commissions)
            String totalDeliveriesQuery = """
                SELECT 
                    (SELECT COUNT(*) FROM AW_orders) + 
                    (SELECT COUNT(*) FROM commission_requests) as total_deliveries
                """;
            Integer totalDeliveries = jdbc.queryForObject(totalDeliveriesQuery, Integer.class);
            stats.put("totalDeliveries", totalDeliveries != null ? totalDeliveries : 0);
            
            // Active deliveries (accepted or outForDelivery)
            String activeDeliveriesQuery = """
                SELECT 
                    (SELECT COUNT(*) FROM AW_orders WHERE delivery_status IN ('accepted', 'outForDelivery')) + 
                    (SELECT COUNT(*) FROM commission_requests WHERE delivery_status IN ('accepted', 'outForDelivery')) as active_deliveries
                """;
            Integer activeDeliveries = jdbc.queryForObject(activeDeliveriesQuery, Integer.class);
            stats.put("activeDeliveries", activeDeliveries != null ? activeDeliveries : 0);
            
            // Completed deliveries
            String completedDeliveriesQuery = """
                SELECT 
                    (SELECT COUNT(*) FROM AW_orders WHERE delivery_status = 'delivered') + 
                    (SELECT COUNT(*) FROM commission_requests WHERE delivery_status = 'delivered') as completed_deliveries
                """;
            Integer completedDeliveries = jdbc.queryForObject(completedDeliveriesQuery, Integer.class);
            stats.put("completedDeliveries", completedDeliveries != null ? completedDeliveries : 0);
            
            // Pending requests
            String pendingRequestsQuery = """
                SELECT 
                    (SELECT COUNT(*) FROM AW_orders WHERE delivery_status = 'pending' OR delivery_status = 'N/A' OR delivery_status IS NULL) + 
                    (SELECT COUNT(*) FROM commission_requests WHERE delivery_status = 'pending' OR delivery_status = 'N/A' OR delivery_status IS NULL) as pending_requests
                """;
            Integer pendingRequests = jdbc.queryForObject(pendingRequestsQuery, Integer.class);
            stats.put("pendingRequests", pendingRequests != null ? pendingRequests : 0);
            
            // Total revenue from delivered orders
            String totalRevenueQuery = """
                SELECT COALESCE(SUM(total_amount), 0) as total_revenue
                FROM AW_orders 
                WHERE delivery_status = 'delivered'
                """;
            BigDecimal totalRevenue = jdbc.queryForObject(totalRevenueQuery, BigDecimal.class);
            stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
            
            // Count delivery partners (assuming there's a delivery_partners table)
            try {
                String partnersQuery = "SELECT COUNT(*) FROM delivery_partners";
                Integer totalPartners = jdbc.queryForObject(partnersQuery, Integer.class);
                stats.put("totalDeliveryPartners", totalPartners != null ? totalPartners : 0);
            } catch (Exception e) {
                stats.put("totalDeliveryPartners", 0);
            }
            
            // Average delivery time and rating (placeholder values)
            stats.put("avgDeliveryTime", 2.3);
            stats.put("avgRating", 4.7);
            
        } catch (Exception e) {
            System.err.println("Error fetching delivery statistics: " + e.getMessage());
            // Return default values
            stats.put("totalDeliveries", 0);
            stats.put("activeDeliveries", 0);
            stats.put("completedDeliveries", 0);
            stats.put("pendingRequests", 0);
            stats.put("totalRevenue", BigDecimal.ZERO);
            stats.put("totalDeliveryPartners", 0);
            stats.put("avgDeliveryTime", 0.0);
            stats.put("avgRating", 0.0);
        }
        
        return stats;
    }

    @Override
    public Optional<DeliveryRequestDTO> getDeliveryRequestById(Long id, String requestType) {
        if ("artwork_order".equals(requestType)) {
            String query = """
                SELECT 
                    ao.id,
                    ao.buyer_id,
                    CONCAT(ao.first_name, ' ', ao.last_name) as buyer_name,
                    ao.email,
                    ao.contact_number,
                    ao.shipping_address,
                    COALESCE(ao.delivery_status, 'N/A') as delivery_status,
                    ao.order_date,
                    ao.total_amount,
                    ai.title as artwork_title,
                    ai.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                    CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                           COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                    COALESCE(addr.city, 'N/A') as pickup_city
                FROM AW_orders ao
                LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
                LEFT JOIN artworks ai ON aoi.artwork_id = ai.artwork_id
                LEFT JOIN artists a ON ai.artist_id = a.artist_id
                LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
                WHERE ao.id = ?
                """;
            
            List<DeliveryRequestDTO> results = jdbc.query(query, artworkOrderRowMapper, id);
            return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
            
        } else if ("commission_request".equals(requestType)) {
            String query = """
                SELECT 
                    cr.id,
                    cr.buyer_id,
                    cr.name,
                    cr.email,
                    cr.phone,
                    cr.shipping_address,
                    COALESCE(cr.delivery_status, 'N/A') as delivery_status,
                    cr.submitted_at,
                    cr.title,
                    cr.artwork_type,
                    cr.dimensions,
                    cr.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                    cr.style,
                    cr.deadline,
                    cr.additional_notes,
                    cr.urgency,
                    cr.budget,
                    CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                           COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) as pickup_address,
                    COALESCE(addr.city, 'N/A') as pickup_city
                FROM commission_requests cr
                LEFT JOIN artists a ON cr.artist_id = a.artist_id
                LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
                WHERE cr.id = ?
                """;
            
            List<DeliveryRequestDTO> results = jdbc.query(query, commissionRowMapper, id);
            return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
        }
        
        return Optional.empty();
    }

    @Override
    public List<ArtistPickupAddressDTO> getAllArtistPickupAddresses() {
        List<ArtistPickupAddressDTO> addresses = new ArrayList<>();
        
        // Get pickup addresses from artwork orders
        String artworkQuery = """
            SELECT 
                ao.id as request_id,
                'artwork_order' as request_type,
                a.artist_id,
                CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                a.email as artist_email,
                a.contactNo as artist_contact,
                addr.street_address,
                addr.city,
                addr.state,
                addr.country,
                addr.zip_code,
                ai.title as artwork_title,
                'Artwork' as artwork_type,
                COALESCE(ao.delivery_status, 'N/A') as delivery_status,
                ao.order_date as request_date,
                ao.total_amount,
                CONCAT(ao.first_name, ' ', ao.last_name) as buyer_name,
                ao.email as buyer_email,
                ao.shipping_address as delivery_address
            FROM AW_orders ao
            LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
            LEFT JOIN artworks ai ON aoi.artwork_id = ai.artwork_id
            LEFT JOIN artists a ON ai.artist_id = a.artist_id
            LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
            ORDER BY ao.order_date DESC
            """;
        
        addresses.addAll(jdbc.query(artworkQuery, pickupAddressRowMapper));
        
        // Get pickup addresses from commission requests
        String commissionQuery = """
            SELECT 
                cr.id as request_id,
                'commission_request' as request_type,
                a.artist_id,
                CONCAT(a.first_name, ' ', a.last_name) as artist_name,
                a.email as artist_email,
                a.contactNo as artist_contact,
                addr.street_address,
                addr.city,
                addr.state,
                addr.country,
                addr.zip_code,
                cr.title as artwork_title,
                cr.artwork_type,
                COALESCE(cr.delivery_status, 'N/A') as delivery_status,
                cr.submitted_at as request_date,
                CAST(COALESCE(REGEXP_REPLACE(cr.budget, '[^0-9.]', ''), '0') AS DECIMAL(10,2)) as total_amount,
                cr.name as buyer_name,
                cr.email as buyer_email,
                cr.shipping_address as delivery_address
            FROM commission_requests cr
            LEFT JOIN artists a ON cr.artist_id = a.artist_id
            LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
            ORDER BY cr.submitted_at DESC
            """;
        
        addresses.addAll(jdbc.query(commissionQuery, pickupAddressRowMapper));
        
        return addresses;
    }

    @Override
    public List<Map<String, Object>> getDeliveryPartnerPerformance() {
        // This would require a delivery_partners table and delivery assignments
        // For now, return empty list
        return new ArrayList<>();
    }

    @Override
    public List<DeliveryRequestDTO> getDeliveryRequestsByPartnerId(Long partnerId) {
        // This would require delivery partner assignment tracking
        // For now, return empty list
        return new ArrayList<>();
    }

    @Override
    public List<DeliveryRequestDTO> getDeliveryRequestsByBuyerId(Long buyerId) {
        Map<String, String> filters = new HashMap<>();
        filters.put("buyerId", buyerId.toString());
        return getFilteredDeliveryRequests(filters);
    }

    @Override
    public List<DeliveryRequestDTO> getDeliveryRequestsByArtistId(Long artistId) {
        Map<String, String> filters = new HashMap<>();
        filters.put("artistId", artistId.toString());
        return getFilteredDeliveryRequests(filters);
    }
}