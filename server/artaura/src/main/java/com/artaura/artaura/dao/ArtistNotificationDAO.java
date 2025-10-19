package com.artaura.artaura.dao;

import com.artaura.artaura.dto.notification.ArtistNotificationDTO;
import java.util.List;

public interface ArtistNotificationDAO {
    /**
     * Create a new artist notification
     * @param dto The notification data
     * @return true if creation was successful
     */
    boolean createNotification(ArtistNotificationDTO dto);
    
    /**
     * Get all notifications for a specific artist
     * @param artistId The artist ID
     * @return List of notifications
     */
    List<ArtistNotificationDTO> getNotificationsByArtist(Long artistId);
    
    /**
     * Get unread notifications for a specific artist
     * @param artistId The artist ID
     * @return List of unread notifications
     */
    List<ArtistNotificationDTO> getUnreadNotificationsByArtist(Long artistId);
    
    /**
     * Mark a notification as read
     * @param notificationId The notification ID
     * @return true if update was successful
     */
    boolean markAsRead(Long notificationId);
    
    /**
     * Mark all notifications as read for an artist
     * @param artistId The artist ID
     * @return true if update was successful
     */
    boolean markAllAsRead(Long artistId);
    
    /**
     * Delete a notification
     * @param notificationId The notification ID
     * @return true if deletion was successful
     */
    boolean deleteNotification(Long notificationId);
}
