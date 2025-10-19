package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.UserNotificationDAO;
import com.artaura.artaura.dto.notification.UserNotificationDTO;
import com.artaura.artaura.entity.UserNotification.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserNotificationDAOImpl implements UserNotificationDAO {

    @Autowired
    private JdbcTemplate jdbc;

    // Row mapper for user notifications
    private RowMapper<UserNotificationDTO> userNotificationRowMapper = new RowMapper<UserNotificationDTO>() {
        @Override
        public UserNotificationDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserNotificationDTO dto = new UserNotificationDTO();
            dto.setId(rs.getLong("id"));
            dto.setUserId(rs.getLong("user_id"));
            dto.setUserType(UserType.valueOf(rs.getString("user_type")));
            dto.setType(rs.getString("type"));
            dto.setTitle(rs.getString("title"));
            dto.setMessage(rs.getString("message"));
            
            // Handle nullable fields
            if (rs.getObject("commission_request_id") != null) {
                dto.setCommissionRequestId(rs.getInt("commission_request_id"));
            }
            if (rs.getDate("artist_deadline") != null) {
                dto.setArtistDeadline(rs.getDate("artist_deadline").toLocalDate());
            }
            dto.setRejectionReason(rs.getString("rejection_reason"));
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
    public boolean createNotification(UserNotificationDTO dto) {
        try {
            String sql = """
                INSERT INTO user_notifications 
                (user_id, user_type, type, title, message, commission_request_id, 
                 artist_deadline, rejection_reason, is_read, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            """;
            
            int rowsAffected = jdbc.update(sql,
                dto.getUserId(),
                dto.getUserType().name(),
                dto.getType(),
                dto.getTitle(),
                dto.getMessage(),
                dto.getCommissionRequestId(),
                dto.getArtistDeadline(),
                dto.getRejectionReason(),
                dto.getIsRead() != null ? dto.getIsRead() : false
            );
            
            System.out.println("✅ UserNotificationDAO: Created notification for user " + dto.getUserId());
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ UserNotificationDAO: Failed to create notification: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<UserNotificationDTO> getNotificationsByUser(Long userId, UserType userType) {
        try {
            String sql = """
                SELECT * FROM user_notifications 
                WHERE user_id = ? AND user_type = ?
                ORDER BY created_at DESC
            """;
            
            return jdbc.query(sql, userNotificationRowMapper, userId, userType.name());
        } catch (Exception e) {
            System.out.println("❌ UserNotificationDAO: Failed to get notifications: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<UserNotificationDTO> getUnreadNotificationsByUser(Long userId, UserType userType) {
        try {
            String sql = """
                SELECT * FROM user_notifications 
                WHERE user_id = ? AND user_type = ? AND is_read = 0
                ORDER BY created_at DESC
            """;
            
            return jdbc.query(sql, userNotificationRowMapper, userId, userType.name());
        } catch (Exception e) {
            System.out.println("❌ UserNotificationDAO: Failed to get unread notifications: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public boolean markAsRead(Long notificationId) {
        try {
            String sql = "UPDATE user_notifications SET is_read = 1, updated_at = NOW() WHERE id = ?";
            int rowsAffected = jdbc.update(sql, notificationId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ UserNotificationDAO: Failed to mark notification as read: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean markAllAsRead(Long userId, UserType userType) {
        try {
            String sql = "UPDATE user_notifications SET is_read = 1, updated_at = NOW() WHERE user_id = ? AND user_type = ?";
            int rowsAffected = jdbc.update(sql, userId, userType.name());
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ UserNotificationDAO: Failed to mark all notifications as read: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean deleteNotification(Long notificationId) {
        try {
            String sql = "DELETE FROM user_notifications WHERE id = ?";
            int rowsAffected = jdbc.update(sql, notificationId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ UserNotificationDAO: Failed to delete notification: " + e.getMessage());
            return false;
        }
    }
}
