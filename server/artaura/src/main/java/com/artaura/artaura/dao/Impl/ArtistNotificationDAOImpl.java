package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ArtistNotificationDAO;
import com.artaura.artaura.dto.notification.ArtistNotificationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ArtistNotificationDAOImpl implements ArtistNotificationDAO {

    @Autowired
    private JdbcTemplate jdbc;

    // Row mapper for artist notifications
    private RowMapper<ArtistNotificationDTO> artistNotificationRowMapper = new RowMapper<ArtistNotificationDTO>() {
        @Override
        public ArtistNotificationDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ArtistNotificationDTO dto = new ArtistNotificationDTO();
            dto.setNotificationId(rs.getLong("notification_id"));
            dto.setArtistId(rs.getLong("artist_id"));
            dto.setNotificationBody(rs.getString("notification_body"));
            dto.setIsRead(rs.getBoolean("is_read"));
            
            if (rs.getTimestamp("created_at") != null) {
                dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            }
            if (rs.getTimestamp("updated_at") != null) {
                dto.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            }
            
            return dto;
        }
    };

    @Override
    public boolean createNotification(ArtistNotificationDTO dto) {
        try {
            String sql = """
                INSERT INTO artist_notifications 
                (artist_id, notification_body, is_read, created_at, updated_at)
                VALUES (?, ?, ?, NOW(), NOW())
            """;
            
            int rowsAffected = jdbc.update(sql,
                dto.getArtistId(),
                dto.getNotificationBody(),
                dto.getIsRead() != null ? dto.getIsRead() : false
            );
            
            System.out.println("✅ ArtistNotificationDAO: Created notification for artist " + dto.getArtistId());
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ ArtistNotificationDAO: Failed to create notification: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<ArtistNotificationDTO> getNotificationsByArtist(Long artistId) {
        try {
            String sql = """
                SELECT * FROM artist_notifications 
                WHERE artist_id = ?
                ORDER BY created_at DESC
            """;
            
            return jdbc.query(sql, artistNotificationRowMapper, artistId);
        } catch (Exception e) {
            System.out.println("❌ ArtistNotificationDAO: Failed to get notifications: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<ArtistNotificationDTO> getUnreadNotificationsByArtist(Long artistId) {
        try {
            String sql = """
                SELECT * FROM artist_notifications 
                WHERE artist_id = ? AND is_read = 0
                ORDER BY created_at DESC
            """;
            
            return jdbc.query(sql, artistNotificationRowMapper, artistId);
        } catch (Exception e) {
            System.out.println("❌ ArtistNotificationDAO: Failed to get unread notifications: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public boolean markAsRead(Long notificationId) {
        try {
            String sql = "UPDATE artist_notifications SET is_read = 1, updated_at = NOW() WHERE notification_id = ?";
            int rowsAffected = jdbc.update(sql, notificationId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ ArtistNotificationDAO: Failed to mark notification as read: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean markAllAsRead(Long artistId) {
        try {
            String sql = "UPDATE artist_notifications SET is_read = 1, updated_at = NOW() WHERE artist_id = ?";
            int rowsAffected = jdbc.update(sql, artistId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ ArtistNotificationDAO: Failed to mark all notifications as read: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean deleteNotification(Long notificationId) {
        try {
            String sql = "DELETE FROM artist_notifications WHERE notification_id = ?";
            int rowsAffected = jdbc.update(sql, notificationId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ ArtistNotificationDAO: Failed to delete notification: " + e.getMessage());
            return false;
        }
    }
}
