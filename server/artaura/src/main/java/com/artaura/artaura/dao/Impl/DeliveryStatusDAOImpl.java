package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.DeliveryStatusDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public class DeliveryStatusDAOImpl implements DeliveryStatusDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public boolean updateArtworkOrderDeliveryStatus(Long orderId, String deliveryStatus, BigDecimal shippingFee) {
        try {
            String sql;
            Object[] params;
            
            if (shippingFee != null) {
                sql = "UPDATE AW_orders SET delivery_status = ?, shipping_fee = ? WHERE id = ?";
                params = new Object[]{deliveryStatus, shippingFee, orderId};
            } else {
                sql = "UPDATE AW_orders SET delivery_status = ? WHERE id = ?";
                params = new Object[]{deliveryStatus, orderId};
            }
            
            int rowsAffected = jdbcTemplate.update(sql, params);
            System.out.println("Artwork order update - SQL: " + sql + ", Params: " + java.util.Arrays.toString(params) + ", Rows affected: " + rowsAffected);
            return rowsAffected > 0;
        } catch (DataAccessException e) {
            System.err.println("Error updating artwork order delivery status: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateCommissionRequestDeliveryStatus(Long requestId, String deliveryStatus, BigDecimal shippingFee) {
        try {
            // First check if shipping_fee column exists by trying a simpler update
            String sql;
            Object[] params;
            
            if (shippingFee != null) {
                // Try to update both delivery_status and shipping_fee
                sql = "UPDATE commission_requests SET delivery_status = ?, shipping_fee = ? WHERE id = ?";
                params = new Object[]{deliveryStatus, shippingFee, requestId};
            } else {
                // Only update delivery_status
                sql = "UPDATE commission_requests SET delivery_status = ? WHERE id = ?";
                params = new Object[]{deliveryStatus, requestId};
            }
            
            int rowsAffected = jdbcTemplate.update(sql, params);
            System.out.println("Commission request update - SQL: " + sql + ", Params: " + java.util.Arrays.toString(params) + ", Rows affected: " + rowsAffected);
            return rowsAffected > 0;
        } catch (DataAccessException e) {
            System.err.println("Error updating commission request delivery status: " + e.getMessage());
            e.printStackTrace();
            
            // Fallback: try updating only delivery_status if shipping_fee column doesn't exist
            if (shippingFee != null && e.getMessage().contains("shipping_fee")) {
                try {
                    System.out.println("Retrying without shipping_fee column...");
                    String fallbackSql = "UPDATE commission_requests SET delivery_status = ? WHERE id = ?";
                    int rowsAffected = jdbcTemplate.update(fallbackSql, deliveryStatus, requestId);
                    System.out.println("Fallback update rows affected: " + rowsAffected);
                    return rowsAffected > 0;
                } catch (DataAccessException fallbackException) {
                    System.err.println("Fallback update also failed: " + fallbackException.getMessage());
                    fallbackException.printStackTrace();
                    return false;
                }
            }
            return false;
        }
    }

    @Override
    public List<Map<String, Object>> getPendingArtworkOrders() {
        try {
            String sql = """
                SELECT 
                    ao.id, 
                    ao.buyer_id, 
                    ao.first_name, 
                    ao.last_name, 
                    ao.email, 
                    ao.order_date, 
                    ao.total_amount, 
                    ao.shipping_address, 
                    ao.contact_number, 
                    ao.delivery_status,
                    ao.shipping_fee,
                    aoi.artist_id,
                    CONCAT(a.first_name, ' ', a.last_name) AS artist_name,
                    a.contactNo AS artist_contact,
                    a.email AS artist_email,
                    CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                           COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) AS artist_address,
                    addr.city AS artist_city,
                    aoi.title AS artwork_title
                FROM AW_orders ao
                LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
                LEFT JOIN artists a ON aoi.artist_id = a.artist_id
                LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
                WHERE ao.delivery_status = 'pending'
                ORDER BY ao.order_date DESC
                """;
            return jdbcTemplate.queryForList(sql);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Override
    public List<Map<String, Object>> getPendingCommissionRequests() {
        try {
            String sql = """
                SELECT 
                    cr.id, 
                    cr.artist_id, 
                    cr.buyer_id, 
                    cr.name, 
                    cr.email, 
                    cr.phone, 
                    cr.title, 
                    cr.artwork_type, 
                    cr.budget, 
                    cr.deadline, 
                    cr.shipping_address, 
                    cr.delivery_status,
                    cr.shipping_fee,
                    cr.submitted_at,
                    cr.dimensions,
                    cr.style,
                    cr.urgency,
                    cr.additional_notes,
                    CONCAT(a.first_name, ' ', a.last_name) AS artist_name,
                    a.contactNo AS artist_contact,
                    a.email AS artist_email,
                    CONCAT(COALESCE(addr.street_address, ''), ', ', COALESCE(addr.city, ''), ', ', 
                           COALESCE(addr.state, ''), ', ', COALESCE(addr.country, '')) AS artist_address,
                    addr.city AS artist_city
                FROM commission_requests cr
                LEFT JOIN artists a ON cr.artist_id = a.artist_id
                LEFT JOIN addresses addr ON a.artist_id = addr.artist_id
                WHERE cr.delivery_status = 'pending'
                ORDER BY cr.submitted_at DESC
                """;
            return jdbcTemplate.queryForList(sql);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Override
    public Map<String, Object> getArtworkOrderDeliveryInfo(Long orderId) {
        try {
            String sql = """
                SELECT 
                    id, 
                    delivery_status, 
                    shipping_fee, 
                    shipping_address,
                    first_name,
                    last_name,
                    contact_number
                FROM AW_orders 
                WHERE id = ?
                """;
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, orderId);
            return results.isEmpty() ? Map.of() : results.get(0);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return Map.of();
        }
    }

    @Override
    public Map<String, Object> getCommissionRequestDeliveryInfo(Long requestId) {
        try {
            String sql = """
                SELECT 
                    id, 
                    delivery_status, 
                    shipping_fee, 
                    shipping_address,
                    name,
                    phone,
                    title
                FROM commission_requests 
                WHERE id = ?
                """;
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, requestId);
            return results.isEmpty() ? Map.of() : results.get(0);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return Map.of();
        }
    }

    @Override
    public boolean acceptArtworkOrderDelivery(Long orderId, BigDecimal shippingFee, Long deliveryPartnerId) {
        try {
            String sql = """
                UPDATE AW_orders 
                SET delivery_status = 'accepted', 
                    shipping_fee = ? 
                WHERE id = ? AND delivery_status = 'pending'
                """;
            int rowsAffected = jdbcTemplate.update(sql, shippingFee, orderId);
            return rowsAffected > 0;
        } catch (DataAccessException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean acceptCommissionRequestDelivery(Long requestId, BigDecimal shippingFee, Long deliveryPartnerId) {
        try {
            String sql = """
                UPDATE commission_requests 
                SET delivery_status = 'accepted', 
                    shipping_fee = ? 
                WHERE id = ? AND delivery_status = 'pending'
                """;
            int rowsAffected = jdbcTemplate.update(sql, shippingFee, requestId);
            return rowsAffected > 0;
        } catch (DataAccessException e) {
            e.printStackTrace();
            return false;
        }
    }
}