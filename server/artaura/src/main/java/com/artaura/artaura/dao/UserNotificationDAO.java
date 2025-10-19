package com.artaura.artaura.dao;

import com.artaura.artaura.dto.notification.UserNotificationDTO;
import com.artaura.artaura.entity.UserNotification.UserType;
import java.util.List;

public interface UserNotificationDAO {
    /**
     * Create a new user notification
     * @param dto The notification data
     * @return true if creation was successful
     */
    boolean createNotification(UserNotificationDTO dto);
    
    /**
     * Get all notifications for a specific user
     * @param userId The user ID
     * @param userType The type of user (BUYER, ARTIST, SHOP)
     * @return List of notifications
     */
    List<UserNotificationDTO> getNotificationsByUser(Long userId, UserType userType);
    
    /**
     * Get unread notifications for a specific user
     * @param userId The user ID
     * @param userType The type of user (BUYER, ARTIST, SHOP)
     * @return List of unread notifications
     */
    List<UserNotificationDTO> getUnreadNotificationsByUser(Long userId, UserType userType);
    
    /**
     * Mark a notification as read
     * @param notificationId The notification ID
     * @return true if update was successful
     */
    boolean markAsRead(Long notificationId);
    
    /**
     * Mark all notifications as read for a user
     * @param userId The user ID
     * @param userType The type of user
     * @return true if update was successful
     */
    boolean markAllAsRead(Long userId, UserType userType);
    
    /**
     * Delete a notification
     * @param notificationId The notification ID
     * @return true if deletion was successful
     */
    boolean deleteNotification(Long notificationId);
}
