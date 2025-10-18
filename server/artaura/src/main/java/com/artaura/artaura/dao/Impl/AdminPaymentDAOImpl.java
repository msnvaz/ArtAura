package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AdminPaymentDAO;
import com.artaura.artaura.dto.admin.AdminPaymentDTO;
import com.artaura.artaura.dto.admin.AdminPaymentFilterDTO;
import com.artaura.artaura.dto.admin.AdminPaymentResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository("adminPaymentDAOImpl")
public class AdminPaymentDAOImpl implements AdminPaymentDAO {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public AdminPaymentResponseDTO getAllPayments(AdminPaymentFilterDTO filter) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT p.id, p.AW_order_id, p.commission_request_id, p.artist_id, p.buyer_id, ");
        sql.append("p.amount, p.status, p.created_at, p.updated_at, ");
        sql.append("CONCAT(a.first_name, ' ', a.last_name) as artist_name, a.email as artist_email, ");
        sql.append("CONCAT(b.first_name, ' ', b.last_name) as buyer_name, b.email as buyer_email, ");
        sql.append("CASE WHEN p.AW_order_id IS NOT NULL THEN 'order' ELSE 'commission' END as payment_type, ");
        sql.append("COALESCE(pf.fee_amount, 0) as platform_fee, ");
        sql.append("CASE WHEN p.AW_order_id IS NOT NULL THEN ");
        sql.append("  CONCAT('Order #', p.AW_order_id) ");
        sql.append("ELSE ");
        sql.append("  COALESCE(cr.title, 'Commission Request') ");
        sql.append("END as description ");
        sql.append("FROM payment p ");
        sql.append("LEFT JOIN artists a ON p.artist_id = a.artist_id ");
        sql.append("LEFT JOIN buyers b ON p.buyer_id = b.buyer_id ");
        sql.append("LEFT JOIN platform_fees pf ON p.id = pf.payment_id ");
        sql.append("LEFT JOIN commission_requests cr ON p.commission_request_id = cr.id ");
        sql.append("WHERE 1=1 ");

        List<Object> params = new ArrayList<>();

        // Apply filters
        if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
            sql.append("AND p.status = ? ");
            params.add(filter.getStatus());
        }

        if (filter.getPaymentType() != null && !filter.getPaymentType().isEmpty()) {
            if ("order".equals(filter.getPaymentType())) {
                sql.append("AND p.AW_order_id IS NOT NULL ");
            } else if ("commission".equals(filter.getPaymentType())) {
                sql.append("AND p.commission_request_id IS NOT NULL ");
            }
        }

        if (filter.getArtistId() != null) {
            sql.append("AND p.artist_id = ? ");
            params.add(filter.getArtistId());
        }

        if (filter.getBuyerId() != null) {
            sql.append("AND p.buyer_id = ? ");
            params.add(filter.getBuyerId());
        }

        // Count query for pagination
        String countSql = "SELECT COUNT(*) " + sql.toString().substring(sql.toString().indexOf("FROM"));
        Long totalElements = jdbc.queryForObject(countSql, Long.class, params.toArray());

        // Add sorting
        if (filter.getSortBy() != null && !filter.getSortBy().isEmpty()) {
            sql.append("ORDER BY p.").append(filter.getSortBy()).append(" ");
            if (filter.getSortOrder() != null && filter.getSortOrder().equalsIgnoreCase("ASC")) {
                sql.append("ASC ");
            } else {
                sql.append("DESC ");
            }
        } else {
            sql.append("ORDER BY p.created_at DESC ");
        }

        // Add pagination
        int offset = filter.getPage() * filter.getSize();
        sql.append("LIMIT ? OFFSET ? ");
        params.add(filter.getSize());
        params.add(offset);

        List<AdminPaymentDTO> payments = jdbc.query(sql.toString(), params.toArray(), (rs, rowNum) -> {
            AdminPaymentDTO payment = new AdminPaymentDTO();
            payment.setId(rs.getInt("id"));
            payment.setAwOrderId(rs.getObject("AW_order_id", Integer.class));
            payment.setCommissionRequestId(rs.getObject("commission_request_id", Integer.class));
            payment.setArtistId(rs.getLong("artist_id"));
            payment.setBuyerId(rs.getLong("buyer_id"));
            payment.setAmount(rs.getBigDecimal("amount"));
            payment.setStatus(rs.getString("status"));
            payment.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                payment.setUpdatedAt(updatedAt.toLocalDateTime());
            }
            
            payment.setArtistName(rs.getString("artist_name"));
            payment.setArtistEmail(rs.getString("artist_email"));
            payment.setBuyerName(rs.getString("buyer_name"));
            payment.setBuyerEmail(rs.getString("buyer_email"));
            payment.setPaymentType(rs.getString("payment_type"));
            payment.setOrderDescription(rs.getString("description"));
            payment.setPlatformFee(rs.getBigDecimal("platform_fee"));
            
            return payment;
        });

        int totalPages = (int) Math.ceil((double) totalElements / filter.getSize());

        return new AdminPaymentResponseDTO(payments, totalElements, totalPages, filter.getPage(), filter.getSize());
    }

    @Override
    public Optional<AdminPaymentDTO> getPaymentById(Integer paymentId) {
        String sql = "SELECT p.id, p.AW_order_id, p.commission_request_id, p.artist_id, p.buyer_id, " +
                    "p.amount, p.status, p.created_at, p.updated_at, " +
                    "CONCAT(a.first_name, ' ', a.last_name) as artist_name, a.email as artist_email, " +
                    "CONCAT(b.first_name, ' ', b.last_name) as buyer_name, b.email as buyer_email, " +
                    "CASE WHEN p.AW_order_id IS NOT NULL THEN 'order' ELSE 'commission' END as payment_type, " +
                    "COALESCE(pf.fee_amount, 0) as platform_fee, " +
                    "CASE WHEN p.AW_order_id IS NOT NULL THEN " +
                    "  CONCAT('Order #', p.AW_order_id) " +
                    "ELSE " +
                    "  COALESCE(cr.title, 'Commission Request') " +
                    "END as description " +
                    "FROM payment p " +
                    "LEFT JOIN artists a ON p.artist_id = a.artist_id " +
                    "LEFT JOIN buyers b ON p.buyer_id = b.buyer_id " +
                    "LEFT JOIN platform_fees pf ON p.id = pf.payment_id " +
                    "LEFT JOIN commission_requests cr ON p.commission_request_id = cr.id " +
                    "WHERE p.id = ?";

        try {
            AdminPaymentDTO payment = jdbc.queryForObject(sql, new Object[]{paymentId}, (rs, rowNum) -> {
                AdminPaymentDTO p = new AdminPaymentDTO();
                p.setId(rs.getInt("id"));
                p.setAwOrderId(rs.getObject("AW_order_id", Integer.class));
                p.setCommissionRequestId(rs.getObject("commission_request_id", Integer.class));
                p.setArtistId(rs.getLong("artist_id"));
                p.setBuyerId(rs.getLong("buyer_id"));
                p.setAmount(rs.getBigDecimal("amount"));
                p.setStatus(rs.getString("status"));
                p.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                
                Timestamp updatedAt = rs.getTimestamp("updated_at");
                if (updatedAt != null) {
                    p.setUpdatedAt(updatedAt.toLocalDateTime());
                }
                
                p.setArtistName(rs.getString("artist_name"));
                p.setArtistEmail(rs.getString("artist_email"));
                p.setBuyerName(rs.getString("buyer_name"));
                p.setBuyerEmail(rs.getString("buyer_email"));
                p.setPaymentType(rs.getString("payment_type"));
                p.setOrderDescription(rs.getString("description"));
                p.setPlatformFee(rs.getBigDecimal("platform_fee"));
                
                return p;
            });
            return Optional.of(payment);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<AdminPaymentDTO> getPaymentsByArtistId(Long artistId) {
        AdminPaymentFilterDTO filter = new AdminPaymentFilterDTO();
        filter.setArtistId(artistId);
        filter.setPage(0);
        filter.setSize(Integer.MAX_VALUE);
        return getAllPayments(filter).getPayments();
    }

    @Override
    public List<AdminPaymentDTO> getPaymentsByBuyerId(Long buyerId) {
        AdminPaymentFilterDTO filter = new AdminPaymentFilterDTO();
        filter.setBuyerId(buyerId);
        filter.setPage(0);
        filter.setSize(Integer.MAX_VALUE);
        return getAllPayments(filter).getPayments();
    }

    @Override
    public List<AdminPaymentDTO> getPaymentsByStatus(String status) {
        AdminPaymentFilterDTO filter = new AdminPaymentFilterDTO();
        filter.setStatus(status);
        filter.setPage(0);
        filter.setSize(Integer.MAX_VALUE);
        return getAllPayments(filter).getPayments();
    }

    @Override
    public List<AdminPaymentDTO> getPaymentsByType(String paymentType) {
        AdminPaymentFilterDTO filter = new AdminPaymentFilterDTO();
        filter.setPaymentType(paymentType);
        filter.setPage(0);
        filter.setSize(Integer.MAX_VALUE);
        return getAllPayments(filter).getPayments();
    }

    @Override
    public Long getTotalPaymentsCount() {
        String sql = "SELECT COUNT(*) FROM payment";
        return jdbc.queryForObject(sql, Long.class);
    }

    @Override
    public Long getPaymentsCountByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM payment WHERE status = ?";
        return jdbc.queryForObject(sql, new Object[]{status}, Long.class);
    }

    @Override
    public BigDecimal getTotalAmountByStatus(String status) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM payment WHERE status = ?";
        return jdbc.queryForObject(sql, new Object[]{status}, BigDecimal.class);
    }

    @Override
    public boolean updatePaymentStatus(Integer paymentId, String status) {
        String sql = "UPDATE payment SET status = ? WHERE id = ?";
        int rowsAffected = jdbc.update(sql, status, paymentId);
        return rowsAffected > 0;
    }

    @Override
    public List<String> getDistinctStatuses() {
        String sql = "SELECT DISTINCT status FROM payment ORDER BY status";
        return jdbc.queryForList(sql, String.class);
    }

    @Override
    public Object getPaymentStatistics() {
        String sql = "SELECT " +
                    "COUNT(*) as total_payments, " +
                    "SUM(amount) as total_amount, " +
                    "SUM(CASE WHEN status = 'escrow' THEN amount ELSE 0 END) as escrow_amount, " +
                    "SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_amount, " +
                    "SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END) as refunded_amount, " +
                    "COUNT(CASE WHEN AW_order_id IS NOT NULL THEN 1 END) as order_payments, " +
                    "COUNT(CASE WHEN commission_request_id IS NOT NULL THEN 1 END) as commission_payments " +
                    "FROM payment";

        return jdbc.queryForMap(sql);
    }

    @Override
    public List<AdminPaymentDTO> searchPayments(String searchTerm) {
        String sql = "SELECT p.id, p.AW_order_id, p.commission_request_id, p.artist_id, p.buyer_id, " +
                    "p.amount, p.status, p.created_at, p.updated_at, " +
                    "CONCAT(a.first_name, ' ', a.last_name) as artist_name, a.email as artist_email, " +
                    "CONCAT(b.first_name, ' ', b.last_name) as buyer_name, b.email as buyer_email, " +
                    "CASE WHEN p.AW_order_id IS NOT NULL THEN 'order' ELSE 'commission' END as payment_type, " +
                    "COALESCE(pf.fee_amount, 0) as platform_fee, " +
                    "CASE WHEN p.AW_order_id IS NOT NULL THEN " +
                    "  CONCAT('Order #', p.AW_order_id) " +
                    "ELSE " +
                    "  COALESCE(cr.title, 'Commission Request') " +
                    "END as description " +
                    "FROM payment p " +
                    "LEFT JOIN artists a ON p.artist_id = a.artist_id " +
                    "LEFT JOIN buyers b ON p.buyer_id = b.buyer_id " +
                    "LEFT JOIN platform_fees pf ON p.id = pf.payment_id " +
                    "LEFT JOIN commission_requests cr ON p.commission_request_id = cr.id " +
                    "WHERE CONCAT(a.first_name, ' ', a.last_name) LIKE ? " +
                    "OR CONCAT(b.first_name, ' ', b.last_name) LIKE ? " +
                    "OR a.email LIKE ? " +
                    "OR b.email LIKE ? " +
                    "ORDER BY p.created_at DESC";

        String searchPattern = "%" + searchTerm + "%";
        return jdbc.query(sql, new Object[]{searchPattern, searchPattern, searchPattern, searchPattern}, (rs, rowNum) -> {
            AdminPaymentDTO payment = new AdminPaymentDTO();
            payment.setId(rs.getInt("id"));
            payment.setAwOrderId(rs.getObject("AW_order_id", Integer.class));
            payment.setCommissionRequestId(rs.getObject("commission_request_id", Integer.class));
            payment.setArtistId(rs.getLong("artist_id"));
            payment.setBuyerId(rs.getLong("buyer_id"));
            payment.setAmount(rs.getBigDecimal("amount"));
            payment.setStatus(rs.getString("status"));
            payment.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                payment.setUpdatedAt(updatedAt.toLocalDateTime());
            }
            
            payment.setArtistName(rs.getString("artist_name"));
            payment.setArtistEmail(rs.getString("artist_email"));
            payment.setBuyerName(rs.getString("buyer_name"));
            payment.setBuyerEmail(rs.getString("buyer_email"));
            payment.setPaymentType(rs.getString("payment_type"));
            payment.setOrderDescription(rs.getString("description"));
            payment.setPlatformFee(rs.getBigDecimal("platform_fee"));
            
            return payment;
        });
    }
}