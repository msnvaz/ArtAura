-- First, check what artist IDs exist in your artists table
SELECT artist_id FROM artists ORDER BY artist_id;

-- Alternative: Check all user IDs if using users table
-- SELECT user_id FROM users WHERE role = 'artist' ORDER BY user_id;

-- Based on the results above, update the INSERT statement with valid IDs
-- Replace the artist_id values (1, 2, 11) with actual IDs from your artists table

-- Example: If your artists table has artist_ids: 11, 15, 20, use those
INSERT INTO artist_exhibitions (
    artist_id, title, description, location, venue, start_date, end_date, 
    status, exhibition_type, artworks_count, total_visitors, 
    website_url, contact_email, entry_fee, is_featured
) VALUES 
(11, 'Modern Art Showcase', 'A contemporary exhibition featuring digital and traditional art pieces exploring modern themes.', 'Downtown Gallery District', 'Gallery ModernSpace', '2025-02-15', '2025-03-15', 'upcoming', 'solo', 12, 0, 'https://modernartshowcase.com', 'contact@modernart.com', 15.00, TRUE),
(11, 'Digital Dreams Exhibition', 'Virtual exhibition showcasing digital art and NFT collections.', 'Virtual Platform', 'ArtSpace Online', '2024-12-15', '2025-01-15', 'completed', 'virtual', 8, 245, 'https://digitaldreams.art', 'info@digitaldreams.art', 0.00, FALSE),
(11, 'Abstract Expressions', 'Group exhibition featuring abstract paintings and sculptures.', 'City Art Center', 'Main Exhibition Hall', '2025-04-10', '2025-05-10', 'upcoming', 'group', 5, 0, NULL, 'curator@cityartcenter.org', 12.50, FALSE);

-- If you want to add more sample data for different artists, 
-- make sure to use valid artist_id values from your artists table

-- Alternative approach: Create sample artists first, then exhibitions
-- INSERT INTO artists (artist_id, name, email) VALUES 
-- (1, 'Sample Artist 1', 'artist1@example.com'),
-- (2, 'Sample Artist 2', 'artist2@example.com');
-- Then use artist_id 1 and 2 in exhibitions

-- Safest approach for testing: Use only existing artist IDs
-- Run this query first to see available artist IDs:
-- SELECT artist_id, CONCAT(first_name, ' ', last_name) as artist_name FROM artists LIMIT 5;
