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
                    id, 
                    buyer_id, 
                    first_name, 
                    last_name, 
                    email, 
                    order_date, 
                    total_amount, 
                    shipping_address, 
                    contact_number, 
                    delivery_status,
                    shipping_fee
                FROM AW_orders 
                WHERE delivery_status = 'pending'
                ORDER BY order_date DESC
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
                    id, 
                    artist_id, 
                    buyer_id, 
                    name, 
                    email, 
                    phone, 
                    title, 
                    artwork_type, 
                    budget, 
                    deadline, 
                    shipping_address, 
                    delivery_status,
                    shipping_fee
                FROM commission_requests 
                WHERE delivery_status = 'pending'
                ORDER BY submitted_at DESC
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