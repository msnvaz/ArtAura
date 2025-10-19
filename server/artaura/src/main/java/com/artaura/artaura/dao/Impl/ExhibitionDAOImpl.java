package com.artaura.artaura.dao.Impl;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.artaura.artaura.dao.ExhibitionDAO;
import com.artaura.artaura.dto.CreateExhibitionDTO;
import com.artaura.artaura.dto.ExhibitionDTO;

@Repository
public class ExhibitionDAOImpl implements ExhibitionDAO {

    private static final Logger logger = LoggerFactory.getLogger(ExhibitionDAOImpl.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<ExhibitionDTO> exhibitionRowMapper = new RowMapper<ExhibitionDTO>() {
        @Override
        public ExhibitionDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ExhibitionDTO exhibition = new ExhibitionDTO();
            exhibition.setExhibitionId(rs.getInt("exhibition_id"));
            exhibition.setArtistId(rs.getInt("artist_id"));
            exhibition.setTitle(rs.getString("title"));
            exhibition.setDescription(rs.getString("description"));
            exhibition.setLocation(rs.getString("location"));
            exhibition.setVenue(rs.getString("venue"));
            exhibition.setStartDate(rs.getDate("start_date") != null ? rs.getDate("start_date").toLocalDate() : null);
            exhibition.setEndDate(rs.getDate("end_date") != null ? rs.getDate("end_date").toLocalDate() : null);
            exhibition.setStatus(rs.getString("status"));
            exhibition.setExhibitionType(rs.getString("exhibition_type"));
            exhibition.setArtworksCount(rs.getInt("artworks_count"));
            exhibition.setTotalVisitors(rs.getInt("total_visitors"));
            exhibition.setFeaturedImageUrl(rs.getString("featured_image_url"));
            exhibition.setWebsiteUrl(rs.getString("website_url"));
            exhibition.setContactEmail(rs.getString("contact_email"));
            exhibition.setContactPhone(rs.getString("contact_phone"));
            exhibition.setEntryFee(rs.getBigDecimal("entry_fee"));
            exhibition.setIsFeatured(rs.getBoolean("is_featured"));
            exhibition.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
            exhibition.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return exhibition;
        }
    };

    @Override
    public ExhibitionDTO createExhibition(CreateExhibitionDTO createExhibitionDTO, Integer artistId) {
        logger.info("Creating exhibition for artist ID: {}", artistId);

        String sql = """
            INSERT INTO artist_exhibitions (
                artist_id, title, description, location, venue, start_date, end_date,
                status, exhibition_type, artworks_count, total_visitors,
                website_url, contact_email, contact_phone, entry_fee, is_featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        try {
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, artistId);
                ps.setString(2, createExhibitionDTO.getTitle());
                ps.setString(3, createExhibitionDTO.getDescription());
                ps.setString(4, createExhibitionDTO.getLocation());
                ps.setString(5, createExhibitionDTO.getVenue());
                ps.setDate(6, createExhibitionDTO.getStartDate() != null ? java.sql.Date.valueOf(createExhibitionDTO.getStartDate()) : null);
                ps.setDate(7, createExhibitionDTO.getEndDate() != null ? java.sql.Date.valueOf(createExhibitionDTO.getEndDate()) : null);
                ps.setString(8, createExhibitionDTO.getStatus() != null ? createExhibitionDTO.getStatus() : "upcoming");
                ps.setString(9, createExhibitionDTO.getExhibitionType() != null ? createExhibitionDTO.getExhibitionType() : "group");
                ps.setInt(10, createExhibitionDTO.getArtworksCount() != null ? createExhibitionDTO.getArtworksCount() : 0);
                ps.setInt(11, createExhibitionDTO.getTotalVisitors() != null ? createExhibitionDTO.getTotalVisitors() : 0);
                ps.setString(12, createExhibitionDTO.getWebsiteUrl());
                ps.setString(13, createExhibitionDTO.getContactEmail());
                ps.setString(14, createExhibitionDTO.getContactPhone());
                ps.setBigDecimal(15, createExhibitionDTO.getEntryFee() != null ? createExhibitionDTO.getEntryFee() : BigDecimal.ZERO);
                ps.setBoolean(16, createExhibitionDTO.getIsFeatured() != null ? createExhibitionDTO.getIsFeatured() : false);
                return ps;
            }, keyHolder);

            Number generatedId = keyHolder.getKey();
            if (generatedId != null) {
                return getExhibitionById(generatedId.intValue()).orElse(null);
            }
        } catch (Exception e) {
            logger.error("Error creating exhibition: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create exhibition", e);
        }

        return null;
    }

    @Override
    public List<ExhibitionDTO> getExhibitionsByArtistId(Integer artistId) {
        logger.info("Fetching exhibitions for artist ID: {}", artistId);

        String sql = """
            SELECT * FROM artist_exhibitions 
            WHERE artist_id = ? 
            ORDER BY start_date DESC
        """;

        try {
            return jdbcTemplate.query(sql, exhibitionRowMapper, artistId);
        } catch (Exception e) {
            logger.error("Error fetching exhibitions for artist {}: {}", artistId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibitions", e);
        }
    }

    @Override
    public Optional<ExhibitionDTO> getExhibitionById(Integer exhibitionId) {
        logger.info("Fetching exhibition by ID: {}", exhibitionId);

        String sql = "SELECT * FROM artist_exhibitions WHERE exhibition_id = ?";

        try {
            ExhibitionDTO exhibition = jdbcTemplate.queryForObject(sql, exhibitionRowMapper, exhibitionId);
            return Optional.of(exhibition);
        } catch (EmptyResultDataAccessException e) {
            logger.warn("Exhibition not found with ID: {}", exhibitionId);
            return Optional.empty();
        } catch (Exception e) {
            logger.error("Error fetching exhibition {}: {}", exhibitionId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibition", e);
        }
    }

    @Override
    public ExhibitionDTO updateExhibition(Integer exhibitionId, ExhibitionDTO exhibitionDTO) {
        logger.info("Updating exhibition ID: {}", exhibitionId);

        String sql = """
            UPDATE artist_exhibitions SET
                title = ?, description = ?, location = ?, venue = ?,
                start_date = ?, end_date = ?, status = ?, exhibition_type = ?,
                artworks_count = ?, total_visitors = ?, website_url = ?,
                contact_email = ?, contact_phone = ?, entry_fee = ?, is_featured = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE exhibition_id = ?
        """;

        try {
            int rowsAffected = jdbcTemplate.update(sql,
                    exhibitionDTO.getTitle(),
                    exhibitionDTO.getDescription(),
                    exhibitionDTO.getLocation(),
                    exhibitionDTO.getVenue(),
                    exhibitionDTO.getStartDate(),
                    exhibitionDTO.getEndDate(),
                    exhibitionDTO.getStatus(),
                    exhibitionDTO.getExhibitionType(),
                    exhibitionDTO.getArtworksCount(),
                    exhibitionDTO.getTotalVisitors(),
                    exhibitionDTO.getWebsiteUrl(),
                    exhibitionDTO.getContactEmail(),
                    exhibitionDTO.getContactPhone(),
                    exhibitionDTO.getEntryFee(),
                    exhibitionDTO.getIsFeatured(),
                    exhibitionId
            );

            if (rowsAffected > 0) {
                return getExhibitionById(exhibitionId).orElse(null);
            } else {
                logger.warn("No exhibition found with ID: {}", exhibitionId);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating exhibition {}: {}", exhibitionId, e.getMessage(), e);
            throw new RuntimeException("Failed to update exhibition", e);
        }
    }

    @Override
    public boolean deleteExhibition(Integer exhibitionId) {
        logger.info("Deleting exhibition ID: {}", exhibitionId);

        String sql = "DELETE FROM artist_exhibitions WHERE exhibition_id = ?";

        try {
            int rowsAffected = jdbcTemplate.update(sql, exhibitionId);
            boolean deleted = rowsAffected > 0;

            if (deleted) {
                logger.info("Successfully deleted exhibition ID: {}", exhibitionId);
            } else {
                logger.warn("No exhibition found to delete with ID: {}", exhibitionId);
            }

            return deleted;
        } catch (Exception e) {
            logger.error("Error deleting exhibition {}: {}", exhibitionId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete exhibition", e);
        }
    }

    @Override
    public List<ExhibitionDTO> getExhibitionsByStatus(String status) {
        logger.info("Fetching exhibitions by status: {}", status);

        String sql = """
            SELECT * FROM artist_exhibitions 
            WHERE status = ? 
            ORDER BY start_date ASC
        """;

        try {
            return jdbcTemplate.query(sql, exhibitionRowMapper, status);
        } catch (Exception e) {
            logger.error("Error fetching exhibitions by status {}: {}", status, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibitions by status", e);
        }
    }

    @Override
    public List<ExhibitionDTO> getFeaturedExhibitions() {
        logger.info("Fetching featured exhibitions");

        String sql = """
            SELECT * FROM artist_exhibitions 
            WHERE is_featured = true 
            ORDER BY start_date DESC
        """;

        try {
            return jdbcTemplate.query(sql, exhibitionRowMapper);
        } catch (Exception e) {
            logger.error("Error fetching featured exhibitions: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch featured exhibitions", e);
        }
    }

    @Override
    public Map<String, Object> getExhibitionStatistics(Integer artistId) {
        logger.info("Fetching exhibition statistics for artist ID: {}", artistId);

        String sql = """
            SELECT 
                COUNT(*) as total_exhibitions,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exhibitions,
                COUNT(CASE WHEN status = 'upcoming' THEN 1 END) as upcoming_exhibitions,
                COUNT(CASE WHEN status = 'ongoing' THEN 1 END) as ongoing_exhibitions,
                COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_exhibitions,
                COALESCE(SUM(artworks_count), 0) as total_artworks_exhibited,
                COALESCE(SUM(total_visitors), 0) as total_visitors,
                COALESCE(AVG(total_visitors), 0) as avg_visitors_per_exhibition
            FROM artist_exhibitions 
            WHERE artist_id = ?
        """;

        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Map<String, Object> stats = new HashMap<>();
                stats.put("totalExhibitions", rs.getInt("total_exhibitions"));
                stats.put("completedExhibitions", rs.getInt("completed_exhibitions"));
                stats.put("upcomingExhibitions", rs.getInt("upcoming_exhibitions"));
                stats.put("ongoingExhibitions", rs.getInt("ongoing_exhibitions"));
                stats.put("featuredExhibitions", rs.getInt("featured_exhibitions"));
                stats.put("totalArtworksExhibited", rs.getInt("total_artworks_exhibited"));
                stats.put("totalVisitors", rs.getInt("total_visitors"));
                stats.put("avgVisitorsPerExhibition", rs.getDouble("avg_visitors_per_exhibition"));
                return stats;
            }, artistId);
        } catch (Exception e) {
            logger.error("Error fetching exhibition statistics for artist {}: {}", artistId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibition statistics", e);
        }
    }

    @Override
    public List<ExhibitionDTO> getAllExhibitions() {
        logger.info("Fetching all exhibitions");

        String sql = """
            SELECT 
                id as exhibition_id, 
                created_by as artist_id, 
                title, 
                description,
                location, 
                location as venue, 
                start_date, 
                end_date, 
                status,
                category as exhibition_type, 
                max_participants as artworks_count,
                0 as total_visitors, 
                NULL as featured_image_url,
                NULL as website_url, 
                contact_email, 
                contact_phone,
                CAST(REPLACE(entry_fee, ',', '') AS DECIMAL(10,2)) as entry_fee, 
                false as is_featured,
                created_at, 
                created_at as updated_at
            FROM exhibitions
            ORDER BY created_at DESC
        """;

        try {
            return jdbcTemplate.query(sql, exhibitionRowMapper);
        } catch (Exception e) {
            logger.error("Error fetching all exhibitions: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch exhibitions", e);
        }
    }

    @Override
    public boolean updateExhibitionStatus(Integer exhibitionId, String status, String reason) {
        logger.info("Updating exhibition status for ID: {} to status: {}", exhibitionId, status);

        String sql = """
            UPDATE exhibitions 
            SET status = ?, 
                requirements = CASE 
                    WHEN ? IS NOT NULL AND ? != '' THEN ? 
                    ELSE requirements 
                END
            WHERE id = ?
        """;

        try {
            int rowsAffected = jdbcTemplate.update(sql, status, reason, reason, reason, exhibitionId);
            logger.info("Updated {} rows for exhibition ID: {}", rowsAffected, exhibitionId);
            return rowsAffected > 0;
        } catch (Exception e) {
            logger.error("Error updating exhibition status for ID {}: {}", exhibitionId, e.getMessage(), e);
            throw new RuntimeException("Failed to update exhibition status", e);
        }
    }
}