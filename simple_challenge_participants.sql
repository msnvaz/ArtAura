-- Simple Challenge Participants Table (No Foreign Key Constraints)
-- Use this version if you're having foreign key constraint issues

DROP TABLE IF EXISTS challenge_participants;

CREATE TABLE challenge_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    challenge_id BIGINT NOT NULL,
    artist_id BIGINT NOT NULL,
    artwork_title VARCHAR(255) NOT NULL,
    artwork_description TEXT,
    artwork_image_path VARCHAR(500) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('submitted', 'under_review', 'approved', 'rejected', 'winner') DEFAULT 'submitted',
    rating DECIMAL(3,2) DEFAULT NULL,
    judge_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Add indexes for performance
    UNIQUE KEY unique_artist_challenge (challenge_id, artist_id),
    INDEX idx_challenge_id (challenge_id),
    INDEX idx_artist_id (artist_id),
    INDEX idx_submission_date (submission_date),
    INDEX idx_status (status)
);

-- Create sample challenges with required fields
-- First get a moderator ID (use the first available moderator)
SET @moderator_id = (SELECT moderator_id FROM moderators LIMIT 1);

-- Insert sample challenges with proper values for all required fields
INSERT IGNORE INTO challenges (
    title, 
    category, 
    publish_date_time, 
    deadline_date_time, 
    description, 
    max_participants, 
    rewards, 
    status, 
    moderator_id
) VALUES 
(
    'Digital Art Challenge 2025', 
    'Digital Art',
    '2025-10-18 00:00:00',
    '2025-12-31 23:59:59', 
    'Create stunning digital artwork showcasing your unique style and creativity. Open to all digital art forms including illustrations, concept art, and digital paintings.', 
    100, 
    'Winner: $1000, Runner-up: $500, Third place: $250', 
    'active',
    @moderator_id
),
(
    'Abstract Expression Contest', 
    'Abstract',
    '2025-10-18 00:00:00',
    '2025-11-30 23:59:59', 
    'Express your emotions and thoughts through abstract art. Any medium is welcome - traditional or digital.', 
    50, 
    'Winner: $750, Best Technique: $300', 
    'active',
    @moderator_id
),
(
    'Portrait Mastery Challenge', 
    'Portrait',
    '2025-10-18 00:00:00',
    '2025-12-15 23:59:59', 
    'Showcase your portrait skills with this exciting challenge. Create compelling portraits that capture emotion and personality.', 
    75, 
    'Winner: $800, People''s Choice: $200', 
    'active',
    @moderator_id
);

-- Verify the table was created
DESCRIBE challenge_participants;
