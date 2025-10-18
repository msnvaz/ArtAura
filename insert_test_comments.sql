-- First, let's check if the tables exist
SHOW TABLES LIKE 'post_%';

-- Insert some test comments for post_id 57 (the one you're testing)
-- Note: You'll need to replace the user_id values with actual user IDs from your artists/buyers tables

-- First, let's see what users exist
SELECT 'Available Artists:' as info;
SELECT artist_id, first_name, last_name FROM artists LIMIT 5;

SELECT 'Available Buyers:' as info;
SELECT buyer_id, first_name, last_name FROM buyers LIMIT 5;

-- Check if post_id 57 exists
SELECT 'Post 57 exists:' as info;
SELECT post_id, title FROM AW_posts WHERE post_id = 57;

-- Insert test comments (replace user_id with actual values from above queries)
-- Example comments - you'll need to adjust the user_id values
INSERT INTO post_comments (post_id, user_id, user_type, comment_text, parent_comment_id) VALUES
(57, 1, 'BUYER', 'This is a beautiful artwork! I love the colors.', NULL),
(57, 2, 'ARTIST', 'Thank you so much! This took me about 3 hours to complete.', NULL),
(57, 3, 'BUYER', 'Amazing detail work! How did you achieve this effect?', NULL);

-- Insert a reply to the first comment
INSERT INTO post_comments (post_id, user_id, user_type, comment_text, parent_comment_id) VALUES
(57, 2, 'ARTIST', 'I really appreciate your kind words!', 1);

-- Verify the inserted comments
SELECT 'Test comments inserted:' as info;
SELECT pc.*, 
       CASE 
           WHEN pc.user_type = 'ARTIST' THEN CONCAT(a.first_name, ' ', a.last_name)
           WHEN pc.user_type = 'BUYER' THEN CONCAT(b.first_name, ' ', b.last_name)
       END as user_name
FROM post_comments pc
LEFT JOIN artists a ON pc.user_id = a.artist_id AND pc.user_type = 'ARTIST'
LEFT JOIN buyers b ON pc.user_id = b.buyer_id AND pc.user_type = 'BUYER'
WHERE pc.post_id = 57
ORDER BY pc.created_at ASC;
