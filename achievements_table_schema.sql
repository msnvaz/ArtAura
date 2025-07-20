-- ===============================================
-- ArtAura Achievements Table Schema
-- Run this query in phpMyAdmin
-- ===============================================

-- Create achievements table for artist achievements
CREATE TABLE IF NOT EXISTS achievements (
    achievement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artist_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('winner', 'featured', 'runner-up', 'special', 'certificate', 'award') NOT NULL,
    achievement_date DATE NOT NULL,
    prize VARCHAR(255),
    description TEXT,
    icon_type ENUM('trophy', 'star', 'medal', 'award', 'certificate', 'badge') DEFAULT 'award',
    color_scheme ENUM('gold', 'silver', 'bronze', 'blue', 'purple', 'green', 'red') DEFAULT 'gold',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

-- Insert sample achievements data
INSERT INTO achievements (artist_id, title, type, achievement_date, prize, description, icon_type, color_scheme) VALUES
(1, 'Abstract Emotions Challenge', 'winner', '2024-01-10', '$600', 'First place in the Abstract Emotions art challenge with innovative emotional expression techniques.', 'trophy', 'gold'),
(1, 'Digital Dreams Exhibition', 'featured', '2023-12-15', 'Featured Artist', 'Selected as featured artist in the prestigious Digital Dreams exhibition showcasing contemporary digital art.', 'star', 'blue'),
(1, 'Winter Landscapes', 'runner-up', '2023-11-20', '2nd Place', 'Second place in Winter Landscapes competition for outstanding landscape artwork.', 'medal', 'silver'),
(1, 'Community Choice Award', 'special', '2023-10-05', 'People\'s Choice', 'Awarded by community voting for most beloved artwork of the month.', 'award', 'purple'),
(2, 'Modern Art Showcase', 'winner', '2024-02-28', '$800', 'First place in Modern Art Showcase with groundbreaking contemporary pieces.', 'trophy', 'gold'),
(2, 'Emerging Artist Certificate', 'certificate', '2024-01-15', 'Certificate of Excellence', 'Recognized as emerging artist with exceptional potential in contemporary art.', 'certificate', 'green');
