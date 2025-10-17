-- Create notifications table for storing user notifications
CREATE TABLE user_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_type ENUM('BUYER', 'ARTIST', 'SHOP') NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'commission_accepted', 'commission_rejected', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    commission_request_id BIGINT DEFAULT NULL,
    artist_deadline DATE DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_notifications_user_id (user_id),
    INDEX idx_user_notifications_user_type (user_type),
    INDEX idx_user_notifications_is_read (is_read),
    INDEX idx_user_notifications_created_at (created_at),
    
    FOREIGN KEY (commission_request_id) REFERENCES commission_requests(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_user_notifications_composite ON user_notifications(user_id, user_type, is_read);

-- Sample data (optional - for testing)
INSERT INTO user_notifications (user_id, user_type, type, title, message, commission_request_id, is_read) VALUES
(1, 'BUYER', 'commission_accepted', 'Commission Accepted!', 'Your commission request "Portrait of a Family" has been accepted by the artist.', 7, FALSE),
(1, 'BUYER', 'commission_rejected', 'Commission Request Update', 'Unfortunately, your commission request "Pet Sculpture" has been declined. Reason: Too busy with current projects.', 9, FALSE);
