-- Create artist_exhibitions table
CREATE TABLE artist_exhibitions (
    exhibition_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    venue VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    exhibition_type ENUM('solo', 'group', 'virtual', 'popup') DEFAULT 'group',
    artworks_count INT DEFAULT 0,
    total_visitors INT DEFAULT 0,
    featured_image_url VARCHAR(500),
    website_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    entry_fee DECIMAL(10, 2) DEFAULT 0.00,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_artist_exhibitions_artist_id (artist_id),
    INDEX idx_artist_exhibitions_status (status),
    INDEX idx_artist_exhibitions_dates (start_date, end_date)
);

-- IMPORTANT: Before inserting sample data, check what artist IDs exist:
-- SELECT artist_id FROM artists ORDER BY artist_id;
-- Replace the artist_id values below with actual IDs from your artists table

-- Insert sample exhibition data for testing
-- UPDATE THE ARTIST_ID VALUES (11, 15, etc.) WITH ACTUAL IDs FROM YOUR ARTISTS TABLE
INSERT INTO artist_exhibitions (
    artist_id, title, description, location, venue, start_date, end_date, 
    status, exhibition_type, artworks_count, total_visitors, 
    website_url, contact_email, entry_fee, is_featured
) VALUES 
(11, 'Modern Art Showcase', 'A contemporary exhibition featuring digital and traditional art pieces exploring modern themes.', 'Downtown Gallery District', 'Gallery ModernSpace', '2025-02-15', '2025-03-15', 'upcoming', 'solo', 12, 0, 'https://modernartshowcase.com', 'contact@modernart.com', 15.00, TRUE),
(11, 'Digital Dreams Exhibition', 'Virtual exhibition showcasing digital art and NFT collections.', 'Virtual Platform', 'ArtSpace Online', '2024-12-15', '2025-01-15', 'completed', 'virtual', 8, 245, 'https://digitaldreams.art', 'info@digitaldreams.art', 0.00, FALSE),
(11, 'Abstract Expressions', 'Group exhibition featuring abstract paintings and sculptures.', 'City Art Center', 'Main Exhibition Hall', '2025-04-10', '2025-05-10', 'upcoming', 'group', 5, 0, NULL, 'curator@cityartcenter.org', 12.50, FALSE);

-- Query to check the created table and data
SELECT * FROM artist_exhibitions ORDER BY created_at DESC;

-- Query to get exhibitions for a specific artist
SELECT * FROM artist_exhibitions WHERE artist_id = 1 ORDER BY start_date DESC;

-- Query to get upcoming exhibitions
SELECT * FROM artist_exhibitions WHERE status = 'upcoming' ORDER BY start_date ASC;

-- Query to get exhibition statistics for an artist
SELECT 
    COUNT(*) as total_exhibitions,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exhibitions,
    COUNT(CASE WHEN status = 'upcoming' THEN 1 END) as upcoming_exhibitions,
    COUNT(CASE WHEN is_featured = TRUE THEN 1 END) as featured_exhibitions,
    SUM(artworks_count) as total_artworks_exhibited,
    SUM(total_visitors) as total_visitors
FROM artist_exhibitions 
WHERE artist_id = 1;
