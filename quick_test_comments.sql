-- Simple test to add comments for post_id 57
-- This will use the first available user IDs from your database

-- First check what exists
SELECT 'Checking tables...' as status;
SHOW TABLES LIKE 'post_%';

-- Get first artist and buyer ID
SELECT 'First artist:' as info;
SELECT artist_id, first_name, last_name FROM artists ORDER BY artist_id LIMIT 1;

SELECT 'First buyer:' as info;  
SELECT buyer_id, first_name, last_name FROM buyers ORDER BY buyer_id LIMIT 1;

-- Create test comments using dynamic user IDs
SET @artist_id = (SELECT artist_id FROM artists ORDER BY artist_id LIMIT 1);
SET @buyer_id = (SELECT buyer_id FROM buyers ORDER BY buyer_id LIMIT 1);

-- Insert test comments
INSERT INTO post_comments (post_id, user_id, user_type, comment_text) VALUES
(57, @buyer_id, 'BUYER', 'This is a test comment from a buyer!'),
(57, @artist_id, 'ARTIST', 'This is a test comment from an artist!'),
(57, @buyer_id, 'BUYER', 'Another test comment to verify the system works.');

-- Show the results
SELECT 'Comments for post 57:' as info;
SELECT pc.id, pc.post_id, pc.user_id, pc.user_type, pc.comment_text, pc.created_at,
       CASE 
           WHEN pc.user_type = 'ARTIST' THEN CONCAT(a.first_name, ' ', a.last_name)
           WHEN pc.user_type = 'BUYER' THEN CONCAT(b.first_name, ' ', b.last_name)
       END as user_name
FROM post_comments pc
LEFT JOIN artists a ON pc.user_id = a.artist_id AND pc.user_type = 'ARTIST'
LEFT JOIN buyers b ON pc.user_id = b.buyer_id AND pc.user_type = 'BUYER'
WHERE pc.post_id = 57
ORDER BY pc.created_at ASC;
