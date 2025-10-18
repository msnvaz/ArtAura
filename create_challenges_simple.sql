-- Simple challenges table creation and sample data
-- This script creates the challenges table if it doesn't exist and adds sample challenges

-- Create challenges table if not exists
CREATE TABLE IF NOT EXISTS challenges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    publish_date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline_date_time TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    max_participants INT DEFAULT 100,
    rewards TEXT,
    status ENUM('draft', 'active', 'closed') DEFAULT 'active',
    request_sponsorship BOOLEAN DEFAULT FALSE,
    moderator_id BIGINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample challenges if they don't exist
INSERT IGNORE INTO challenges (
    id, title, category, publish_date_time, deadline_date_time, description, max_participants, rewards, status
) VALUES 
(1, 'Digital Art Challenge 2025', 'Digital Art', '2025-10-18 00:00:00', '2025-12-31 23:59:59', 
 'Create stunning digital artwork showcasing your unique style and creativity. Open to all digital art forms including illustrations, concept art, and digital paintings.', 
 100, 'Winner: $1000, Runner-up: $500, Third place: $250', 'active'),
 
(2, 'Abstract Expression Contest', 'Abstract', '2025-10-18 00:00:00', '2025-11-30 23:59:59', 
 'Express your emotions and thoughts through abstract art. Any medium is welcome - traditional or digital.', 
 50, 'Winner: $750, Best Technique: $300', 'active'),
 
(3, 'Portrait Mastery Challenge', 'Portrait', '2025-10-18 00:00:00', '2025-12-15 23:59:59', 
 'Showcase your portrait skills with this exciting challenge. Create compelling portraits that capture emotion and personality.', 
 75, 'Winner: $800, People''s Choice: $200', 'active');

-- Verify the data was inserted
SELECT id, title, category, status, deadline_date_time FROM challenges WHERE status = 'active';
