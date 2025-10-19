package com.artaura.artaura.service;

import com.artaura.artaura.entity.ArtistNotification;
import com.artaura.artaura.repository.ArtistNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ArtistNotificationService {

    @Autowired
    private ArtistNotificationRepository artistNotificationRepository;

    /**
     * Get all notifications for an artist
     */
    public List<ArtistNotification> getNotificationsByArtistId(Long artistId) {
        return artistNotificationRepository.findByArtistIdOrderByCreatedAtDesc(artistId);
    }

    /**
     * Get unread notifications for an artist
     */
    public List<ArtistNotification> getUnreadNotificationsByArtistId(Long artistId) {
        return artistNotificationRepository.findByArtistIdAndIsReadFalseOrderByCreatedAtDesc(artistId);
    }

    /**
     * Get count of unread notifications for an artist
     */
    public Long getUnreadNotificationCount(Long artistId) {
        return artistNotificationRepository.countUnreadByArtistId(artistId);
    }

    /**
     * Create a new notification
     */
    public ArtistNotification createNotification(Long artistId, String notificationBody) {
        ArtistNotification notification = new ArtistNotification(artistId, notificationBody);
        return artistNotificationRepository.save(notification);
    }

    /**
     * Mark a notification as read
     */
    public boolean markAsRead(Long notificationId, Long artistId) {
        Optional<ArtistNotification> notificationOpt = artistNotificationRepository.findById(notificationId);

        if (notificationOpt.isPresent()) {
            ArtistNotification notification = notificationOpt.get();

            // Verify the notification belongs to the artist
            if (notification.getArtistId().equals(artistId)) {
                notification.setIsRead(true);
                notification.setUpdatedAt(LocalDateTime.now());
                artistNotificationRepository.save(notification);
                return true;
            }
        }
        return false;
    }

    /**
     * Mark all notifications as read for an artist
     */
    @Transactional
    public void markAllAsRead(Long artistId) {
        List<ArtistNotification> unreadNotifications = artistNotificationRepository
                .findByArtistIdAndIsReadFalseOrderByCreatedAtDesc(artistId);

        for (ArtistNotification notification : unreadNotifications) {
            notification.setIsRead(true);
            notification.setUpdatedAt(LocalDateTime.now());
        }

        artistNotificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Delete a notification (if owned by the artist)
     */
    public boolean deleteNotification(Long notificationId, Long artistId) {
        Optional<ArtistNotification> notificationOpt = artistNotificationRepository.findById(notificationId);

        if (notificationOpt.isPresent()) {
            ArtistNotification notification = notificationOpt.get();

            // Verify the notification belongs to the artist
            if (notification.getArtistId().equals(artistId)) {
                artistNotificationRepository.delete(notification);
                return true;
            }
        }
        return false;
    }
}
