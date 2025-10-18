# PowerShell script to execute SQL commands
# Run this to create the challenges table and sample data

# MySQL connection details
$mysqlPath = "mysql"
$username = "root"
$password = "root"  # Change this to your MySQL password
$database = "artaura_development"

# SQL commands
$sqlCommands = @"
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

-- Create challenge_participants table if not exists
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
    
    UNIQUE KEY unique_artist_challenge (challenge_id, artist_id),
    INDEX idx_challenge_id (challenge_id),
    INDEX idx_artist_id (artist_id),
    INDEX idx_submission_date (submission_date),
    INDEX idx_status (status)
);

-- Insert sample challenges
INSERT IGNORE INTO challenges (
    id, title, category, publish_date_time, deadline_date_time, description, max_participants, rewards, status
) VALUES 
(1, 'Digital Art Challenge 2025', 'Digital Art', '2025-10-18 00:00:00', '2025-12-31 23:59:59', 
 'Create stunning digital artwork showcasing your unique style and creativity. Open to all digital art forms including illustrations, concept art, and digital paintings.', 
 100, 'Winner: \$1000, Runner-up: \$500, Third place: \$250', 'active'),
 
(2, 'Abstract Expression Contest', 'Abstract', '2025-10-18 00:00:00', '2025-11-30 23:59:59', 
 'Express your emotions and thoughts through abstract art. Any medium is welcome - traditional or digital.', 
 50, 'Winner: \$750, Best Technique: \$300', 'active'),
 
(3, 'Portrait Mastery Challenge', 'Portrait', '2025-10-18 00:00:00', '2025-12-15 23:59:59', 
 'Showcase your portrait skills with this exciting challenge. Create compelling portraits that capture emotion and personality.', 
 75, 'Winner: \$800, People''s Choice: \$200', 'active');

-- Verify the data
SELECT id, title, category, status, deadline_date_time FROM challenges WHERE status = 'active';
"@

Write-Output "Executing SQL commands..."
Write-Output $sqlCommands | & $mysqlPath -u $username -p$password $database

if ($LASTEXITCODE -eq 0) {
    Write-Output "✅ Database setup completed successfully!"
} else {
    Write-Output "❌ Error occurred during database setup. Exit code: $LASTEXITCODE"
}
