-- Execute this on your remote MySQL database to restore functionality
-- Database: artaura_db on mysql-artaura.alwaysdata.net:3306

-- Create challenges table
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

-- Create challenge_participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    challenge_id BIGINT NOT NULL,
    artist_id BIGINT NOT NULL,
    artwork_title VARCHAR(255) NOT NULL,
    artwork_description TEXT,
    artwork_image_path VARCHAR(500),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('submitted', 'approved', 'rejected') DEFAULT 'submitted',
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_artist_challenge (challenge_id, artist_id)
);

-- Insert sample challenges
INSERT IGNORE INTO challenges (
    title, category, publish_date_time, deadline_date_time, description, max_participants, rewards, status
) VALUES 
('Digital Art Challenge 2025', 'Digital Art', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 
 'Create stunning digital artwork showcasing your unique style and creativity.', 
 100, 'Winner: $1000, Runner-up: $500', 'active'),
 
('Abstract Expression Contest', 'Abstract', '2025-02-01 00:00:00', '2025-11-30 23:59:59', 
 'Express your emotions and thoughts through abstract art.', 
 50, 'Winner: $500, Runner-up: $200', 'active'),
 
('Portrait Masters Challenge', 'Portrait', '2025-03-01 00:00:00', '2025-12-15 23:59:59', 
 'Show your mastery in portrait art.', 
 75, 'Winner: $750, Runner-up: $300', 'active');

-- Verify setup
SELECT 'Challenges table created with count:' as info, COUNT(*) as count FROM challenges;
SELECT 'Challenge participants table exists:' as info, COUNT(*) as count FROM challenge_participants;
