package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.ComissionRequestDAO;
import com.artaura.artaura.dto.buyer.CommissionRequestDTO;
import com.artaura.artaura.dto.buyer.CommissionResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;

@Repository("buyerCommissionDAO")
public class CommissionRequestDAOImpl implements ComissionRequestDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Long saveCommissionRequest(CommissionRequestDTO dto) {
        String sql = "INSERT INTO commission_requests (artist_id, buyer_id, name, email, phone, title, artwork_type, style, dimensions, deadline, additional_notes, urgency, status, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        try {
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, dto.getArtistId());
                ps.setLong(2, dto.getClientId());
                ps.setString(3, dto.getClientName() != null ? dto.getClientName() : "");
                ps.setString(4, dto.getClientEmail() != null ? dto.getClientEmail() : "");
                ps.setString(5, dto.getClientPhone() != null ? dto.getClientPhone() : "");
                ps.setString(6, dto.getTitle() != null ? dto.getTitle() : "");
                ps.setString(7, dto.getArtworkType() != null ? dto.getArtworkType() : "");
                ps.setString(8, dto.getStyle() != null ? dto.getStyle() : "");
                ps.setString(9, dto.getDimensions() != null ? dto.getDimensions() : "");
                ps.setString(10, dto.getBudget() != null ? dto.getBudget() : "");
                ps.setString(11, dto.getDeadline() != null ? dto.getDeadline() : "");
                ps.setString(12, dto.getAdditionalNotes() != null ? dto.getAdditionalNotes() : "");
                ps.setString(13, dto.getUrgency() != null ? dto.getUrgency() : "");
                ps.setString(14, dto.getStatus() != null ? dto.getStatus() : "PENDING");
                ps.setString(15, LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                ps.setString(16, "PENDING"); // Set default payment_status
                return ps;
            }, keyHolder);

            if (keyHolder.getKey() != null) {
                return keyHolder.getKey().longValue();
            } else {
                throw new RuntimeException("Failed to get generated key for commission request");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error saving commission request: " + e.getMessage(), e);
        }
    }

    @Override
    public void saveReferenceImages(Long commissionRequestId, List<String> imageUrls) {
        String sql = "INSERT INTO commission_reference_images (commission_request_id, image_url, uploaded_at) VALUES (?, ?, ?)";
        for (String url : imageUrls) {
            // Ensure the URL is in the format /uploads/filename.jpg
            String imageUrl = url.startsWith("/uploads/") ? url : "/uploads/" + url;
            jdbcTemplate.update(sql, commissionRequestId, imageUrl, LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
    }

    @Override
    public List<CommissionResponseDTO> getCommissionRequestsByClientId(Long clientId) {
        String sql = "SELECT * FROM commission_requests WHERE buyer_id = ?";
        List<CommissionResponseDTO> requests = jdbcTemplate.query(sql, (rs, rowNum) -> {
            CommissionResponseDTO dto = new CommissionResponseDTO();
            dto.setId(rs.getLong("id"));
            dto.setArtistId(rs.getLong("artist_id"));
            dto.setClientId(rs.getLong("buyer_id"));
            dto.setClientName(rs.getString("name"));
            dto.setClientEmail(rs.getString("email"));
            dto.setClientPhone(rs.getString("phone"));
            dto.setTitle(rs.getString("title"));
            dto.setArtworkType(rs.getString("artwork_type"));
            dto.setStyle(rs.getString("style"));
            dto.setDimensions(rs.getString("dimensions"));
            dto.setBudget(rs.getString("budget"));
            dto.setDeadline(rs.getString("deadline"));
            dto.setAdditionalNotes(rs.getString("additional_notes"));
            dto.setUrgency(rs.getString("urgency"));
            dto.setStatus(rs.getString("status"));
            dto.setSubmittedAt(rs.getString("submitted_at"));
            dto.setDeliveryStatus(rs.getString("delivery_status")); // Fetch delivery_status from commission_requests table

            // Fetch reference images for this commission request
            String imgSql = "SELECT image_url FROM commission_reference_images WHERE commission_request_id = ?";
            List<String> images = jdbcTemplate.query(imgSql, (imgRs, imgRow) -> imgRs.getString("image_url"), dto.getId());
            dto.setImageUrls(images);

            return dto;
        }, clientId);
        return requests;
    }
}
