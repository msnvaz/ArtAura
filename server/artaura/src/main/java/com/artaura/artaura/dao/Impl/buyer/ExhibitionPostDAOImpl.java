package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.ExhibitionPostDAO;
import com.artaura.artaura.dto.exhibition.ExhibitionPostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ExhibitionPostDAOImpl implements ExhibitionPostDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int save(ExhibitionPostDTO post) {
        String sql = "INSERT INTO exhibitions (title, description, location, category, start_date, end_date, start_time, end_time, organizer, entry_fee, max_participants, contact_email, contact_phone, requirements, created_by, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                post.getTitle(),
                post.getDescription(),
                post.getLocation(),
                post.getCategory(),
                post.getStartDate(),
                post.getEndDate(),
                post.getStartTime(),
                post.getEndTime(),
                post.getOrganizer(),
                post.getEntryFee(),
                post.getMaxParticipants(),
                post.getContactEmail(),
                post.getContactPhone(),
                post.getRequirements(),
                post.getCreatedBy(),
                post.getCreatedAt(),
                post.getStatus() // <-- status now included
        );
    }

    @Override
    public List<ExhibitionPostDTO> getAllExhibitions() {
        String sql = "SELECT e.*, CONCAT(b.first_name, ' ', b.last_name) AS creator_name FROM exhibitions e LEFT JOIN buyers b ON e.created_by = b.buyer_id";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ExhibitionPostDTO exhibition = new ExhibitionPostDTO();
            exhibition.setId(rs.getLong("id"));
            exhibition.setTitle(rs.getString("title"));
            exhibition.setDescription(rs.getString("description"));
            exhibition.setLocation(rs.getString("location"));
            exhibition.setCategory(rs.getString("category"));
            exhibition.setStartDate(rs.getString("start_date"));
            exhibition.setEndDate(rs.getString("end_date"));
            exhibition.setStartTime(rs.getString("start_time"));
            exhibition.setEndTime(rs.getString("end_time"));
            exhibition.setOrganizer(rs.getString("organizer"));
            exhibition.setEntryFee(rs.getString("entry_fee"));
            exhibition.setMaxParticipants(rs.getInt("max_participants"));
            exhibition.setContactEmail(rs.getString("contact_email"));
            exhibition.setContactPhone(rs.getString("contact_phone"));
            exhibition.setRequirements(rs.getString("requirements"));
            exhibition.setCreatedBy(rs.getLong("created_by"));
            exhibition.setCreatedAt(rs.getString("created_at"));
            exhibition.setStatus(rs.getString("status"));
            exhibition.setCreatorName(rs.getString("creator_name"));
            exhibition.setLikes(rs.getInt("likes")); // <-- Add this line
            return exhibition;
        });
    }

    // Add a RowMapper for ExhibitionPostDTO
    private static final org.springframework.jdbc.core.RowMapper<ExhibitionPostDTO> ExhibitionPostRowMapper = (rs, rowNum) -> {
        ExhibitionPostDTO exhibition = new ExhibitionPostDTO();
        exhibition.setId(rs.getLong("id"));
        exhibition.setTitle(rs.getString("title"));
        exhibition.setDescription(rs.getString("description"));
        exhibition.setLocation(rs.getString("location"));
        exhibition.setCategory(rs.getString("category"));
        exhibition.setStartDate(rs.getString("start_date"));
        exhibition.setEndDate(rs.getString("end_date"));
        exhibition.setStartTime(rs.getString("start_time"));
        exhibition.setEndTime(rs.getString("end_time"));
        exhibition.setOrganizer(rs.getString("organizer"));
        exhibition.setEntryFee(rs.getString("entry_fee"));
        exhibition.setMaxParticipants(rs.getInt("max_participants"));
        exhibition.setContactEmail(rs.getString("contact_email"));
        exhibition.setContactPhone(rs.getString("contact_phone"));
        exhibition.setRequirements(rs.getString("requirements"));
        exhibition.setCreatedBy(rs.getLong("created_by"));
        exhibition.setCreatedAt(rs.getString("created_at"));
        exhibition.setStatus(rs.getString("status")); // Map the status field
        return exhibition;
    };

    @Override
    public List<ExhibitionPostDTO> findByCreatedBy(Long userId) {
        String sql = "SELECT * FROM exhibitions WHERE created_by = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, ExhibitionPostRowMapper);
    }

    @Override
    public int update(ExhibitionPostDTO post) {
        String sql = "UPDATE exhibitions SET title = ?, description = ?, location = ?, category = ?, start_date = ?, end_date = ?, start_time = ?, end_time = ?, organizer = ?, entry_fee = ?, max_participants = ?, contact_email = ?, contact_phone = ?, requirements = ?, status = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                post.getTitle(),
                post.getDescription(),
                post.getLocation(),
                post.getCategory(),
                post.getStartDate(),
                post.getEndDate(),
                post.getStartTime(),
                post.getEndTime(),
                post.getOrganizer(),
                post.getEntryFee(),
                post.getMaxParticipants(),
                post.getContactEmail(),
                post.getContactPhone(),
                post.getRequirements(),
                post.getStatus(), // <-- status now updated
                post.getId()
        );
    }

    @Override
    public int delete(Long postId) {
        String sql = "DELETE FROM exhibitions WHERE id = ?";
        return jdbcTemplate.update(sql, postId);
    }
    
    public int incrementLikes(Long postId) {
        // Get userId from SecurityContext if available (or pass as parameter if needed)
        // For now, assume userId is passed as a parameter to this method in the service/controller
        throw new UnsupportedOperationException("Use incrementLikes(Long postId, Long userId) instead");
    }

    // New method to enforce single-like-per-user
    public int incrementLikes(Long postId, Long userId) {
        // Check if user already liked
        String checkSql = "SELECT COUNT(*) FROM exhibition_post_likes WHERE post_id = ? AND user_id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, postId, userId);
        if (count != null && count > 0) {
            // Already liked, return current like count
            String selectSql = "SELECT likes FROM exhibitions WHERE id = ?";
            Integer likes = jdbcTemplate.queryForObject(selectSql, Integer.class, postId);
            return likes != null ? likes : 0;
        }
        // Insert like
        String insertSql = "INSERT INTO exhibition_post_likes (post_id, user_id) VALUES (?, ?)";
        jdbcTemplate.update(insertSql, postId, userId);
        // Increment likes count
        String updateSql = "UPDATE exhibitions SET likes = COALESCE(likes,0) + 1 WHERE id = ?";
        jdbcTemplate.update(updateSql, postId);
        // Return new like count
        String selectSql = "SELECT likes FROM exhibitions WHERE id = ?";
        Integer likes = jdbcTemplate.queryForObject(selectSql, Integer.class, postId);
        return likes != null ? likes : 0;
    }

    @Override
    public int removeUserLike(Long postId, Long userId) {
        String sql = "DELETE FROM exhibition_post_likes WHERE post_id = ? AND user_id = ?";
        int affected = jdbcTemplate.update(sql, postId, userId);
        if (affected > 0) {
            // Decrement the likes count in the exhibitions table
            String updateLikes = "UPDATE exhibitions SET likes = GREATEST(COALESCE(likes,1) - 1, 0) WHERE id = ?";
            jdbcTemplate.update(updateLikes, postId);
        }
        // Return the new like count
        String selectSql = "SELECT likes FROM exhibitions WHERE id = ?";
        Integer likes = jdbcTemplate.queryForObject(selectSql, Integer.class, postId);
        return likes != null ? likes : 0;
    }

    @Override
    public int hasUserLiked(Long postId, Long userId) {
        String sql = "SELECT COUNT(*) FROM exhibition_post_likes WHERE post_id = ? AND user_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId, userId);
        return count != null && count > 0 ? 1 : 0;
    }
}
