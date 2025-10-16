package com.artaura.artaura.dao;

import com.artaura.artaura.dto.commission.CommissionRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CommissionRequestDAOImpl implements CommissionRequestDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<CommissionRequestDTO> commissionRequestRowMapper = new RowMapper<CommissionRequestDTO>() {
        @Override
        public CommissionRequestDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            CommissionRequestDTO dto = new CommissionRequestDTO();
            dto.setId(rs.getLong("id"));
            dto.setArtistId(rs.getLong("artist_id"));
            dto.setBuyerId(rs.getLong("buyer_id"));
            dto.setName(rs.getString("name"));
            dto.setEmail(rs.getString("email"));
            dto.setPhone(rs.getString("phone"));
            dto.setTitle(rs.getString("title"));
            dto.setArtworkType(rs.getString("artwork_type"));
            dto.setStyle(rs.getString("style"));
            dto.setDimensions(rs.getString("dimensions"));
            dto.setBudget(rs.getBigDecimal("budget"));
            dto.setDeadline(rs.getDate("deadline") != null ? rs.getDate("deadline").toLocalDate() : null);
            dto.setAdditionalNotes(rs.getString("additional_notes"));
            dto.setUrgency(rs.getString("urgency"));
            dto.setStatus(rs.getString("status"));
            dto.setSubmittedAt(rs.getTimestamp("submitted_at") != null ? rs.getTimestamp("submitted_at").toLocalDateTime() : null);
            return dto;
        }
    };

    @Override
    public List<CommissionRequestDTO> getCommissionRequestsByArtistId(Long artistId) {
        String sql = "SELECT * FROM commission_requests WHERE artist_id = ? ORDER BY submitted_at DESC";
        return jdbcTemplate.query(sql, commissionRequestRowMapper, artistId);
    }

    @Override
    public List<CommissionRequestDTO> getCommissionRequestsByBuyerId(Long buyerId) {
        String sql = "SELECT * FROM commission_requests WHERE buyer_id = ? ORDER BY submitted_at DESC";
        return jdbcTemplate.query(sql, commissionRequestRowMapper, buyerId);
    }

    @Override
    public boolean acceptCommissionRequest(Long requestId) {
        String sql = "UPDATE commission_requests SET status = 'accepted' WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, requestId);
        return rowsAffected > 0;
    }

    @Override
    public boolean rejectCommissionRequest(Long requestId) {
        String sql = "UPDATE commission_requests SET status = 'rejected' WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, requestId);
        return rowsAffected > 0;
    }

    @Override
    public CommissionRequestDTO getCommissionRequestById(Long requestId) {
        String sql = "SELECT * FROM commission_requests WHERE id = ?";
        List<CommissionRequestDTO> results = jdbcTemplate.query(sql, commissionRequestRowMapper, requestId);
        return results.isEmpty() ? null : results.get(0);
    }

    /**
     * Get commission requests count for a specific artist
     * @param artistId The ID of the artist
     * @return Count of commission requests
     */
    public int getCommissionRequestsCountByArtistId(Long artistId) {
        String sql = "SELECT COUNT(*) FROM commission_requests WHERE artist_id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, artistId);
    }

    /**
     * Update commission request status
     * @param requestId The ID of the commission request
     * @param status The new status
     * @return true if updated successfully
     */
    public boolean updateCommissionRequestStatus(Long requestId, String status) {
        String sql = "UPDATE commission_requests SET status = ? WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, status, requestId);
        return rowsAffected > 0;
    }
}
