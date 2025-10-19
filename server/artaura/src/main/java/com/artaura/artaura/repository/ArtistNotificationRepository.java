package com.artaura.artaura.repository;

import com.artaura.artaura.entity.ArtistNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtistNotificationRepository extends JpaRepository<ArtistNotification, Long> {

    /**
     * Find all notifications for a specific artist ordered by creation date
     * (newest first)
     */
    List<ArtistNotification> findByArtistIdOrderByCreatedAtDesc(Long artistId);

    /**
     * Find unread notifications for a specific artist
     */
    List<ArtistNotification> findByArtistIdAndIsReadFalseOrderByCreatedAtDesc(Long artistId);

    /**
     * Count unread notifications for a specific artist
     */
    @Query("SELECT COUNT(n) FROM ArtistNotification n WHERE n.artistId = :artistId AND n.isRead = false")
    Long countUnreadByArtistId(@Param("artistId") Long artistId);

    /**
     * Mark all notifications as read for a specific artist
     */
    @Query("UPDATE ArtistNotification n SET n.isRead = true, n.updatedAt = CURRENT_TIMESTAMP WHERE n.artistId = :artistId AND n.isRead = false")
    void markAllAsReadByArtistId(@Param("artistId") Long artistId);
}
