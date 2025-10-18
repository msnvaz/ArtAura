-- Create Challenge Participants Table with proper foreign key handling
-- First, let's check and create the challenges table if it doesn't exist

-- Create challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS challenges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    publish_date_time DATETIME,
    deadline_date_time DATETIME,
    description TEXT,
    max_participants INT DEFAULT 100,
    rewards TEXT,
    request_sponsorship BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'active', 'closed', 'cancelled') DEFAULT 'draft',
    image_path VARCHAR(500),
    prize_amount DECIMAL(10,2),
    current_participants INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create challenge_participants table WITHOUT foreign key constraints initially
CREATE TABLE IF NOT EXISTS challenge_participants (
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
    
    -- Add indexes
    UNIQUE KEY unique_artist_challenge (challenge_id, artist_id),
    INDEX idx_challenge_id (challenge_id),
    INDEX idx_artist_id (artist_id),
    INDEX idx_submission_date (submission_date),
    INDEX idx_status (status)
);

-- Add foreign key constraints only if the referenced tables exist
-- You can run these separately after confirming the table structures

-- Uncomment and run these lines only after verifying the challenges and artists tables exist:
-- ALTER TABLE challenge_participants 
-- ADD CONSTRAINT fk_challenge_participants_challenge 
-- FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE;

-- ALTER TABLE challenge_participants 
-- ADD CONSTRAINT fk_challenge_participants_artist 
-- FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE;

-- Insert sample challenges for testing
INSERT IGNORE INTO challenges (
    title, 
    category, 
    publish_date_time, 
    deadline_date_time, 
    description, 
    max_participants, 
    rewards, 
    request_sponsorship, 
    status,
    prize_amount
) VALUES 
(
    'Digital Art Challenge 2025',
    'Digital Art',
    '2025-10-18 00:00:00',
    '2025-12-31 23:59:59',
    'Create stunning digital artwork showcasing your unique style and creativity. Open to all digital art forms including illustrations, concept art, and digital paintings.',
    100,
    'Winner: $1000, Runner-up: $500, Third place: $250',
    false,
    'active',
    1000.00
),
(
    'Abstract Expression Contest',
    'Abstract',
    '2025-10-18 00:00:00',
    '2025-11-30 23:59:59',
    'Express your emotions and thoughts through abstract art. Any medium is welcome - traditional or digital.',
    50,
    'Winner: $750, Best Technique: $300',
    false,
    'active',
    750.00
),
(
    'Portrait Mastery Challenge',
    'Portrait',
    '2025-10-20 00:00:00',
    '2025-12-15 23:59:59',
    'Showcase your portrait skills with this exciting challenge. Create compelling portraits that capture emotion and personality.',
    75,
    'Winner: $800, People\'s Choice: $200',
    false,
    'active',
    800.00
);
