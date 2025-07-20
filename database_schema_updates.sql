-- ===============================================
-- ArtAura Portfolio Database Schema Updates
-- Run these queries in phpMyAdmin
-- ===============================================

-- 1. Add portfolio-related columns to artists table
ALTER TABLE artists ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE artists ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE artists ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);
ALTER TABLE artists ADD COLUMN IF NOT EXISTS twitter VARCHAR(255);
ALTER TABLE artists ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE artists ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);
ALTER TABLE artists ADD COLUMN IF NOT EXISTS join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS total_views INT DEFAULT 0;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS total_followers INT DEFAULT 0;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS total_sales INT DEFAULT 0;

-- 2. Create artworks table for portfolio artworks
CREATE TABLE IF NOT EXISTS artworks (
    artwork_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artist_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    medium VARCHAR(255),
    size VARCHAR(255),
    year VARCHAR(4),
    price DECIMAL(10, 2),
    description TEXT,
    category VARCHAR(255),
    tags TEXT,
    status ENUM('Available', 'Sold', 'Reserved') DEFAULT 'Available',
    image_url VARCHAR(500),
    likes_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

-- 3. Create exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
    exhibition_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artist_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    exhibition_date DATE,
    status ENUM('Upcoming', 'Ongoing', 'Completed') DEFAULT 'Upcoming',
    artwork_count INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

-- 4. Create achievements/badges table
CREATE TABLE IF NOT EXISTS achievements (
    achievement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artist_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('winner', 'featured', 'runner-up', 'special') DEFAULT 'winner',
    achievement_date DATE,
    prize VARCHAR(255),
    description TEXT,
    icon_type VARCHAR(50), -- For storing icon type reference
    color_scheme VARCHAR(50), -- For storing color scheme
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

-- 5. Create artwork_likes table for tracking likes
CREATE TABLE IF NOT EXISTS artwork_likes (
    like_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artwork_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('artist', 'buyer', 'shop_owner') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (artwork_id, user_id, user_type),
    FOREIGN KEY (artwork_id) REFERENCES artworks(artwork_id) ON DELETE CASCADE
);

-- 6. Create artwork_views table for tracking views
CREATE TABLE IF NOT EXISTS artwork_views (
    view_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artwork_id BIGINT NOT NULL,
    user_id BIGINT,
    user_type ENUM('artist', 'buyer', 'shop_owner', 'guest'),
    ip_address VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(artwork_id) ON DELETE CASCADE
);

-- 7. Create portfolio_stats table for analytics
CREATE TABLE IF NOT EXISTS portfolio_stats (
    stat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artist_id BIGINT NOT NULL,
    stat_date DATE NOT NULL,
    total_views INT DEFAULT 0,
    total_likes INT DEFAULT 0,
    total_comments INT DEFAULT 0,
    total_shares INT DEFAULT 0,
    new_followers INT DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_daily_stat (artist_id, stat_date),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

-- 8. Add indexes for better performance
CREATE INDEX idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_artworks_featured ON artworks(is_featured);
CREATE INDEX idx_exhibitions_artist_id ON exhibitions(artist_id);
CREATE INDEX idx_achievements_artist_id ON achievements(artist_id);
CREATE INDEX idx_artwork_likes_artwork_id ON artwork_likes(artwork_id);
CREATE INDEX idx_artwork_views_artwork_id ON artwork_views(artwork_id);
CREATE INDEX idx_portfolio_stats_artist_id ON portfolio_stats(artist_id);

-- 9. Insert sample data for testing (Optional)
-- Sample achievements
INSERT INTO achievements (artist_id, title, type, achievement_date, prize, description, icon_type, color_scheme) VALUES 
(1, 'Abstract Emotions Challenge', 'winner', '2024-01-10', '$600', 'First place in abstract art competition', 'trophy', 'yellow'),
(1, 'Digital Dreams Exhibition', 'featured', '2023-12-15', 'Featured Artist', 'Featured in digital art exhibition', 'star', 'blue'),
(1, 'Winter Landscapes', 'runner-up', '2023-11-20', '2nd Place', 'Second place in landscape competition', 'medal', 'gray'),
(1, 'Community Choice Award', 'special', '2023-10-05', 'People\'s Choice', 'Voted by community as favorite artist', 'award', 'purple');

-- Sample exhibitions
INSERT INTO exhibitions (artist_id, title, location, exhibition_date, status, artwork_count, description) VALUES 
(1, 'Modern Art Showcase', 'Downtown Gallery', '2024-02-15', 'Upcoming', 3, 'Contemporary art exhibition'),
(1, 'Digital Dreams Exhibition', 'Virtual Space', '2023-12-15', 'Completed', 2, 'Online digital art showcase');

-- Sample artworks
INSERT INTO artworks (artist_id, title, medium, size, year, price, description, category, status, image_url, likes_count, views_count, is_featured) VALUES 
(1, 'Sunset Dreams', 'Oil on Canvas', '24" x 36"', '2024', 1200.00, 'A beautiful sunset painting', 'Landscape', 'Available', 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg', 45, 234, TRUE),
(1, 'Urban Reflection', 'Digital Art', 'Digital Print', '2024', 450.00, 'Urban cityscape digital art', 'Digital', 'Sold', 'https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg', 32, 189, FALSE),
(1, 'Abstract Flow', 'Acrylic on Canvas', '18" x 24"', '2023', 800.00, 'Abstract flowing forms', 'Abstract', 'Available', 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg', 67, 345, TRUE);

-- Update sample artist profile data
UPDATE artists SET 
    bio = 'Contemporary artist specializing in abstract expressionism and digital art. My work explores the intersection of emotion and color, creating pieces that speak to the human experience.',
    location = 'New York, NY',
    website = 'www.sarahmartinez.art',
    instagram = '@sarahmartinez_art',
    twitter = '@sarah_art',
    avatar_url = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    cover_image_url = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg',
    total_views = 12847,
    total_followers = 342,
    total_sales = 18
WHERE artist_id = 1;
